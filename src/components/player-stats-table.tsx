import type { DisambiguatePlayerStatsOutput } from "@/ai/flows/disambiguate-player-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Goal, Handshake, Users } from "lucide-react";
import { Badge } from "./ui/badge";

type PlayerStatsTableProps = {
  data: DisambiguatePlayerStatsOutput;
};

export function PlayerStatsTable({ data }: PlayerStatsTableProps) {
  if (!data || !data.playerStats) {
    return (
       <Card className="shadow-lg text-center backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">No Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No player statistics found for your query.</p>
          {data?.summary && <p className="text-sm text-muted-foreground mt-2">{data.summary}</p>}
        </CardContent>
       </Card>
    )
  }
  
  const { playerStats, summary } = data;

  return (
    <Card className="shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{playerStats.name}</CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-headline text-foreground/90"><Users className="inline-block mr-2 h-4 w-4 text-accent" />Appearances</TableHead>
                <TableHead className="font-headline text-foreground/90"><Goal className="inline-block mr-2 h-4 w-4 text-accent" />Goals</TableHead>
                <TableHead className="font-headline text-foreground/90"><Handshake className="inline-block mr-2 h-4 w-4 text-accent" />Assists</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                  <TableCell>
                    <Badge variant="secondary">{playerStats.appearances}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{playerStats.goals}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{playerStats.assists}</Badge>
                  </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
