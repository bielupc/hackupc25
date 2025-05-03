import { NextResponse } from "next/server";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const type = searchParams.get("type") || "image"; // 'image' or 'video'
    const perPage = searchParams.get("per_page") || "10";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const endpoint =
      type === "video"
        ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(
            query
          )}&per_page=${perPage}`
        : `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            query
          )}&per_page=${perPage}`;

    const response = await fetch(endpoint, {
      headers: {
        Authorization: PEXELS_API_KEY || "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from Pexels API");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from Pexels:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Pexels" },
      { status: 500 }
    );
  }
}
