import dotenv from 'dotenv';
import Client from 'predicthq';

dotenv.config();

const client = new Client({
  access_token: process.env.NEXT_PUBLIC_PREDICTHQ_API_KEY,
  fetch
});

const phqEvents = client.events;

const logEventsToConsole = (events: any[]) => {
  for (const event of events) {
    console.log(event);
    console.log();
  }
};

export async function getActivities(data: object) {
  /*
    place: Place IDs and/or IATA (3 character), ICAO (4 character), and UN/LOCODE (5 character) airport codes .
    country: 2-letter country code e.g. 'ES' (Spain)
  */
  // example start.gte '2025-05-01T00:00:00'
  // example start.lte '2025-05-31T23:59:59'

  const { placeCode, startDate, endDate } = data;;

  try {
    const withinParam = '10km@41.38969861814464,2.113241813506783'; // Barcelona

    const activities = await phqEvents.search({
      //within: withinParam,
      'place.exact': placeCode,
      'start.gte': startDate,
      'start.lte': endDate,
      'category': 'sports,conferences,expos,concerts,festivals,performing-arts,community,academic',
      sort: 'start'
    });

    //console.log('Activities:', activities);
    //logEventsToConsole(activities);

    return activities.result.results;
  } catch (error) {
    console.error('Error al obtener eventos:', error);
  }
}
