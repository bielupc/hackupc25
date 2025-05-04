import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { placeCode, startDate, endDate } = await request.json();

    const prompt = `Given the following travel destination and dates, suggest 5 unique activities or events that would be interesting for tourists:

    Destination: ${placeCode}
    Start Date: ${startDate}
    End Date: ${endDate}

    Please provide the response in the following JSON format:
    {
      "activities": [
        {
          "title": "string",
          "description": "string",
          "start": "YYYY-MM-DDTHH:mm:ss",
          "category": "string"
        }
      ]
    }

    Make sure the activities are realistic and match the dates provided. The category should be one of: sports, conferences, expos, concerts, festivals, performing-arts, community, academic`;

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: prompt }],
        },
      ],
    });

    if (!response.output_text) {
      throw new Error("No content received from OpenAI for activities");
    }

    const parsedResponse = JSON.parse(
      response.output_text.replace(/```json\s*|\s*```/g, "")
    );

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Error generating activities:", error);
    return NextResponse.json(
      { error: "Failed to generate activities" },
      { status: 500 }
    );
  }
}
