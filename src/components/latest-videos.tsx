import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { MotionWrapper } from "./motion-wrapper";

type LatestVideosProps = {
  videos: string[];
};

export function LatestVideos({ videos }: LatestVideosProps) {
    const hasVideos = videos && videos.length > 0 && !videos[0].includes('Could not');

    if(!hasVideos) {
        return <MotionWrapper><p className="text-center text-muted-foreground">Could not load highlights at this time.</p></MotionWrapper>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((videoUrl, index) => (
                <MotionWrapper key={index} delay={index * 0.1}>
                    <Card className="overflow-hidden shadow-lg">
                        <div className="aspect-video">
                            <iframe
                                className="w-full h-full"
                                src={videoUrl}
                                title={`YouTube video player ${index + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </Card>
                </MotionWrapper>
            ))}
        </div>
    );
}

export function LatestVideosSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Skeleton className="w-full aspect-video bg-muted rounded-lg" />
            <Skeleton className="w-full aspect-video bg-muted rounded-lg" />
            <Skeleton className="w-full aspect-video bg-muted rounded-lg" />
        </div>
    )
}
