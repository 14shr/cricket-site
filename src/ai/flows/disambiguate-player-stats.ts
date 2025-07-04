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
    test: BattingStatsSchema,
    odi: BattingStatsSchema,
    t20i: BattingStatsSchema,
  }),
  bowling_stats: z.object({
    test: BowlingStatsSchema,
    odi: BowlingStatsSchema,
    t20i: BowlingStatsSchema,
  }),
  summary: z.string().describe("A concise summary of the player's career, their role, and key achievements."),
});

const DisambiguatePlayerStatsOutputSchema = z.object({
  playerStats: PlayerStatsSchema.optional(),
  summary: z.string().describe('A summary of where the data was sourced from or an error message.'),
});

export type DisambiguatePlayerStatsOutput = z.infer<typeof DisambiguatePlayerStatsOutputSchema>;

// --- TEMPORARY STATS FALLBACK ---

function getTemporaryStats(playerInfo: { name: string; image: string | null; role: string }): z.infer<typeof PlayerStatsSchema> {
    const na = 'N/A';
    return {
        name: playerInfo.name,
        country: na,
        image: playerInfo.image,
        role: playerInfo.role,
        rankings: {
            batting: { test: na, odi: na, t20: na },
            bowling: { test: na, odi: na, t20: na },
        },
        batting_stats: {
            test: { matches: na, runs: na, highest_score: na, average: na, strike_rate: na, hundreds: na, fifties: na },
            odi: { matches: na, runs: na, highest_score: na, average: na, strike_rate: na, hundreds: na, fifties: na },
            t20i: { matches: na, runs: na, highest_score: na, average: na, strike_rate: na, hundreds: na, fifties: na },
        },
        bowling_stats: {
            test: { matches: na, balls: na, runs: na, wickets: na, best_bowling_innings: na, economy: na, five_wickets: na },
            odi: { matches: na, balls: na, runs: na, wickets: na, best_bowling_innings: na, economy: na, five_wickets: na },
            t20i: { matches: na, balls: na, runs: na, wickets: na, best_bowling_innings: na, economy: na, five_wickets: na },
        },
        summary: 'Could not fetch live AI-powered stats at the moment. Displaying available basic information.',
    };
}

// --- EXPORTED ACTION FUNCTION ---

export async function disambiguatePlayerStats(input: DisambiguatePlayerStatsInput): Promise<DisambiguatePlayerStatsOutput> {
  // Gracefully handle missing API key in production
  if (!process.env.GOOGLE_API_KEY && !process.env.GEMINI_API_KEY) {
    console.warn("Google AI API key is not set. Falling back to CSV data only.");
    try {
      const csvPlayerData = await getPlayerFromCSV(input.playerName);
      if (!csvPlayerData) {
        return {
          summary: `Could not find player "${input.playerName}" in the data file. Please check the spelling or try a different name.`,
        };
      }
      const temporaryStats = getTemporaryStats(csvPlayerData);
      return {
          playerStats: temporaryStats,
          summary: temporaryStats.summary,
      }
    } catch (e: any) {
        console.error("Error during fallback CSV lookup:", e);
        return {
            summary: e.message || "An unexpected error occurred while fetching player stats from fallback."
        }
    }
  }
  // If key exists, proceed with the AI flow
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
      let generatedStats;
      try {
        const result = await getPlayerStatsPrompt({ playerName: csvPlayerData.name });
        generatedStats = result.output;
      } catch (e) {
          console.error("Error fetching stats from AI:", e);
          generatedStats = null;
      }
      
      if (!generatedStats) {
        // AI failed or returned no stats, use temporary data as a fallback.
        const temporaryStats = getTemporaryStats(csvPlayerData);
        return {
            playerStats: temporaryStats,
            summary: temporaryStats.summary,
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
