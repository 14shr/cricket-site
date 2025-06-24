'use server';

import axios from 'axios';

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export async function getLatestVideos(channelUrl: string): Promise<string[]> {
  try {
    const { data } = await axios.get(`${channelUrl}/videos`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        }
    });
    
    const ytInitialDataRegex = /var ytInitialData = (.*);<\/script>/;
    const match = data.match(ytInitialDataRegex);

    if (!match || !match[1]) {
        console.error("Could not find ytInitialData on the YouTube page.");
        return ["Could not parse video data from YouTube."];
    }
    
    let ytInitialData;
    try {
        ytInitialData = JSON.parse(match[1]);
    } catch (e) {
        console.error("Failed to parse ytInitialData JSON", e);
        return ["Could not parse video data from YouTube."];
    }

    const videosTab = ytInitialData?.contents?.twoColumnBrowseResultsRenderer?.tabs
        .find((tab: any) => tab.tabRenderer && tab.tabRenderer.title === 'Videos');

    const videoRenderers = videosTab?.tabRenderer?.content?.richGridRenderer?.contents;

    if (!videoRenderers) {
        console.error("Could not find video renderers in ytInitialData.");
        return ["Could not find video list on the channel page."];
    }

    const videoUrls: string[] = [];
    videoRenderers.forEach((item: any) => {
        if (item?.richItemRenderer?.content?.videoRenderer?.videoId) {
            const videoId = item.richItemRenderer.content.videoRenderer.videoId;
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            if (!videoUrls.includes(embedUrl)) {
                videoUrls.push(embedUrl);
            }
        }
    });

    if (videoUrls.length === 0) {
      return ["No videos found on the channel page."];
    }
    
    return shuffleArray(videoUrls).slice(0, 4);
  } catch (error) {
    console.error("Error fetching latest videos:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("YouTube scraper response status:", error.response.status);
    }
    return ["Could not retrieve videos due to an error."];
  }
}
