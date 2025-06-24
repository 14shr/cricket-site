import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tv } from "lucide-react";

type LiveMatchesProps = {
  matches: string[];
};

export function LiveMatches({ matches }: LiveMatchesProps) {
  if (!matches || matches.length === 0) {
    return (
      <Card className="shadow-lg backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <Tv className="mr-2 h-6 w-6 text-accent" /> Live Cricket Scores
          </CardTitle>
          <CardDescription>No live matches found at the moment.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
            <Tv className="mr-2 h-6 w-6 text-accent" /> Live Cricket Scores
        </CardTitle>
        <CardDescription>Live scores from across the globe.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match, index) => (
             <Card key={index} className="bg-muted/80">
                <CardContent className="p-4 flex items-center justify-center h-full">
                     <p className="text-sm font-medium text-center text-foreground/90 whitespace-pre-wrap">{match}</p>
                </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
