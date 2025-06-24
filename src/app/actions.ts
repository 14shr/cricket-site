'use server';

import { z } from 'zod';
import { disambiguatePlayerStats, type DisambiguatePlayerStatsOutput } from '@/ai/flows/disambiguate-player-stats';
import { getLiveMatches as fetchLiveMatches } from '@/lib/live-scraper';

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
