'use server';

import * as cheerio from 'cheerio';
import search from 'google-sr';

const safeParseNumber = (str: string | undefined): number => {
    if (!str || str.trim() === '-') return 0;
    const num = parseFloat(str.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
};

export interface ScrapedData {
    name: string;
    stats: {
        appearances: number;
        goals: number;
        assists: number;
    };
    summary: string;
}

export async function scrapePlayerStats(playerName: string): Promise<ScrapedData> {
    const query = `${playerName} fbref`;
    let profileLink: string | null = null;
    
    try {
        const results = await search({ query });
        const fbrefResult = results.find((r: any) => r.link && r.link.includes("fbref.com/en/players/"));
        if (fbrefResult) {
            profileLink = fbrefResult.link;
        }
    } catch (e: any) {
        console.error("Search failed", e);
        throw new Error(`Search for player "${playerName}" failed: ${e.message}`);
    }

    if (!profileLink) {
        throw new Error(`Could not find an FBref profile for "${playerName}".`);
    }

    let response;
    try {
        response = await fetch(profileLink);
        if (!response.ok) {
            throw new Error(`Failed to fetch profile page: ${response.statusText}`);
        }
    } catch (e: any) {
        console.error("Fetch failed", e);
        throw new Error(`Could not fetch the FBref profile page at ${profileLink}: ${e.message}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);

    const name = $('h1[itemprop="name"]').text().trim();
    if (!name) {
         throw new Error(`Could not parse player data from FBref. The page structure may have changed.`);
    }

    let appearances = 0;
    let goals = 0;
    let assists = 0;

    const careerRow = $('tfoot tr:contains("Career")');
    if (careerRow.length > 0) {
        appearances = safeParseNumber(careerRow.find('td[data-stat="games"]').text());
        goals = safeParseNumber(careerRow.find('td[data-stat="goals"]').text());
        assists = safeParseNumber(careerRow.find('td[data-stat="assists"]').text());
    } else {
        $('table.stats_table tbody tr').each((i, row) => {
            if(!$(row).attr('id')) return;
            appearances += safeParseNumber($(row).find('td[data-stat="games"]').text());
            goals += safeParseNumber($(row).find('td[data-stat="goals"]').text());
            assists += safeParseNumber($(row).find('td[data-stat="assists"]').text());
        })
    }


    return {
        name,
        stats: {
            appearances,
            goals,
            assists,
        },
        summary: `Found career stats for ${name} on FBref.com.`
    };
}
