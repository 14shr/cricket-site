import { NextResponse } from 'next/server';
import { getLatestVideos } from '@/lib/youtube-scraper';

export async function GET() {
  try {
    const videos = await getLatestVideos();
    return NextResponse.json(videos);
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return NextResponse.json(
      { error: `Failed to retrieve latest videos. ${errorMessage}` },
      { status: 500 }
    );
  }
}
