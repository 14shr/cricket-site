import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

type LiveMatchesListProps = {
  matches: string[];
};

export function LiveMatchesList({ matches }: LiveMatchesListProps) {
    const isLive = matches && matches.length > 0 && !matches[0].toLowerCase().includes('no live') && !matches[0].toLowerCase().includes('could not');

    if (!isLive) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>No Live Matches</CardTitle>
                    <CardDescription>
                        There are no live matches at the moment. Please check back later.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, index) => (
                <Card key={index} className="bg-muted/50 hover:bg-muted transition-colors flex">
                    <CardContent className="p-6 flex items-center justify-center h-full w-full">
                        <p className="text-sm font-medium text-center text-foreground/90 whitespace-pre-wrap">{match}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
