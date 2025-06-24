'use server';

/**
 * @fileOverview This file defines a flow to get cricket player stats.
 * It first looks up a player in a local CSV file for basic info,
 * then uses an AI model to fetch detailed statistics.
 *
 * @param {DisambiguatePlayerStatsInput} input - The input data containing the player name.
 * @returns {Promise<DisambiguatePlayerStatsOutput>} - A promise that resolves to the player statistics.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { getPlayerFromCSV } from '@/lib/csv-parser';

// --- INPUT/OUTPUT SCHEMAS ---

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
  batting_stats: z.object({
    test: BattingStatsSchema.describe("Batting statistics for Test matches."),
    odi: BattingStatsSchema.describe("Batting statistics for One Day International matches."),
    t20i: BattingStatsSchema.describe("Batting statistics for T20 International matches."),
  }),
  bowling_stats: z.object({
    test: BowlingStatsSchema.describe("Bowling statistics for Test matches."),
    odi: BowlingStatsSchema.describe("Bowling statistics for One Day International matches."),
    t20i: BowlingStatsSchema.describe("Bowling statistics for T20 International matches."),
  }),
  summary: z.string().describe("A concise summary of the player's career, their role, and key achievements."),
});

const DisambiguatePlayerStatsOutputSchema = z.object({
  playerStats: PlayerStatsSchema.optional(),
  summary: z.string().describe('A summary of where the data was sourced from or an error message.'),
});

export type DisambiguatePlayerStatsOutput = z.infer<typeof DisambiguatePlayerStatsOutputSchema>;

// --- EXPORTED ACTION FUNCTION ---

export async function disambiguatePlayerStats(input: DisambiguatePlayerStatsInput): Promise<DisambiguatePlayerStatsOutput> {
  return disambiguatePlayerStatsFlow(input);
}

// --- GENKIT PROMPT ---

const getPlayerStatsPrompt = ai.definePrompt({
  name: 'getPlayerStatsPrompt',
  input: { schema: z.object({ playerName: z.string() }) },
  output: { schema: PlayerStatsSchema },
  prompt: `You are a cricket statistics expert. Your task is to provide detailed statistics for the player named {{{playerName}}}.

  Your response MUST be in the specified JSON format.
  
  Please provide comprehensive statistics for Test, ODI, and T20I formats. The keys for these formats in the JSON output must be "test", "odi", and "t20i" respectively. If a specific statistic is not available for a format, represent it with a hyphen "-".
  
  The output should include:
  - Player's country.
  - Current ICC rankings for batting and bowling across all formats.
  - Detailed batting stats (Matches, Runs, Highest Score, Average, Strike Rate, 100s, 50s) for Test, ODI, and T20I.
  - Detailed bowling stats (Matches, Balls, Runs, Wickets, BBI, Economy, 5 Wickets) for Test, ODI, and T20I.
  - A concise professional summary of the player's career, their role in the team, and their most significant achievements.
  
  Do not include the player's name, image, or role in your direct output, as those are handled separately.`,
});

// --- GENKIT FLOW ---

const disambiguatePlayerStatsFlow = ai.defineFlow(
  {
    name: 'disambiguatePlayerStatsFlow',
    inputSchema: DisambiguatePlayerStatsInputSchema,
    outputSchema: DisambiguatePlayerStatsOutputSchema,
  },
  async (input) => {
    try {
      // Step 1: Find the player in the local CSV file.
      const csvPlayerData = await getPlayerFromCSV(input.playerName);
      
      if (!csvPlayerData) {
        return {
          summary: `Could not find player "${input.playerName}" in the data file. Please check the spelling or try a different name.`,
        };
      }

      // Step 2: Use the player's name from the CSV to get detailed stats from the AI.
      const { output: generatedStats } = await getPlayerStatsPrompt({ playerName: csvPlayerData.name });
      
      if (!generatedStats) {
          return {
              summary: `While player "${csvPlayerData.name}" was found, we couldn't retrieve detailed stats at the moment.`,
          }
      }

      // Step 3: Combine the reliable data from the CSV (name, image, role) with the generated stats.
      const finalPlayerStats: z.infer<typeof PlayerStatsSchema> = {
          ...generatedStats,
          name: csvPlayerData.name,
          image: csvPlayerData.image,
          role: csvPlayerData.role,
          // The summary from the AI is usually more descriptive.
          summary: generatedStats.summary, 
      };

      return {
        playerStats: finalPlayerStats,
        summary: `Displaying comprehensive stats for ${finalPlayerStats.name}.`,
      };

    } catch(e: any) {
        console.error("Error in disambiguatePlayerStatsFlow:", e);
        return {
            summary: e.message || "An unexpected error occurred while fetching player stats."
        }
    }
  }
);
