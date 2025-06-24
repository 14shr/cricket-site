'use server';

import * as cheerio from 'cheerio';
import search from 'google-sr';
import axios from 'axios';

export interface PlayerStats {
  name: string;
  country: string;
  image: string | null;
  role: string;
  rankings: {
    batting: {
      test: string;
      odi: string;
      t20: string;
    };
    bowling: {
      test: string;
      odi: string;
      t20: string;
    };
  };
  batting_stats: Record<string, {
    matches: string;
    runs: string;
    highest_score: string;
    average: string;
    strike_rate: string;
    hundreds: string;
    fifties: string;
  }>;
  bowling_stats: Record<string, {
    matches: string;
    balls: string;
    runs: string;
    wickets: string;
    best_bowling_innings: string;
    economy: string;
    five_wickets: string;
  }>;
  summary: string;
}


export async function scrapePlayerStats(playerName: string): Promise<PlayerStats> {
    const query = `${playerName} site:cricbuzz.com/profiles`;
    let profileLink: string | null = null;
    
    try {
        const results = await search({ query: query });
        const cricbuzzResult = results.find((r: any) => r.link && r.link.includes("cricbuzz.com/profiles/"));
        if (cricbuzzResult) {
            profileLink = cricbuzzResult.link;
        }
    } catch (e: any) {
        console.error("Search failed", e);
        throw new Error(`Search for player "${playerName}" failed: ${e.message}`);
    }

    if (!profileLink) {
        throw new Error(`Could not find a Cricbuzz profile for "${playerName}".`);
    }

    let response;
    try {
        response = await axios.get(profileLink);
        if (response.status !== 200) {
            throw new Error(`Failed to fetch profile page: ${response.statusText}`);
        }
    } catch (e: any) {
        console.error("Fetch failed", e);
        throw new Error(`Could not fetch the Cricbuzz profile page at ${profileLink}: ${e.message}`);
    }
    
    const html = await response.data;
    const $ = cheerio.load(html);

    const pc = $('div.cb-col.cb-col-100.cb-bg-white');

    const name = pc.find('h1.cb-font-40').text().trim();
    if (!name) {
         throw new Error(`Could not parse player data from Cricbuzz. The page structure may have changed.`);
    }
    const country = pc.find('h3.cb-font-18.text-gray').text().trim();
    const imageUrl = pc.find('img').first().attr('src') ? `https://www.cricbuzz.com${pc.find('img').first().attr('src')}` : null;

    const personal = $('div.cb-col.cb-col-60.cb-lst-itm-sm');
    const role = personal.find((i, el) => $(el).text().includes('Role')).next().text().trim();
    
    const icc = $('div.cb-col.cb-col-25.cb-plyr-rank.text-right');
    const tb = icc.eq(0).text().trim() || 'N/A';
    const ob = icc.eq(1).text().trim() || 'N/A';
    const twb = icc.eq(2).text().trim() || 'N/A';
    const tbw = icc.eq(3).text().trim() || 'N/A';
    const obw = icc.eq(4).text().trim() || 'N/A';
    const twbw = icc.eq(5).text().trim() || 'N/A';

    const summary = $('div.cb-plyr-tbl');
    const batting = summary.eq(0);
    const bowling = summary.eq(1);

    const battingStats: PlayerStats['batting_stats'] = {};
    batting.find('tbody tr').each((_, row) => {
        const cols = $(row).find('td');
        const formatName = cols.eq(0).text().trim().toLowerCase();
        if (formatName) {
            battingStats[formatName] = {
                matches: cols.eq(1).text().trim(),
                runs: cols.eq(3).text().trim(),
                highest_score: cols.eq(5).text().trim(),
                average: cols.eq(6).text().trim(),
                strike_rate: cols.eq(7).text().trim(),
                hundreds: cols.eq(12).text().trim(),
                fifties: cols.eq(11).text().trim(),
            };
        }
    });

    const bowlingStats: PlayerStats['bowling_stats'] = {};
    bowling.find('tbody tr').each((_, row) => {
        const cols = $(row).find('td');
        const formatName = cols.eq(0).text().trim().toLowerCase();
        if (formatName) {
             bowlingStats[formatName] = {
                matches: cols.eq(1).text().trim(),
                balls: cols.eq(3).text().trim(),
                runs: cols.eq(4).text().trim(),
                wickets: cols.eq(5).text().trim(),
                best_bowling_innings: cols.eq(9).text().trim(),
                economy: cols.eq(7).text().trim(),
                five_wickets: cols.eq(11).text().trim(),
            };
        }
    });

    return {
      name,
      country,
      image: imageUrl,
      role,
      rankings: {
        batting: { test: tb, odi: ob, t20: twb },
        bowling: { test: tbw, odi: obw, t20: twbw }
      },
      batting_stats: battingStats,
      bowling_stats: bowlingStats,
      summary: `Found career stats for ${name} on Cricbuzz.com.`
    };
}
