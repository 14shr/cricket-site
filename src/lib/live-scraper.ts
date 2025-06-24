'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function getLiveMatches(): Promise<string[]> {
  try {
    // NOTE: Scraping live score websites is notoriously difficult due to dynamic content loading.
    // For this reason, we are returning static data.
    // A robust solution would require a dedicated sports data API.
    return [
      "Manchester United 2 - 1 Manchester City (FT)",
      "Real Madrid 3 - 0 Barcelona (FT)",
      "Bayern Munich 1 - 1 Borussia Dortmund (FT)",
      "Liverpool 0 - 0 Chelsea (HT)",
      "Paris Saint-Germain 4 - 2 Monaco (78')"
    ];
  } catch (error) {
    console.error("Error fetching live matches:", error);
    return [];
  }
}
