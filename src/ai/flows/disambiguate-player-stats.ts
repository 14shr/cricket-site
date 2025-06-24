'use server';

/**
 * @fileOverview This file defines a flow to get cricket player stats from a local CSV file.
 *
 * It takes a player name as input and returns detailed player statistics.
 * @param {DisambiguatePlayerStatsInput} input - The input data containing the player name.
 * @returns {Promise<DisambiguatePlayerStatsOutput>} - A promise that resolves to the player statistics.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { getPlayerFromCSV } from '@/lib/csv-parser';

const DisambiguatePlayerStatsInputSchema = z.object({
  playerName: z.string().describe('The name of the player to search for.'),
});
export type DisambiguatePlayerStatsInput = z.infer<typeof DisambiguatePlayerStatsInputSchema>;

const BattingStatsSchema = z.object({
  matches: z.string(),
  runs: z.string(),
  highest_score: z.string(),
  average: z.string(),
  strike_rate: z.string(),
  hundreds: z.string(),
  fifties: z.string(),
});

const BowlingStatsSchema = z.object({
  matches: z.string(),
  balls: z.string(),
  runs: z.string(),
  wickets: z.string(),
  best_bowling_innings: z.string(),
  economy: z.string(),
  five_wickets: z.string(),
});

const PlayerStatsSchema = z.object({
  name: z.string(),
  country: z.string(),
  image: z.string().nullable(),
  role: z.string(),
  rankings: z.object({
    batting: z.object({
      test: z.string(),
      odi: z.string(),
      t20: z.string(),
    }),
    bowling: z.object({
      test: z.string(),
      odi: z.string(),
      t20: z.string(),
    }),
  }),
  batting_stats: z.record(z.string(), BattingStatsSchema),
  bowling_stats: z.record(z.string(), BowlingStatsSchema),
  summary: z.string(),
});

const DisambiguatePlayerStatsOutputSchema = z.object({
  playerStats: PlayerStatsSchema.optional(),
  summary: z.string().describe('A summary of where the data was sourced from or an error message.'),
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
    try {
      const playerData = await getPlayerFromCSV(input.playerName);
      
      if (!playerData) {
        return {
          summary: `Could not find player "${input.playerName}" in the data file.`,
        }
      }

      return {
        playerStats: playerData,
        summary: playerData.summary,
      };
    } catch(e: any) {
        console.error(e);
        return {
            summary: e.message || "An unexpected error occurred while fetching player stats from the CSV."
        }
    }
  }
);
