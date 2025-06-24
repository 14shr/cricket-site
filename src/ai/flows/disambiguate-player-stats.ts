// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview This file defines a Genkit flow to disambiguate player stats.
 *
 * It takes a player name as input and returns the player statistics after disambiguation.
 * @param {DisambiguatePlayerStatsInput} input - The input data containing the player name.
 * @returns {Promise<DisambiguatePlayerStatsOutput>} - A promise that resolves to the disambiguated player statistics.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisambiguatePlayerStatsInputSchema = z.object({
  playerName: z.string().describe('The name of the player to search for.'),
});
export type DisambiguatePlayerStatsInput = z.infer<typeof DisambiguatePlayerStatsInputSchema>;

const PlayerStatsSchema = z.object({
  name: z.string().describe('The full name of the player.'),
  matches: z.number().describe('Number of matches played.'),
  runs: z.number().describe('Total runs scored.'),
  wickets: z.number().describe('Total wickets taken.'),
  average: z.number().describe('Batting average.'),
});

const DisambiguatePlayerStatsOutputSchema = z.object({
  playerStats: PlayerStatsSchema.array().describe('Statistics for the most relevant player(s).'),
  disambiguation_summary: z.string().describe('A summary of how the player stats were disambiguated')
});

export type DisambiguatePlayerStatsOutput = z.infer<typeof DisambiguatePlayerStatsOutputSchema>;

export async function disambiguatePlayerStats(input: DisambiguatePlayerStatsInput): Promise<DisambiguatePlayerStatsOutput> {
  return disambiguatePlayerStatsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'disambiguatePlayerStatsPrompt',
  input: {schema: DisambiguatePlayerStatsInputSchema},
  output: {schema: DisambiguatePlayerStatsOutputSchema},
  prompt: `You are an AI assistant specializing in cricket statistics. A user has searched for player statistics using the name '{{playerName}}'. Multiple players may match this name, or the name may be ambiguous. 

Your task is to disambiguate the search and return the statistics for the most relevant player(s). If there are multiple players with similar names, analyze the context and user's likely intent to determine the correct player. If you cannot disambiguate, return the statistics for all possible matches.

Return the results in JSON format in the playerStats field. Also return a summary of how you disambiguated the player stats.
`,
});

const disambiguatePlayerStatsFlow = ai.defineFlow(
  {
    name: 'disambiguatePlayerStatsFlow',
    inputSchema: DisambiguatePlayerStatsInputSchema,
    outputSchema: DisambiguatePlayerStatsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
