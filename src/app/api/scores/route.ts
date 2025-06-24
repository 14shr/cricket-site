import { NextResponse } from 'next/server';
import { getLiveMatches } from '@/lib/live-scraper';

export async function GET() {
  try {
    const matches = await getLiveMatches();
    return NextResponse.json(matches);
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return NextResponse.json(
      { error: `Failed to retrieve live matches. ${errorMessage}` },
      { status: 500 }
    );
  }
}
