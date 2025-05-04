import dotenv from "dotenv";
import Client from "predicthq";

dotenv.config();

const client = new Client({
  access_token: process.env.NEXT_PUBLIC_PREDICTHQ_API_KEY!,
  fetch,
});

const phqEvents = client.events;

interface ActivityData {
  placeCode: string;
  startDate: string;
  endDate: string;
}

export interface Activity {
  title: string;
  description: string;
  start: string;
  category: string;
}

const logEventsToConsole = (events: any[]) => {
  for (const event of events) {
    console.log(event);
    console.log();
  }
};

async function getChatGPTActivities(data: ActivityData): Promise<Activity[]> {
  try {
    const response = await fetch("/api/travel/chatgpt-activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ChatGPT activities");
    }

    const result = await response.json();
    return result.activities;
  } catch (error) {
    console.error("Error fetching ChatGPT activities:", error);
    return [];
  }
}

export async function getActivities(data: ActivityData) {
  /*
    place: Place IDs and/or IATA (3 character), ICAO (4 character), and UN/LOCODE (5 character) airport codes .
    country: 2-letter country code e.g. 'ES' (Spain)
  */
  // example start.gte '2025-05-01T00:00:00'
  // example start.lte '2025-05-31T23:59:59'

  const { placeCode, startDate, endDate } = data;

  try {
    const withinParam = "10km@41.38969861814464,2.113241813506783"; // Barcelona

    const activities = await phqEvents.search({
      //within: withinParam,
      "place.exact": placeCode,
      "start.gte": startDate.split("+")[0],
      "start.lte": endDate.split("+")[0],
      category:
        "sports,conferences,expos,concerts,festivals,performing-arts,community,academic",
      sort: "start",
    });

    let results = activities.result.results;

    // If we have less than 6 results, complement with ChatGPT activities
    if (results.length < 6) {
      const chatGPTActivities = await getChatGPTActivities(data);
      results = [...results, ...chatGPTActivities];
    }

    // Ensure we return at most 10 activities
    return results.slice(0, 10);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return [];
  }
}
