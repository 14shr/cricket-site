'use server';

/**
 * @fileOverview A flow to get the latest cricket news using an AI model.
 *
 * - getNews - A function that fetches the news articles.
 * - GetNewsOutput - The return type for the getNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { fetchCricketNews } from '@/lib/news-tool';

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
  tools: [fetchCricketNews],
  output: { schema: GetNewsOutputSchema },
  prompt: `You are a cricket news editor. Your task is to provide a list of the top 5 most recent and important cricket news articles.

1.  You MUST call the \`fetchCricketNews\` tool to get a list of the latest cricket headlines.
2.  From the articles returned by the tool, select up to 5 of the most relevant ones.
3.  For each selected article, you MUST format it into the required JSON output.
    -   'headline' should be the article's original title.
    -   'summary' should be the article's original description.
    -   'source' should be the name of the news source.
    -   'url' is the direct URL to the article.
    -   'image' should be the image URL from the article ('urlToImage'). If no image URL is provided or it's empty, you MUST use a placeholder: https://placehold.co/600x400.png.
4.  Your final response MUST be in the specified JSON format.

If the tool returns no articles, you MUST return an empty array for "articles" and a summary message saying "Could not find any recent cricket news."`,
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
