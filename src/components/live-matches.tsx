import { Tv } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

type LiveMatchesProps = {
  matches: string[];
};

export function LiveMatches({ matches }: LiveMatchesProps) {
    const isLive = matches && matches.length > 0 && !matches[0].toLowerCase().includes('no live') && !matches[0].toLowerCase().includes('could not');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl font-bold flex items-center gap-2">
                    <Tv className="h-6 w-6 text-primary" />
                    <span>Live Cricket Scores</span>
                    {isLive && (
                        <div className="relative flex h-3 w-3">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-2/75" />
                            <div className="relative inline-flex rounded-full h-3 w-3 bg-chart-2" />
                        </div>
                    )}
                </CardTitle>
                <CardDescription>
                    {isLive ? 'Live scores from across the globe.' : 'No live matches found at the moment.'}
                </CardDescription>
            </CardHeader>
            {isLive && (
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matches.map((match, index) => (
                            <div key={index} className="bg-muted p-4 rounded-lg flex items-center justify-center h-full">
                                <p className="text-sm font-medium text-center text-foreground/90 whitespace-pre-wrap">{match}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
