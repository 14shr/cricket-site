'use server';

import { z } from 'zod';
import { disambiguatePlayerStats, type DisambiguatePlayerStatsOutput } from '@/ai/flows/disambiguate-player-stats';
import { getLiveMatches as fetchLiveMatches } from '@/lib/live-scraper';
import { getLatestVideos } from '@/lib/youtube-scraper';
import { getMatchSchedule, type GetMatchScheduleOutput } from '@/ai/flows/get-match-schedule';

const PlayerStatsActionSchema = z.object({
  playerName: z.string().min(2, { message: "Player name must be at least 2 characters." }),
});

type ActionState = {
  data?: DisambiguatePlayerStatsOutput | null;
  error?: string | null;
}

export async function getPlayerStatsAction(input: { playerName: string }): Promise<ActionState> {
  const validationResult = PlayerStatsActionSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      error: validationResult.error.errors.map((e) => e.message).join(', '),
    };
  }

  try {
    const stats = await disambiguatePlayerStats({ playerName: validationResult.data.playerName });
    return { data: stats };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return {
      error: `Failed to retrieve player stats. ${errorMessage}`
    };
  }
}

type LiveMatchesActionState = {
    data?: string[] | null;
    error?: string | null;
}

export async function getLiveMatchesAction(): Promise<LiveMatchesActionState> {
    try {
        const matches = await fetchLiveMatches();
        return { data: matches };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
        return {
            error: `Failed to retrieve live matches. ${errorMessage}`
        };
    }
}


type LatestVideosActionState = {
    data?: string[] | null;
    error?: string | null;
}

export async function getLatestVideosAction(): Promise<LatestVideosActionState> {
    try {
        const videos = await getLatestVideos();
        return { data: videos };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
        return {
            error: `Failed to retrieve latest videos. ${errorMessage}`
        };
    }
}

const MatchScheduleActionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format. Please use YYYY-MM-DD." }),
});

type MatchScheduleActionState = {
  data?: GetMatchScheduleOutput | null;
  error?: string | null;
}

export async function getMatchScheduleAction(input: { date: string }): Promise<MatchScheduleActionState> {
  const validationResult = MatchScheduleActionSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      error: validationResult.error.errors.map((e) => e.message).join(', '),
    };
  }

  try {
    const schedule = await getMatchSchedule({ date: validationResult.data.date });
    return { data: schedule };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return {
      error: `Failed to retrieve match schedule. ${errorMessage}`
    };
  }
}
