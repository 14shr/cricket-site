'use server';

/**
 * @fileOverview A Genkit tool for fetching top sports news headlines from NewsAPI.
 *
 * - fetchSportsNews: A tool that can be used by an AI model to get sports news.
 */

import { ai } from '@/ai/genkit';
import axios from 'axios';
import { z } from 'zod';

const NewsApiArticleSchema = z.object({
  source: z.object({
    id: z.string().nullable(),
    name: z.string(),
  }),
  author: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  urlToImage: z.string().nullable(),
  publishedAt: z.string(),
  content: z.string().nullable(),
});

const FetchSportsNewsOutputSchema = z.array(NewsApiArticleSchema);

export const fetchSportsNews = ai.defineTool(
  {
    name: 'fetchSportsNews',
    description: 'Fetches top sports headlines from India from the NewsAPI.',
    outputSchema: FetchSportsNewsOutputSchema,
  },
  async () => {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      console.error('NEWS_API_KEY is not set in the environment.');
      throw new Error('News API key is not configured.');
    }
    const url = `https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=${apiKey}`;
    try {
      const response = await axios.get(url);
      
      if (response.data.status !== 'ok') {
          console.error('NewsAPI request failed:', response.data.message);
          return [];
      }
      
      return response.data.articles || [];
    } catch (error) {
      console.error('Error fetching from NewsAPI:', error);
      // Return an empty array to prevent the entire flow from failing.
      return [];
    }
  }
);
