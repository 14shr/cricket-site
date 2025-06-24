import { NextResponse } from 'next/server';
import { getNews } from '@/ai/flows/get-cricket-news';

export async function GET() {
  try {
    const news = await getNews();
    return NextResponse.json(news);
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return NextResponse.json(
      { error: `Failed to retrieve news. ${errorMessage}` },
      { status: 500 }
    );
  }
}
