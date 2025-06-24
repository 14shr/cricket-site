'use client';

import { useState, useEffect } from 'react';
import { getNewsAction } from '@/app/actions';
import type { GetNewsOutput } from '@/ai/flows/get-cricket-news';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { NewsArticleCard, NewsArticleSkeleton } from '@/components/news-article-card';
import { MotionWrapper } from '@/components/motion-wrapper';

export default function NewsClient() {
  const [news, setNews] = useState<GetNewsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchNews() {
        setLoading(true);
        setError(null);
        const result = await getNewsAction();

        if (result.error) {
            setError(result.error);
            toast({
                variant: 'destructive',
                title: 'An error occurred',
                description: result.error,
            });
        } else {
            setNews(result.data);
        }
        setLoading(false);
    }
    fetchNews();
  }, [toast]);

  return (
    <div>
        {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NewsArticleSkeleton />
                <NewsArticleSkeleton />
                <NewsArticleSkeleton />
            </div>
        )}
        {error && !loading && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {news && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.articles.length > 0 ? (
                    news.articles.map((article, index) => (
                        <MotionWrapper key={index} delay={index * 0.1}>
                           <NewsArticleCard article={article} />
                        </MotionWrapper>
                    ))
                ) : (
                    <MotionWrapper className="col-span-full">
                      <div className="text-center text-muted-foreground">
                          <p>{news.summary}</p>
                      </div>
                    </MotionWrapper>
                )}
            </div>
        )}
    </div>
  );
}
