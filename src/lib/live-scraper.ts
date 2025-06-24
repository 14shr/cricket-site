'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function getLiveMatches(): Promise<string[]> {
  try {
    const link = "https://www.cricbuzz.com/cricket-match/live-scores";
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    
    const matches: string[] = [];
    $('div.cb-lv-scrs-col').each((i, element) => {
      const matchText = $(element).text().trim();
      if(matchText) {
        matches.push(matchText.replace(/\s+/g, ' '));
      }
    });
    
    if (matches.length === 0) {
      return ["No live matches found at the moment."];
    }
    
    return matches.slice(0, 10);
  } catch (error) {
    console.error("Error fetching live matches:", error);
    return ["Could not retrieve live match data."];
  }
}
