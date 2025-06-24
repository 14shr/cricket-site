'use server';

/**
 * @fileOverview A flow to get the latest cricket news by summarizing recent matches.
 *
 * - getNews - A function that fetches the news articles.
 * - GetNewsOutput - The return type for the getNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { fetchRecentMatches } from '@/lib/news-tool';

// --- OUTPUT SCHEMA (Remains the same to fit the UI) ---

const NewsArticleSchema = z.object({
    headline: z.string().describe("A catchy headline summarizing the match result."),
    summary: z.string().describe("A brief summary of the match, including the result and key details."),
    source: z.string().describe("The name of the news source (e.g., Cricbuzz)."),
    url: z.string().describe("A direct URL to a relevant cricket website."),
    image: z.string().describe("A URL for a relevant image for the article. Use a placeholder if no real image is available."),
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

// --- GENKIT PROMPT ---

const getNewsPrompt = ai.definePrompt({
  name: 'getNewsPrompt',
  tools: [fetchRecentMatches],
  output: { schema: GetNewsOutputSchema },
  prompt: `You are a cricket news editor. Your task is to generate news articles based on recent match results.

1.  You MUST call the \`fetchRecentMatches\` tool to get a list of recently completed cricket matches.
2.  From the matches returned by the tool, select up to 5 of the most interesting ones.
3.  For each selected match, you MUST generate a news article and format it into the required JSON output.
    -   'headline' should be a catchy news headline based on the match result (e.g., "India outplay England in a thriller" or "Australia clinch the series against South Africa"). Use the team names and the 'status' field.
    -   'summary' should be a brief paragraph describing the match outcome. Mention the series, the teams, the venue, and the final result from the 'status' field.
    -   'source' MUST be "Cricbuzz".
    -   'url' MUST be "https://www.cricbuzz.com/".
    -   'image' MUST be a placeholder: https://placehold.co/600x400.png.
4.  Your final response MUST be in the specified JSON format.

If the tool returns no matches, you MUST return an empty array for "articles" and a summary message saying "Could not find any recent cricket matches."`,
});


// --- GENKIT FLOW ---

const getNewsFlow = ai.defineFlow(
  {
    name: 'getNewsFlow',
    outputSchema: GetNewsOutputSchema,
  },
  async () => {
    try {
      const { output } = await getNewsPrompt({});
      if (!output) {
          return { articles: [], summary: "Could not retrieve news from the AI model." };
      }
      return output;
    } catch(e: any) {
        console.error("Error in getNewsFlow:", e);
        return {
            articles: [],
            summary: e.message || "An unexpected error occurred while fetching the news."
        }
    }
  }
);
