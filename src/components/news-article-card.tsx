import Link from 'next/link';
import Image from 'next/image';
import type { GetNewsOutput } from '@/ai/flows/get-cricket-news';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { ArrowRight } from 'lucide-react';

type NewsArticle = GetNewsOutput['articles'][0];

type NewsArticleCardProps = {
  article: NewsArticle;
};

export function NewsArticleCard({ article }: NewsArticleCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full aspect-video">
        <Image
          src={article.image || 'https://placehold.co/600x400.png'}
          alt={article.headline}
          data-ai-hint="cricket news"
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg font-bold leading-snug">{article.headline}</CardTitle>
        <CardDescription className="text-xs pt-1">Source: {article.source}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{article.summary}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="p-0 h-auto">
          <Link href={article.url} target="_blank" rel="noopener noreferrer">
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function NewsArticleSkeleton() {
    return (
        <Card className="flex flex-col h-full overflow-hidden">
            <Skeleton className="w-full aspect-video" />
            <CardHeader>
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-5 w-24" />
            </CardFooter>
        </Card>
    )
}
