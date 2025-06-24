'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function getLiveMatches(): Promise<string[]> {
  try {
    const link = "https://www.cricbuzz.com/cricket-match/live-scores";
    const response = await axios.get(link);
    const html = response.data;
    const $ = cheerio.load(html);
    
    const page = $("div.cb-col.cb-col-100.cb-bg-white");
    const matches = page.find("div.cb-scr-wll-chvrn.cb-lv-scrs-col");
    
    const liveMatches: string[] = [];
    
    matches.each((i, element) => {
      const matchText = $(element).text().trim();
      if(matchText) {
        liveMatches.push(matchText);
      }
    });
    
    return liveMatches;
  } catch (error) {
    console.error("Error fetching live matches:", error);
    return [];
  }
}
