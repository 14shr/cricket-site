'use client';

import { useState, useEffect } from 'react';
import type { DisambiguatePlayerStatsOutput } from '@/ai/flows/disambiguate-player-stats';
import { getPlayerStatsAction, getLiveMatchesAction, getLatestVideosAction } from '@/app/actions';
import { SearchForm } from '@/components/search-form';
import { PlayerStatsTable } from '@/components/player-stats-table';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { LiveMatches } from '@/components/live-matches';
import { Skeleton } from '@/components/ui/skeleton';
import { LatestVideos, LatestVideosSkeleton } from '@/components/latest-videos';

export default function CricketStatsClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DisambiguatePlayerStatsOutput | null>(null);
  const [liveMatches, setLiveMatches] = useState<string[] | null>(null);
  const [liveMatchesLoading, setLiveMatchesLoading] = useState(true);
  const [latestVideos, setLatestVideos] = useState<string[] | null>(null);
  const [videosLoading, setVideosLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchInitialData() {
      setLiveMatchesLoading(true);
      const liveMatchesResult = await getLiveMatchesAction();
      if (liveMatchesResult.error) {
        console.error(liveMatchesResult.error);
        toast({
          variant: 'destructive',
          title: 'Could not fetch live matches.',
          description: liveMatchesResult.error,
        });
      } else {
        setLiveMatches(liveMatchesResult.data);
      }
      setLiveMatchesLoading(false);

      setVideosLoading(true);
      const videosResult = await getLatestVideosAction();
      if (videosResult.error) {
          console.error(videosResult.error);
          toast({
              variant: 'destructive',
              title: 'Could not fetch videos.',
              description: videosResult.error,
          });
          setLatestVideos([]);
      } else {
          setLatestVideos(videosResult.data);
      }
      setVideosLoading(false);
    }
    fetchInitialData();
  }, [toast]);

  const handleSearch = async (playerName: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    const result = await getPlayerStatsAction({ playerName });

    if (result.error) {
      setError(result.error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: result.error,
      });
    } else {
      setData(result.data);
      if(!result.data?.playerStats) {
        toast({
          title: 'No players found',
          description: result.data?.summary || `Could not find any players matching the name "${playerName}".`
        })
      }
    }
    setLoading(false);
  };
  
  const renderLiveMatchesLoader = () => (
    <div className="w-full">
      <div className="mb-4">
        <Skeleton className="h-8 w-48 bg-muted/80" />
        <Skeleton className="h-4 w-64 mt-2 bg-muted/80" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-20 w-full bg-muted/80 rounded-lg" />
        <Skeleton className="h-20 w-full bg-muted/80 rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <SearchForm onSubmit={handleSearch} isPending={loading} />

      {loading && <LoadingSkeleton />}

      {error && !loading && (
         <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {data && !loading && (
        <PlayerStatsTable data={data} />
      )}
      
      {liveMatchesLoading ? renderLiveMatchesLoader() : liveMatches && <LiveMatches matches={liveMatches} />}
      
      {videosLoading ? <LatestVideosSkeleton /> : latestVideos && <LatestVideos videos={latestVideos} />}
    </div>
  );
}