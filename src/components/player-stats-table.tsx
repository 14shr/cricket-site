import type { DisambiguatePlayerStatsOutput } from "@/ai/flows/disambiguate-player-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";

type PlayerStatsTableProps = {
  data: DisambiguatePlayerStatsOutput;
};

const STAT_FORMATS = ['test', 'odi', 't20i'];

const RankingItem = ({ label, rank }: { label: string; rank: string }) => (
  <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
    <p className="font-medium text-muted-foreground">{label}</p>
    <Badge variant={rank && rank !== 'N/A' && rank !== '-' ? 'default' : 'secondary'}>
      {rank || '-'}
    </Badge>
  </div>
);

export function PlayerStatsTable({ data }: PlayerStatsTableProps) {
  if (!data || !data.playerStats) {
    return (
       <Card className="shadow-lg text-center backdrop-blur-sm bg-card/80">
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

  const hasBattingStats = STAT_FORMATS.some(format => playerStats.batting_stats[format]);
  const hasBowlingStats = STAT_FORMATS.some(format => playerStats.bowling_stats[format]);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg backdrop-blur-sm bg-card/80 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 xl:w-1/4 bg-muted">
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage src={playerStats.image || ''} alt={playerStats.name} data-ai-hint="cricket player" className="object-cover aspect-[4/5]" />
              <AvatarFallback className="text-5xl rounded-none aspect-[4/5]">{playerStats.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-bold font-headline">{playerStats.name}</h1>
              <p className="text-xl text-muted-foreground">{playerStats.country}</p>
              <Badge variant="outline" className="mt-2">{playerStats.role}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Batting Rankings</h3>
                <div className="space-y-2">
                  <RankingItem label="Test" rank={playerStats.rankings.batting.test} />
                  <RankingItem label="ODI" rank={playerStats.rankings.batting.odi} />
                  <RankingItem label="T20" rank={playerStats.rankings.batting.t20} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Bowling Rankings</h3>
                <div className="space-y-2">
                  <RankingItem label="Test" rank={playerStats.rankings.bowling.test} />
                  <RankingItem label="ODI" rank={playerStats.rankings.bowling.odi} />
                  <RankingItem label="T20" rank={playerStats.rankings.bowling.t20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {(hasBattingStats || hasBowlingStats) && (
        <div>
          <h2 className="text-3xl font-bold font-headline mb-6">Career Statistics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {hasBattingStats && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold font-headline">Batting</h3>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-primary">
                          <TableHead className="bg-primary text-primary-foreground">Format</TableHead>
                          <TableHead className="bg-primary text-primary-foreground">Avg</TableHead>
                          <TableHead className="bg-primary text-primary-foreground">50s</TableHead>
                          <TableHead className="bg-primary text-primary-foreground">HS</TableHead>
                          <TableHead className="bg-primary text-primary-foreground">100s</TableHead>
                          <TableHead className="bg-primary text-primary-foreground">M</TableHead>
                          <TableHead className="bg-primary text-primary-foreground">Runs</TableHead>
                          <TableHead className="bg-primary text-primary-foreground">SR</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {STAT_FORMATS.map(format => playerStats.batting_stats[format] && (
                          <TableRow key={format}>
                            <TableCell className="font-semibold uppercase">{format.toUpperCase().replace('I', '')}</TableCell>
                            <TableCell>{playerStats.batting_stats[format].average}</TableCell>
                            <TableCell>{playerStats.batting_stats[format].fifties}</TableCell>
                            <TableCell>{playerStats.batting_stats[format].highest_score}</TableCell>
                            <TableCell>{playerStats.batting_stats[format].hundreds}</TableCell>
                            <TableCell>{playerStats.batting_stats[format].matches}</TableCell>
                            <TableCell>{playerStats.batting_stats[format].runs}</TableCell>
                            <TableCell>{playerStats.batting_stats[format].strike_rate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
              </div>
            )}
            {hasBowlingStats && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold font-headline">Bowling</h3>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-primary">
                          <TableHead className="bg-primary text-primary-foreground">Format</TableHead>
                          <TableHead className="bg-primary text-primary-foreground">Balls</TableHead>
                          <TableHead className="bg-primary text-primary-foreground">BBI</TableHead>
                          <TableHead className="bg-primary text-primary-foreground">Econ</TableHead>
                          <TableHead className="bg-primary text-primary-foreground">5W</TableHead>
                          <TableHead className="bg-primary text-primary-foreground">Runs</TableHead>
                          <TableHead className="bg-primary text-primary-foreground">Wkts</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {STAT_FORMATS.map(format => playerStats.bowling_stats[format] && (
                          <TableRow key={format}>
                            <TableCell className="font-semibold uppercase">{format.toUpperCase().replace('I', '')}</TableCell>
                            <TableCell>{playerStats.bowling_stats[format].balls}</TableCell>
                            <TableCell>{playerStats.bowling_stats[format].best_bowling_innings}</TableCell>
                            <TableCell>{playerStats.bowling_stats[format].economy}</TableCell>
                            <TableCell>{playerStats.bowling_stats[format].five_wickets}</TableCell>
                            <TableCell>{playerStats.bowling_stats[format].runs}</TableCell>
                            <TableCell>{playerStats.bowling_stats[format].wickets}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
