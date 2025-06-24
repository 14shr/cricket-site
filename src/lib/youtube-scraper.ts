'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export async function getLatestVideos(channelUrl: string): Promise<string[]> {
  try {
    const { data } = await axios.get(`${channelUrl}/videos`);
    const $ = cheerio.load(data);
    
    const videoUrls: string[] = [];
    
    $('a#video-title-link').each((i, element) => {
      const href = $(element).attr('href');
      if (href && href.startsWith('/watch?v=')) {
          const videoId = href.split('v=')[1];
          if (videoId) {
            const cleanVideoId = videoId.split('&')[0];
            const embedUrl = `https://www.youtube.com/embed/${cleanVideoId}`;
            if (!videoUrls.includes(embedUrl)) { // Avoid duplicates
                videoUrls.push(embedUrl);
            }
          }
      }
    });

    if (videoUrls.length === 0) {
      return ["Could not find any videos using the current method."];
    }
    
    return shuffleArray(videoUrls).slice(0, 4);
  } catch (error) {
    console.error("Error fetching latest videos:", error);
    return ["Could not retrieve videos due to an error."];
  }
}
