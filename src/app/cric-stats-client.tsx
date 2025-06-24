'use client';

import { useState, useEffect } from 'react';
import type { DisambiguatePlayerStatsOutput } from '@/ai/flows/disambiguate-player-stats';
import { getPlayerStatsAction } from '@/app/actions';
import { SearchForm } from '@/components/search-form';
import { PlayerStatsTable } from '@/components/player-stats-table';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { LatestVideos, LatestVideosSkeleton } from '@/components/latest-videos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { MotionWrapper } from '@/components/motion-wrapper';

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
      try {
        const response = await fetch('/api/videos');
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch videos');
        }
        const data = await response.json();
        setLatestVideos(data);
      } catch (err: any) {
          console.error(err.message);
          toast({
              variant: 'destructive',
              title: 'Could not fetch videos.',
              description: err.message,
          });
          setLatestVideos([]);
      } finally {
          setVideosLoading(false);
      }
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
      <section 
        className="w-full py-12 text-center md:py-20 lg:py-24 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://i.postimg.cc/PJdX0NQS/rugby-sport-environment-filed.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container relative mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
            Welcome to CricStats Central
          </h1>
          <p className="mx-auto max-w-[700px] mt-4 text-gray-200 md:text-xl/relaxed">
            Your hub for the latest cricket news, scores, and stats.
          </p>
          <div className="mx-auto mt-6 w-full max-w-sm">
             <SearchForm onSubmit={handleSearch} isPending={loading} />
          </div>
        </div>
      </section>

      {/* Main content area */}
      <div className="container mx-auto px-4 md:px-6 py-12 space-y-12">
        {/* This container will hold the search results */}
        <div className="min-h-0">
          {loading && <LoadingSkeleton />}

          {error && !loading && (
            <MotionWrapper>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </MotionWrapper>
          )}
          
          {data && !loading && <PlayerStatsTable data={data} />}
        </div>
        
        {/* Show feature cards */}
        <div className="grid gap-6 md:grid-cols-3">
            <MotionWrapper delay={0.1}>
              <Link href="/scores" className="block hover:scale-105 transition-transform duration-200">
                  <Card className="h-full">
                      <CardHeader>
                          <CardTitle>Live Scores</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground">Stay updated with real-time match scores and updates.</p>
                      </CardContent>
                  </Card>
              </Link>
            </MotionWrapper>
            <MotionWrapper delay={0.2}>
              <Link href="/stadium" className="block hover:scale-105 transition-transform duration-200">
                  <Card className="h-full">
                      <CardHeader>
                          <CardTitle>Stadium View</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground">Explore cricket stadiums in stunning 3D.</p>
                      </CardContent>
                  </Card>
              </Link>
            </MotionWrapper>
            <MotionWrapper delay={0.3}>
              <Link href="/news" className="block hover:scale-105 transition-transform duration-200">
                  <Card className="h-full">
                      <CardHeader>
                          <CardTitle>Cricket News</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground">Catch up on the latest headlines from the cricket world.</p>
                      </CardContent>
                  </Card>
              </Link>
            </MotionWrapper>
        </div>
      </div>

      {/* Highlights Section */}
      <section className="w-full py-12 md:py-20 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
              <MotionWrapper>
                <h2 className="mb-8 text-3xl font-bold tracking-tighter text-center">Latest Highlights</h2>
              </MotionWrapper>
              {videosLoading ? <LatestVideosSkeleton /> : latestVideos && <LatestVideos videos={latestVideos} />}
          </div>
      </section>
    </main>
  );
}
