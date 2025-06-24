'use client';

import { useState } from 'react';
import type { DisambiguatePlayerStatsOutput } from '@/ai/flows/disambiguate-player-stats';
import { getPlayerStatsAction } from '@/app/actions';
import { SearchForm } from '@/components/search-form';
import { PlayerStatsTable } from '@/components/player-stats-table';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function CricStatsClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DisambiguatePlayerStatsOutput | null>(null);
  const { toast } = useToast();

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
      if(result.data?.playerStats.length === 0) {
        toast({
          title: 'No players found',
          description: `Could not find any players matching the name "${playerName}".`
        })
      }
    }
    setLoading(false);
  };

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
    </div>
  );
}
