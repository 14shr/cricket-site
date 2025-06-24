import { PlaySquare } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

type LatestVideosProps = {
  videos: string[];
};

export function LatestVideos({ videos }: LatestVideosProps) {
    const hasVideos = videos && videos.length > 0 && !videos[0].includes('Could not');

    if(!hasVideos) {
        return <p className="text-center text-muted-foreground">Could not load highlights at this time.</p>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((_videoUrl, index) => (
                 <Card key={index}>
                    <CardContent className="p-4 flex items-center gap-4">
                        <PlaySquare className="h-5 w-5 text-muted-foreground" />
                        <p className="font-medium">Match Highlight {index + 1}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function LatestVideosSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Skeleton className="h-16 w-full bg-background/80 rounded-lg" />
            <Skeleton className="h-16 w-full bg-background/80 rounded-lg" />
            <Skeleton className="h-16 w-full bg-background/80 rounded-lg" />
        </div>
    )
}
