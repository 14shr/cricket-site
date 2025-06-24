import type { DisambiguatePlayerStatsOutput } from "@/ai/flows/disambiguate-player-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Separator } from "./ui/separator";

type PlayerStatsTableProps = {
  data: DisambiguatePlayerStatsOutput;
};

const StatCard = ({ title, test, odi, t20 }: { title: string; test: string; odi: string; t20: string }) => (
  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted">
    <span className="text-xs font-medium text-muted-foreground">{title}</span>
    <div className="flex gap-4 mt-1">
      <div className="text-center">
        <p className="text-xs text-muted-foreground/80">Test</p>
        <p className="font-bold text-sm text-primary">{test}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground/80">ODI</p>
        <p className="font-bold text-sm text-primary">{odi}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground/80">T20</p>
        <p className="font-bold text-sm text-primary">{t20}</p>
      </div>
    </div>
  </div>
);

const StatsTable = ({ title, stats }: { title: string, stats: Record<string, any> }) => {
  const formats = ['test', 'odi', 't20i'];
  const statKeys = stats[formats[0]] ? Object.keys(stats[formats[0]]) : [];
  
  // Custom headers mapping
  const headerMapping: { [key: string]: string } = {
    matches: 'Mat',
    runs: 'Runs',
    highest_score: 'HS',
    average: 'Avg',
    strike_rate: 'SR',
    hundreds: '100',
    fifties: '50',
    balls: 'Balls',
    wickets: 'Wkts',
    best_bowling_innings: 'BBI',
    economy: 'Econ',
    five_wickets: '5W',
  };

  return (
    <div>
      <h3 className="text-xl font-bold font-headline mb-2 text-primary">{title}</h3>
      <Card className="bg-card/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10 hover:bg-primary/20">
                <TableHead className="font-semibold text-primary">Format</TableHead>
                {statKeys.map(key => <TableHead key={key} className="font-semibold text-primary">{headerMapping[key] || key}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {formats.map(format => (
                <TableRow key={format}>
                  <TableCell className="font-medium uppercase">{format}</TableCell>
                  {statKeys.map(key => <TableCell key={key}>{stats[format]?.[key] || '-'}</TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};


export function PlayerStatsTable({ data }: PlayerStatsTableProps) {
  if (!data || !data.playerStats) {
    return (
       <Card className="shadow-lg text-center bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">No Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{data?.summary || 'No player statistics found for your query.'}</p>
        </CardContent>
       </Card>
    )
  }
  
  const { playerStats } = data;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg bg-card overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 xl:w-1/4">
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage src={playerStats.image || ''} alt={playerStats.name} data-ai-hint="cricket player" className="object-cover object-top aspect-[4/5]" />
              <AvatarFallback className="text-5xl rounded-none aspect-[4/5] bg-muted">{playerStats.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 p-6 space-y-4">
            <div>
              <h1 className="text-4xl font-bold font-headline text-primary">{playerStats.name}</h1>
              <p className="text-xl text-muted-foreground">{playerStats.country}</p>
              <Badge variant="outline" className="mt-2">{playerStats.role}</Badge>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold font-headline mb-3">ICC Rankings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard title="Batting" {...playerStats.rankings.batting} />
                <StatCard title="Bowling" {...playerStats.rankings.bowling} />
              </div>
            </div>
             <Separator />
             <div>
                <h3 className="text-lg font-semibold font-headline mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground">{playerStats.summary}</p>
            </div>
          </div>
        </div>
      </Card>

      {playerStats.batting_stats && Object.keys(playerStats.batting_stats).length > 0 && <StatsTable title="Batting Career" stats={playerStats.batting_stats} />}
      {playerStats.bowling_stats && Object.keys(playerStats.bowling_stats).length > 0 && <StatsTable title="Bowling Career" stats={playerStats.bowling_stats} />}

    </div>
  );
}