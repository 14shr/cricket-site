import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MotionWrapper } from "./motion-wrapper";

type LiveMatchesListProps = {
  matches: string[];
};

export function LiveMatchesList({ matches }: LiveMatchesListProps) {
    const isLive = matches && matches.length > 0 && !matches[0].toLowerCase().includes('no live') && !matches[0].toLowerCase().includes('could not');

    if (!isLive) {
        return (
             <MotionWrapper>
                <Card>
                    <CardHeader>
                        <CardTitle>No Live Matches</CardTitle>
                        <CardDescription>
                            There are no live matches at the moment. Please check back later.
                        </CardDescription>
                    </CardHeader>
                </Card>
             </MotionWrapper>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, index) => (
                <MotionWrapper key={index} delay={index * 0.1}>
                    <Card className="bg-primary text-primary-foreground shadow-lg flex h-full">
                        <CardContent className="p-6 flex items-center justify-center h-full w-full">
                            <p className="font-code text-base text-center whitespace-pre-wrap">{match}</p>
                        </CardContent>
                    </Card>
                </MotionWrapper>
            ))}
        </div>
    );
}
