'use server';

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getEmbedUrl(youtubeUrl: string): string | null {
    let videoId;
    if (youtubeUrl.includes('youtu.be/')) {
        // Extracts the ID from URLs like https://youtu.be/8Azh6R06X24?si=...
        videoId = youtubeUrl.split('youtu.be/')[1]?.split('?')[0];
    } else {
        // Handle other YouTube URL formats if needed in the future
        return null;
    }
    
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
}

export async function getLatestVideos(): Promise<string[]> {
  const videoLinks = [
    'https://youtu.be/8Azh6R06X24?si=LAO5ybSOupR_PUL3',
    'https://youtu.be/TZ78SFvWGS0?si=a8zBEDdk1_x_YIoR',
    'https://youtu.be/iUOMCf-8CZw?si=G2-bJldwy2hOgu5y',
    'https://youtu.be/U0wtpB3dc80?si=aJC4sSTz-Up2zklC'
  ];

  try {
    const embedUrls = videoLinks.map(getEmbedUrl).filter((url): url is string => url !== null);
    
    if (embedUrls.length === 0) {
        return ["No videos found."];
    }

    return shuffleArray(embedUrls).slice(0, 3);
  } catch (error) {
    console.error("Error processing video links:", error);
    return ["Could not process video links due to an error."];
  }
}
