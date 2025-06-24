'use server';

/**
 * @fileOverview A flow to get the latest cricket news using an AI model.
 *
 * - getNews - A function that fetches the news articles.
 * - GetNewsOutput - The return type for the getNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// --- OUTPUT SCHEMA ---

const NewsArticleSchema = z.object({
    headline: z.string().describe("The main headline of the news article."),
    summary: z.string().describe("A brief summary of the news article."),
    source: z.string().describe("The name of the news source (e.g., ESPN, Cricbuzz)."),
    url: z.string().describe("The direct URL to the full article."),
    image: z.string().describe("A URL for a relevant image for the article. Use a placeholder if no real image is available."),
});

const GetNewsOutputSchema = z.object({
  articles: z.array(NewsArticleSchema).describe('A list of recent cricket news articles.'),
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
  output: { schema: GetNewsOutputSchema },
  prompt: `You are a cricket news aggregator.
  
  Your task is to provide a list of 5 recent and important cricket news articles.
  
  The response MUST be in the specified JSON format.
  
  For each article, include a catchy headline, a one-paragraph summary, the source name, a valid URL to the article, and an image URL. For the image URL, you MUST use a placeholder image from https://placehold.co/600x400.png. Do not use real image URLs.
  
  If you cannot find any news, return an empty array for "articles" and a summary message saying "Could not find any recent cricket news."`,
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
