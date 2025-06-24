'use client';

import { useState, useEffect } from 'react';
import type { DisambiguatePlayerStatsOutput } from '@/ai/flows/disambiguate-player-stats';
import { getPlayerStatsAction, getLiveMatchesAction } from '@/app/actions';
import { SearchForm } from '@/components/search-form';
import { PlayerStatsTable } from '@/components/player-stats-table';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { LiveMatches } from '@/components/live-matches';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CricketStatsClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DisambiguatePlayerStatsOutput | null>(null);
  const [liveMatches, setLiveMatches] = useState<string[] | null>(null);
  const [liveMatchesLoading, setLiveMatchesLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchLiveMatches() {
      setLiveMatchesLoading(true);
      const result = await getLiveMatchesAction();
      if (result.error) {
        console.error(result.error);
        toast({
          variant: 'destructive',
          title: 'Could not fetch live matches.',
          description: result.error,
        });
      } else {
        setLiveMatches(result.data);
      }
      setLiveMatchesLoading(false);
    }
    fetchLiveMatches();
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
    <Card className="shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader>
        <Skeleton className="h-8 w-48 bg-muted/80" />
        <Skeleton className="h-4 w-64 mt-2 bg-muted/80" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full bg-muted/80" />
          <Skeleton className="h-12 w-full bg-muted/80" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {liveMatchesLoading ? renderLiveMatchesLoader() : liveMatches && <LiveMatches matches={liveMatches} />}
      
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
    </div>
  );
}
