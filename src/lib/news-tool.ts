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
    throw new Error('The API key for the news service is not configured. Please add RAPIDAPI_KEY to your environment variables.');
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

    if (!rawData || !Array.isArray(rawData.typeMatches)) {
      console.warn("Cricbuzz API response is not in the expected format or typeMatches is missing.");
      return [];
    }

    for (const typeMatch of rawData.typeMatches) {
      if (!typeMatch || !Array.isArray(typeMatch.seriesMatches)) {
        continue;
      }

      for (const seriesMatch of typeMatch.seriesMatches) {
        // The actual matches are nested inside seriesAdWrapper, but some elements are ads
        if (!seriesMatch || !seriesMatch.seriesAdWrapper || !Array.isArray(seriesMatch.seriesAdWrapper.matches)) {
          continue;
        }

        for (const match of seriesMatch.seriesAdWrapper.matches) {
          const { matchInfo } = match;

          if (
            matchInfo &&
            matchInfo.seriesName &&
            matchInfo.matchDesc &&
            matchInfo.status &&
            matchInfo.team1 &&
            matchInfo.team1.teamName &&
            matchInfo.team2 &&
            matchInfo.team2.teamName &&
            matchInfo.venueInfo &&
            matchInfo.venueInfo.ground &&
            matchInfo.venueInfo.city
          ) {
            processedMatches.push({
              seriesName: matchInfo.seriesName,
              matchDescription: matchInfo.matchDesc,
              matchFormat: matchInfo.matchFormat,
              status: matchInfo.status,
              team1Name: matchInfo.team1.teamName,
              team2Name: matchInfo.team2.teamName,
              venue: `${matchInfo.venueInfo.ground}, ${matchInfo.venueInfo.city}`,
            });
          }
        }
      }
    }
    
    return processedMatches.slice(0, 10);
  } catch (error) {
    console.error('Error fetching from Cricbuzz API:', error);
    if (axios.isAxiosError(error)) {
        if (error.response) {
            const status = error.response.status;
            let message = `The news service responded with an error (status ${status}).`;
            if (status === 401 || status === 403) {
                message = "Authentication with the news service failed. Please check your RAPIDAPI_KEY."
            } else if (status >= 500) {
                message = "The news service is temporarily unavailable. Please try again later."
            }
            throw new Error(message);
        } else if (error.request) {
            throw new Error("Could not connect to the news service. Please check your network connection.");
        }
    }
    throw new Error("An unexpected error occurred while fetching news.");
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
