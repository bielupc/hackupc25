import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { images, palette, albumMood } = await request.json();

    // First prompt to analyze images
    const imageAnalysisPrompt = `Analyze these images and extract the following information:
    1. Places or locations visible in the images
    2. Overall vibe or atmosphere
    3. Notable objects or elements
    4. Clothing styles or fashion elements

    Format the response as JSON with the following structure:
    {
      "places": ["string"],
      "vibe": "string",
      "objects": ["string"],
      "clothing": ["string"]
    }`;

    // Convert base64 images to the correct format
    const imageInputs = images.map((base64Image: string) => ({
      type: "input_image",
      image_url: base64Image,
    }));

    // First API call to analyze images
    const imageAnalysisResponse = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: imageAnalysisPrompt },
            ...imageInputs,
          ],
        },
      ],
    });

    if (!imageAnalysisResponse.output_text) {
      throw new Error("No content received from OpenAI for image analysis");
    }

    const imageAnalysis = JSON.parse(
      imageAnalysisResponse.output_text.replace(/```json\s*|\s*```/g, "")
    );

    // Second prompt using the image analysis results
    const finalPrompt = `Based on the following analysis of inspiration images and additional preferences, recommend a travel destination and activities.

    Image Analysis:
    - Places identified: ${imageAnalysis.places.join(", ")}
    - Overall vibe: ${imageAnalysis.vibe}
    - Notable objects: ${imageAnalysis.objects.join(", ")}
    - Clothing styles: ${imageAnalysis.clothing.join(", ")}
    
    Additional Preferences:
    - Color palette mood: ${palette}
    - Music mood: ${albumMood}

    Please provide:
    1. A recommended travel destination that matches these vibes
    2. 3-5 specific activities or experiences that would be perfect for this destination
    3. A brief explanation of why this destination matches the provided mood and inspiration

    Format the response as JSON with the following structure:
    {
      "destination": "string",
      "activities": ["string"],
      "explanation": "string"
    }`;

    console.log(finalPrompt);
    // Second API call for final recommendations
    const finalResponse = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: finalPrompt }],
        },
      ],
    });

    if (!finalResponse.output_text) {
      throw new Error(
        "No content received from OpenAI for final recommendations"
      );
    }

    const parsedResponse = JSON.parse(
      finalResponse.output_text.replace(/```json\s*|\s*```/g, "")
    );
    console.log(parsedResponse);
    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Error generating travel recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate travel recommendations" },
      { status: 500 }
    );
  }
}
