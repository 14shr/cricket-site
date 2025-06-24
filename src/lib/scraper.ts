'use server';

import * as cheerio from 'cheerio';
const search = require('google-sr');

const safeParseNumber = (str: string | undefined): number => {
    if (!str || str.trim() === '-') return 0;
    const num = parseFloat(str.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
};

export interface ScrapedFormatStats {
    batting: {
        matches: number;
        runs: number;
        average: number;
    };
    bowling: {
        wickets: number;
    };
}

export interface ScrapedData {
    name: string;
    country: string;
    role: string;
    statsByFormat: Record<string, ScrapedFormatStats>;
    summary: string;
}

export async function scrapePlayerStats(playerName: string): Promise<ScrapedData> {
    const query = `${playerName} cricbuzz`;
    let profileLink: string | null = null;
    
    try {
        const results = await search({ query });
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
        response = await fetch(profileLink);
        if (!response.ok) {
            throw new Error(`Failed to fetch profile page: ${response.statusText}`);
        }
    } catch (e: any) {
        console.error("Fetch failed", e);
        throw new Error(`Could not fetch the Cricbuzz profile page at ${profileLink}: ${e.message}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);

    const name = $('#playerProfile h1.cb-font-40').text().trim();
    if (!name) {
         throw new Error(`Could not parse player data from Cricbuzz. The page structure may have changed.`);
    }
    
    const country = $('#playerProfile h3.cb-font-18.text-gray').text().trim();
    const role = $('div.cb-plyr-prfl-lbl:contains("Role")').next().text().trim();

    const statsByFormat: Record<string, ScrapedFormatStats> = {};

    const tables = $('div.cb-plyr-tbl');
    const battingTable = tables.eq(0);
    const bowlingTable = tables.eq(1);

    battingTable.find('tbody tr').each((i, row) => {
        const cols = $(row).find('td');
        const format = cols.eq(0).text().trim();
        if (format) {
            const formatKey = format.toLowerCase();
            if (!statsByFormat[formatKey]) {
                statsByFormat[formatKey] = { batting: { matches: 0, runs: 0, average: 0 }, bowling: { wickets: 0 } };
            }
            statsByFormat[formatKey].batting = {
                matches: safeParseNumber(cols.eq(1).text()),
                runs: safeParseNumber(cols.eq(3).text()),
                average: safeParseNumber(cols.eq(6).text()),
            };
        }
    });

    bowlingTable.find('tbody tr').each((i, row) => {
        const cols = $(row).find('td');
        const format = cols.eq(0).text().trim();
        if (format) {
            const formatKey = format.toLowerCase();
            if (!statsByFormat[formatKey]) {
                statsByFormat[formatKey] = { batting: { matches: 0, runs: 0, average: 0 }, bowling: { wickets: 0 } };
            }
            statsByFormat[formatKey].bowling = {
                wickets: safeParseNumber(cols.eq(5).text()),
            };
        }
    });

    return {
        name,
        country,
        role,
        statsByFormat,
        summary: `Found profile for ${name} (${country}) on Cricbuzz.`
    };
}
