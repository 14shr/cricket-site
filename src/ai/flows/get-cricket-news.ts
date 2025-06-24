'use server';

/**
 * @fileOverview A flow to get the latest cricket news by summarizing recent matches.
 *
 * - getNews - A function that fetches the news articles.
 * - GetNewsOutput - The return type for the getNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { getRecentMatches } from '@/lib/news-tool';

// --- OUTPUT SCHEMA (Remains the same to fit the UI) ---

const NewsArticleSchema = z.object({
    headline: z.string().describe("A headline summarizing the match result."),
    summary: z.string().describe("A brief summary of the match, including the result and key details."),
    source: z.string().describe("The name of the news source (e.g., Cricbuzz)."),
    url: z.string().describe("A direct URL to a relevant cricket website."),
});

const GetNewsOutputSchema = z.object({
  articles: z.array(NewsArticleSchema).describe('A list of news articles generated from recent matches.'),
  summary: z.string().describe('A summary indicating if news was found or not.'),
});

export type GetNewsOutput = z.infer<typeof GetNewsOutputSchema>;

// --- EXPORTED ACTION FUNCTION ---

export async function getNews(): Promise<GetNewsOutput> {
  return getNewsFlow();
}

// --- GENKIT FLOW ---

const getNewsFlow = ai.defineFlow(
  {
    name: 'getNewsFlow',
    outputSchema: GetNewsOutputSchema,
  },
  async () => {
    try {
      const matches = await getRecentMatches();
      
      if (!matches || matches.length === 0) {
        return { articles: [], summary: "Could not find any recent cricket matches." };
      }

      const articles = matches.map(match => {
        return {
          headline: match.status,
          summary: `The ${match.matchDescription} of the ${match.seriesName} between ${match.team1Name} and ${match.team2Name} took place at ${match.venue}.`,
          source: "Cricbuzz",
          url: "https://www.cricbuzz.com/",
        };
      });

      return {
        articles,
        summary: "Displaying latest match results."
      };

    } catch(e: any) {
        console.error("Error in getNewsFlow:", e);
        return {
            articles: [],
            summary: e.message || "An unexpected error occurred while fetching the news."
        }
    }
  }
);
