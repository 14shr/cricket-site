import type { DisambiguatePlayerStatsOutput } from "@/ai/flows/disambiguate-player-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Separator } from "./ui/separator";
import { MotionWrapper } from "./motion-wrapper";

type PlayerStatsTableProps = {
  data: DisambiguatePlayerStatsOutput;
};

const RankingDisplay = ({ batting, bowling }: { batting: { test: string; odi: string; t20: string }; bowling: { test: string; odi: string; t20: string } }) => {
  const RankingColumn = ({ title, stats }: { title: string; stats: { test: string; odi: string; t20: string }}) => (
    <div>
      <h4 className="text-base font-medium text-foreground mb-2">{title}</h4>
      <div className="grid grid-cols-3 text-center">
        <div>
          <p className="text-xs text-muted-foreground">Test</p>
          <p className="font-bold text-lg text-primary">{stats.test}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">ODI</p>
          <p className="font-bold text-lg text-primary">{stats.odi}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">T20</p>
          <p className="font-bold text-lg text-primary">{stats.t20}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
      <RankingColumn title="Batting" stats={batting} />
      <RankingColumn title="Bowling" stats={bowling} />
    </div>
  );
};

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
       <MotionWrapper>
        <Card className="shadow-lg text-center bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">No Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{data?.summary || 'No player statistics found for your query.'}</p>
          </CardContent>
        </Card>
       </MotionWrapper>
    )
  }
  
  const { playerStats } = data;

  return (
    <MotionWrapper className="space-y-6">
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
              <RankingDisplay batting={playerStats.rankings.batting} bowling={playerStats.rankings.bowling} />
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

    </MotionWrapper>
  );
}
