'use client';

import { useState, useEffect } from 'react';
import type { DisambiguatePlayerStatsOutput } from '@/ai/flows/disambiguate-player-stats';
import { getPlayerStatsAction, getLatestVideosAction } from '@/app/actions';
import { SearchForm } from '@/components/search-form';
import { PlayerStatsTable } from '@/components/player-stats-table';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { LatestVideos, LatestVideosSkeleton } from '@/components/latest-videos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CricketStatsClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DisambiguatePlayerStatsOutput | null>(null);
  const [latestVideos, setLatestVideos] = useState<string[] | null>(null);
  const [videosLoading, setVideosLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchInitialData() {
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
  
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-12 text-center md:py-20 lg:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Welcome to CricStats Central
          </h1>
          <p className="mx-auto max-w-[700px] mt-4 text-muted-foreground md:text-xl/relaxed">
            Your hub for the latest cricket news, scores, and stats.
          </p>
          <div className="mx-auto mt-6 w-full max-w-sm">
             <SearchForm onSubmit={handleSearch} isPending={loading} />
          </div>
        </div>
      </section>

      {/* Main content area */}
      <div className="container mx-auto px-4 md:px-6 py-12 space-y-12">
        {/* This container will hold either the feature cards or the search results */}
        <div className="min-h-[250px]">
          {loading && <LoadingSkeleton />}

          {error && !loading && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {data && !loading ? (
              <PlayerStatsTable data={data} />
          ) : !loading && !error && (
              <div className="grid gap-6 lg:grid-cols-3">
                  <Card>
                      <CardHeader>
                          <CardTitle>Live Scores</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground">Stay updated with real-time match scores and updates.</p>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader>
                          <CardTitle>Player Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground">Access detailed stats and profiles of your favorite players.</p>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader>
                          <CardTitle>Match Calendar</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground">View upcoming fixtures and previous results.</p>
                      </CardContent>
                  </Card>
              </div>
          )}
        </div>
      </div>

      {/* Highlights Section */}
      <section className="w-full py-12 md:py-20 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
              <h2 className="mb-8 text-3xl font-bold tracking-tighter text-center">Latest Highlights</h2>
              {videosLoading ? <LatestVideosSkeleton /> : latestVideos && <LatestVideos videos={latestVideos} />}
          </div>
      </section>
    </main>
  );
}
