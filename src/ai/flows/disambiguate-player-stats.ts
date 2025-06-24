'use server';

/**
 * @fileOverview This file defines a flow to get football player stats by scraping fbref.com.
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
  name: z.string().describe('The full name of the player.'),
  appearances: z.number().describe('Total career appearances.'),
  goals: z.number().describe('Total career goals.'),
  assists: z.number().describe('Total career assists.'),
});

const DisambiguatePlayerStatsOutputSchema = z.object({
  playerStats: PlayerStatsSchema.optional(),
  summary: z.string().describe('A summary of where the data was sourced from.'),
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
    
    const playerStats = {
        name: scrapedData.name,
        appearances: scrapedData.stats.appearances,
        goals: scrapedData.stats.goals,
        assists: scrapedData.stats.assists,
    };
    
    if (!playerStats.name) {
      return {
        summary: "Could not find player.",
      }
    }

    return {
      playerStats: playerStats,
      summary: scrapedData.summary,
    };
  }
);
