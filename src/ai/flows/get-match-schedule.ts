'use server';

/**
 * @fileOverview A flow to get cricket match schedules for a specific date using an AI model.
 *
 * - getMatchSchedule - A function that fetches the match schedule.
 * - GetMatchScheduleInput - The input type for the getMatchSchedule function.
 * - GetMatchScheduleOutput - The return type for the getMatchSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// --- INPUT/OUTPUT SCHEMAS ---

const GetMatchScheduleInputSchema = z.object({
  date: z.string().describe('The date to fetch the schedule for, in YYYY-MM-DD format.'),
});
export type GetMatchScheduleInput = z.infer<typeof GetMatchScheduleInputSchema>;

const MatchSchema = z.object({
    team1: z.string().describe("The name of the first team."),
    team2: z.string().describe("The name of the second team."),
    venue: z.string().describe("The location or stadium where the match will be played."),
    time: z.string().describe("The start time of the match, including timezone."),
    competition: z.string().describe("The name of the tournament or series."),
});

const GetMatchScheduleOutputSchema = z.object({
  matches: z.array(MatchSchema).describe('A list of cricket matches scheduled for the given date.'),
  summary: z.string().describe('A summary indicating if matches were found or not.'),
});

export type GetMatchScheduleOutput = z.infer<typeof GetMatchScheduleOutputSchema>;

// --- EXPORTED ACTION FUNCTION ---

export async function getMatchSchedule(input: GetMatchScheduleInput): Promise<GetMatchScheduleOutput> {
  return getMatchScheduleFlow(input);
}

// --- GENKIT PROMPT ---

const getSchedulePrompt = ai.definePrompt({
  name: 'getMatchSchedulePrompt',
  input: { schema: GetMatchScheduleInputSchema },
  output: { schema: GetMatchScheduleOutputSchema },
  prompt: `You are a cricket expert who provides match schedules.
  
  Your task is to provide a list of all professional cricket matches scheduled for the date: {{{date}}}.
  
  The response MUST be in the specified JSON format.
  
  If there are no matches on that day, return an empty array for "matches" and a summary message saying "No matches are scheduled for this date."
  
  For each match, include the two teams playing, the venue, the start time with the local timezone, and the name of the competition or series.`,
});

// --- GENKIT FLOW ---

const getMatchScheduleFlow = ai.defineFlow(
  {
    name: 'getMatchScheduleFlow',
    inputSchema: GetMatchScheduleInputSchema,
    outputSchema: GetMatchScheduleOutputSchema,
  },
  async ({ date }) => {
    try {
      const { output } = await getSchedulePrompt({ date });
      if (!output) {
          return { matches: [], summary: "Could not retrieve match schedule from the AI model." };
      }
      return output;
    } catch(e: any) {
        console.error("Error in getMatchScheduleFlow:", e);
        return {
            matches: [],
            summary: e.message || "An unexpected error occurred while fetching the match schedule."
        }
    }
  }
);
