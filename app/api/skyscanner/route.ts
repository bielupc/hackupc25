import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

export async function POST(req: Request) {
  const apiKey = process.env.NEXT_PUBLIC_FLIGHTS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { query_legs } = body;

    if (!query_legs || !Array.isArray(query_legs) || query_legs.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid query_legs' }, { status: 400 });
    }

    const searchUrl = 'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create';

    const searchPayload = {
      query: {
        market: 'ES',
        locale: 'en-GB',
        currency: 'EUR',
        query_legs,
        adults: 1,
        cabin_class: 'CABIN_CLASS_ECONOMY',
      },
    };

    const createRes = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchPayload),
    });

    const createData = await createRes.json();

    if (!createRes.ok || !createData.sessionToken) {
      return NextResponse.json({ error: 'Failed to create session', detail: createData }, { status: 500 });
    }

    const sessionToken = createData.sessionToken;
    const pollUrl = `https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll/${sessionToken}`;

    // Función para esperar x milisegundos
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    let pollData;
    let agents;
    const maxRetries = 20;
    let attempt = 0;

    while (attempt < maxRetries) {
      const pollRes = await fetch(pollUrl, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      pollData = await pollRes.json();

      if (!pollRes.ok) {
        return NextResponse.json({ error: 'Failed to poll results', detail: pollData }, { status: 500 });
      }

      agents = pollData?.content?.results?.agents;

      if (agents && Object.keys(agents).length > 0) {
        break; // Exit loop if we have valid agents
      }

      attempt++;
      await delay(1500);
    }

    if (!agents || Object.keys(agents).length === 0) {
      return NextResponse.json({ error: 'No flight results found after retries' }, { status: 404 });
    }

    return NextResponse.json(formatData(pollData));
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Unexpected error', message: error.message }, { status: 500 });
  }
}


function formatData(data){
  const results = data?.content?.results;
  //console.log('raw data:', data);
  const cheapestSorting = data?.content?.sortingOptions?.cheapest;

  const cheapestItineraryId = 
  !cheapestSorting || cheapestSorting.length === 0
    ? results.itineraries[0]?.id
    : cheapestSorting[0]?.itineraryId;
  
  console.log(' ', cheapestItineraryId)
  const cheapestItinerary = results.itineraries[cheapestItineraryId];
  

  let minPrice = Number.MAX_VALUE;
  let minPriceUnit = '';
  for (let pricingOption of cheapestItinerary.pricingOptions) {
    let { amount, unit } = pricingOption.price;
    console.log('pricingOption', pricingOption);
    let bestAgent = pricingOption.agentIds[0];
    if (amount < minPrice) {
      minPrice = amount;
      minPriceUnit = unit;
      bestAgent = pricingOption.agentIds;
    }
  }

  if (minPriceUnit == 'PRICE_UNIT_MILLI') {
    minPrice = minPrice / 1000;
  }
  // TODO: add airline name
  return {
    cost: minPrice
  }
}


function transformString(input) {
  //9772-2505150725--31685-0-10413-2505150925
  //9722-10413-2505150725-2505150925--31685

  const parts = input.split('--');
  
  const firstPart = parts[0];
  const secondPart = parts[1];
  
  const firstNumbers = firstPart.split('-');
  const secondNumbers = secondPart.split('-');
  
  const newString = `${firstNumbers[0]}-${secondNumbers[2]}-${firstNumbers[1]}-${secondNumbers[3]}--${secondNumbers[0]}`;
  
  return newString;
}