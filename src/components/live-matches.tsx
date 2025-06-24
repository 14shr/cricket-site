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
        <ul className="space-y-4">
          {matches.map((match, index) => (
            <li key={index} className="p-3 bg-muted/50 rounded-md border border-border/50">
              <p className="text-sm font-medium text-foreground/90 whitespace-pre-wrap">{match}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
