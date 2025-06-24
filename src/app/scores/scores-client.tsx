'use client';

import { useState, useEffect } from 'react';
import { LiveMatchesList } from '@/components/live-matches-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Tv } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ScoresClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchLiveScores() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/scores');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch live scores');
        }
        const data = await response.json();
        setMatches(data);
      } catch(err: any) {
        setError(err.message);
        toast({
          variant: 'destructive',
          title: 'Could not fetch live scores.',
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchLiveScores();
  }, [toast]);

  const isLive = matches && matches.length > 0 && !matches[0].toLowerCase().includes('no live') && !matches[0].toLowerCase().includes('could not');

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Tv className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl md:text-5xl flex items-center gap-3">
          <span>Live Cricket Scores</span>
          {!loading && isLive && (
            <div className="relative flex h-3 w-3">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-2 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-3 w-3 bg-chart-2"></div>
            </div>
          )}
        </h1>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      )}

      {error && !loading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {matches && !loading && <LiveMatchesList matches={matches} />}
    </div>
  );
}
