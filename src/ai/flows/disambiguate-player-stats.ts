'use server';

/**
 * @fileOverview This file defines a flow to get player stats by scraping cricbuzz.
 *
 * It takes a player name as input and returns the player statistics.
 * @param {DisambiguatePlayerStatsInput} input - The input data containing the player name.
 * @returns {Promise<DisambiguatePlayerStatsOutput>} - A promise that resolves to the player statistics.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { scrapePlayerStats } from '@/lib/scraper';

const DisambiguatePlayerStatsInputSchema = z.object({
  playerName: z.string().describe('The name of the player to search for.'),
});
export type DisambiguatePlayerStatsInput = z.infer<typeof DisambiguatePlayerStatsInputSchema>;

const PlayerStatsSchema = z.object({
  name: z.string().describe('The full name of the player and format.'),
  matches: z.number().describe('Number of matches played.'),
  runs: z.number().describe('Total runs scored.'),
  wickets: z.number().describe('Total wickets taken.'),
  average: z.number().describe('Batting average.'),
});

const DisambiguatePlayerStatsOutputSchema = z.object({
  playerStats: PlayerStatsSchema.array().describe('Statistics for the player, broken down by format.'),
  disambiguation_summary: z.string().describe('A summary of where the data was sourced from.'),
});

export type DisambiguatePlayerStatsOutput = z.infer<typeof DisambiguatePlayerStatsOutputSchema>;

export async function disambiguatePlayerStats(input: DisambiguatePlayerStatsInput): Promise<DisambiguatePlayerStatsOutput> {
  return disambiguatePlayerStatsFlow(input);
}

const disambiguatePlayerStatsFlow = ai.defineFlow(
  {
    name: 'disambiguatePlayerStatsFlow',
    inputSchema: DisambiguatePlayerStatsInputSchema,
    outputSchema: DisambiguatePlayerStatsOutputSchema,
  },
  async (input) => {
    const scrapedData = await scrapePlayerStats(input.playerName);
    
    const playerStats = Object.entries(scrapedData.statsByFormat)
        .map(([format, stats]) => {
            if (stats.batting.matches > 0 || stats.bowling.wickets > 0) {
                return {
                    name: `${scrapedData.name} (${format.toUpperCase()})`,
                    matches: stats.batting.matches,
                    runs: stats.batting.runs,
                    wickets: stats.bowling.wickets,
                    average: stats.batting.average,
                };
            }
            return null;
        })
        .filter((p): p is NonNullable<typeof p> => p !== null);

    if (playerStats.length === 0 && scrapedData.name) {
        return {
            playerStats: [{
                name: scrapedData.name,
                matches: 0,
                runs: 0,
                wickets: 0,
                average: 0
            }],
            disambiguation_summary: `${scrapedData.summary} However, no detailed statistics were found for major formats.`
        }
    }

    return {
      playerStats: playerStats,
      disambiguation_summary: scrapedData.summary,
    };
  }
);
