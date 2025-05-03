import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { images, palette, albumMood } = await request.json();

    // Create a prompt for OpenAI
    const prompt = `Based on the inspiration images, that depict real places, and a vibe that the user is trying to achieve, color palette mood (${palette}), and music mood (${albumMood}), recommend a travel destination and activities.

    Please provide:
    1. A recommended travel destination that matches these vibes
    2. 3-5 specific activities or experiences that would be perfect for this destination
    3. A brief explanation of why this destination matches the provided mood and inspiration

    VERY IMPORTANT: Format the response as JSON with the following structure:
    {
      "destination": "string",
      "activities": ["string"],
      "explanation": "string"
    }`;

    // Convert base64 images to the correct format
    const imageInputs = images.map((base64Image: string) => ({
      type: "input_image",
      image_url: base64Image,
    }));

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: prompt }, ...imageInputs],
        },
      ],
    });

    if (!response.output_text) {
      throw new Error("No content received from OpenAI");
    }

    const parsedResponse = JSON.parse(
      response.output_text.replace(/```json\s*|\s*```/g, "")
    );
    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Error generating travel recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate travel recommendations" },
      { status: 500 }
    );
  }
}
