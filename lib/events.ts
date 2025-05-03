// lib/predictHQ.ts
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

export async function getEvents(location?: string, start_date?: string, end_date?: string) {
  try {
    const withinParam = '10km@41.38969861814464,2.113241813506783'; // Barcelona
    // Ejemplo usando `within`
    const events = await phqEvents.search({
      within: withinParam,
      'start.gte': '2025-05-01T00:00:00',
      'start.lte': '2025-05-31T23:59:59',
      'category': 'sports,conferences,expos,concerts,festivals,performing-arts,community,academic',
      sort: 'start'
    });

    logEventsToConsole(events);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
  }
}
