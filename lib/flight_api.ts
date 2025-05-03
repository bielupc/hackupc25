// pages/api/flights.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.NEXT_PUBLIC_FLIGHTS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not found' });
  }

  const searchUrl = 'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create';

  const searchPayload = {
    query: {
      market: 'UK',
      locale: 'en-GB',
      currency: 'GBP',
      query_legs: [
        {
          origin_place_id: { iata: 'BCN' },
          destination_place_id: { iata: 'SZX' },
          date: { year: 2025, month: 10, day: 30 },
        },
      ],
      adults: 1,
      cabin_class: 'CABIN_CLASS_ECONOMY',
    },
  };

  try {
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
      return res.status(500).json({ error: 'Failed to create session', detail: createData });
    }

    const sessionToken = createData.sessionToken;
    const pollUrl = `https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll/${sessionToken}`;

    const pollRes = await fetch(pollUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const pollData = await pollRes.json();

    if (!pollRes.ok) {
      return res.status(500).json({ error: 'Failed to poll results', detail: pollData });
    }

    res.status(200).json(pollData);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error', message: error.message });
  }
}
