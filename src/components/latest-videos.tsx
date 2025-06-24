import { PlaySquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

type LatestVideosProps = {
  videos: string[];
};

export function LatestVideos({ videos }: LatestVideosProps) {
    const hasVideos = videos && videos.length > 0 && !videos[0].includes('Could not');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl font-bold flex items-center gap-2">
                    <PlaySquare className="h-6 w-6 text-primary" />
                    <span>Latest Videos</span>
                </CardTitle>
                <CardDescription>
                    {hasVideos ? 'Highlights and clips from YouTube.' : 'Could not load videos at the moment.'}
                </CardDescription>
            </CardHeader>
            {hasVideos && (
                 <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {videos.map((videoUrl, index) => (
                            <div key={index} className="aspect-video w-full">
                                <iframe
                                    className="w-full h-full rounded-lg"
                                    src={videoUrl}
                                    title={`YouTube video player ${index + 1}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

export function LatestVideosSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-48 bg-muted/80" />
                <Skeleton className="h-4 w-64 mt-2 bg-muted/80" />
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="w-full bg-muted/80 rounded-lg aspect-video" />
                    <Skeleton className="w-full bg-muted/80 rounded-lg aspect-video" />
                    <Skeleton className="w-full bg-muted/80 rounded-lg aspect-video" />
                </div>
            </CardContent>
        </Card>
    )
}
