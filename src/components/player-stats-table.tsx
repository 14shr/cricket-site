import type { DisambiguatePlayerStatsOutput } from "@/ai/flows/disambiguate-player-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CricketBatIcon } from "./icons/cricket-bat-icon";
import { CricketBallIcon } from "./icons/cricket-ball-icon";
import { ClipboardList, TrendingUp, User } from "lucide-react";
import { Badge } from "./ui/badge";

type PlayerStatsTableProps = {
  data: DisambiguatePlayerStatsOutput;
};

export function PlayerStatsTable({ data }: PlayerStatsTableProps) {
  if (!data || data.playerStats.length === 0) {
    return (
       <Card className="shadow-lg text-center backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">No Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No player statistics found for your query.</p>
          {data?.disambiguation_summary && <p className="text-sm text-muted-foreground mt-2">{data.disambiguation_summary}</p>}
        </CardContent>
       </Card>
    )
  }

  return (
    <Card className="shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Player Statistics</CardTitle>
        <CardDescription>{data.disambiguation_summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-headline text-foreground/90"><User className="inline-block mr-2 h-4 w-4 text-accent" />Player</TableHead>
                <TableHead className="font-headline text-foreground/90"><ClipboardList className="inline-block mr-2 h-4 w-4 text-accent" />Matches</TableHead>
                <TableHead className="font-headline text-foreground/90"><CricketBatIcon className="inline-block mr-2 h-4 w-4 text-accent" />Runs</TableHead>
                <TableHead className="font-headline text-foreground/90"><CricketBallIcon className="inline-block mr-2 h-4 w-4 text-accent" />Wickets</TableHead>
                <TableHead className="font-headline text-foreground/90"><TrendingUp className="inline-block mr-2 h-4 w-4 text-accent" />Average</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.playerStats.map((player) => (
                <TableRow key={player.name}>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>{player.matches}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{player.runs}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{player.wickets}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">{player.average.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
