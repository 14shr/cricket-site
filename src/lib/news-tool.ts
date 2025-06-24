'use server';

/**
 * @fileOverview A function and Genkit tool for fetching recent cricket matches from the Cricbuzz API.
 *
 * - getRecentMatches: An exported function to fetch recent match data directly.
 * - fetchRecentMatches: A Genkit tool wrapper around getRecentMatches for AI use.
 */

import { ai } from '@/ai/genkit';
import axios from 'axios';
import { z } from 'zod';

const RecentMatchSchema = z.object({
  seriesName: z.string().describe("The name of the series or tournament."),
  matchDescription: z.string().describe("The description of the match (e.g., '1st T20I')."),
  matchFormat: z.string().describe("The format of the match (e.g., 'T20', 'ODI', 'Test')."),
  status: z.string().describe("The result or current status of the match."),
  team1Name: z.string().describe("The name of the first team."),
  team2Name: z.string().describe("The name of the second team."),
  venue: z.string().describe("The venue where the match was played."),
});
type RecentMatch = z.infer<typeof RecentMatchSchema>;

const FetchRecentMatchesOutputSchema = z.array(RecentMatchSchema);

export async function getRecentMatches(): Promise<RecentMatch[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    console.error('RAPIDAPI_KEY is not set in the environment.');
    throw new Error('RapidAPI key is not configured.');
  }

  const options = {
    method: 'GET',
    url: 'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const rawData = response.data;
    
    const processedMatches: RecentMatch[] = [];
    
    if (rawData.typeMatches) {
        rawData.typeMatches.forEach((typeMatch: any) => {
            if (typeMatch.seriesMatches) {
                typeMatch.seriesMatches.forEach((seriesMatch: any) => {
                    if (seriesMatch.seriesAdWrapper && seriesMatch.seriesAdWrapper.matches) {
                        seriesMatch.seriesAdWrapper.matches.forEach((match: any) => {
                            const matchInfo = match.matchInfo;
                            processedMatches.push({
                                seriesName: matchInfo.seriesName,
                                matchDescription: matchInfo.matchDesc,
                                matchFormat: matchInfo.matchFormat,
                                status: matchInfo.status,
                                team1Name: matchInfo.team1.teamName,
                                team2Name: matchInfo.team2.teamName,
                                venue: `${matchInfo.venueInfo.ground}, ${matchInfo.venueInfo.city}`
                            });
                        });
                    } else if (seriesMatch.matches) {
                        seriesMatch.matches.forEach((match: any) => {
                              const matchInfo = match.matchInfo;
                              processedMatches.push({
                                seriesName: matchInfo.seriesName,
                                matchDescription: matchInfo.matchDesc,
                                matchFormat: matchInfo.matchFormat,
                                status: matchInfo.status,
                                team1Name: matchInfo.team1.teamName,
                                team2Name: matchInfo.team2.teamName,
                                venue: `${matchInfo.venueInfo.ground}, ${matchInfo.venueInfo.city}`
                              });
                        });
                    }
                });
            }
        });
    }
    
    // Return a limited number of matches to keep the AI processing focused.
    return processedMatches.slice(0, 10);
  } catch (error) {
    console.error('Error fetching from Cricbuzz API:', error);
    return [];
  }
}

export const fetchRecentMatches = ai.defineTool(
  {
    name: 'fetchRecentMatches',
    description: 'Fetches recent cricket matches from the Cricbuzz API.',
    outputSchema: FetchRecentMatchesOutputSchema,
  },
  getRecentMatches
);
