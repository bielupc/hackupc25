import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch playlist");
    }

    const data = await response.json();

    // Extract relevant information
    const playlist = {
      name: data.name,
      description: data.description,
      image: data.images[0]?.url,
      tracks: data.tracks.items.map((item: any) => ({
        name: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        image: item.track.album.images[0]?.url,
      })),
    };

    return NextResponse.json(playlist);
  } catch (error) {
    console.error("Error fetching Spotify playlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlist" },
      { status: 500 }
    );
  }
}
