import type { DisambiguatePlayerStatsOutput } from "@/ai/flows/disambiguate-player-stats";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CricketBatIcon } from "./icons/cricket-bat-icon";
import { CricketBallIcon } from "./icons/cricket-ball-icon";

type PlayerStatsTableProps = {
  data: DisambiguatePlayerStatsOutput;
};

const STAT_FORMATS = ['test', 'odi', 't20i'];

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
    <Card className="shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader className="flex flex-row items-center gap-4">
         <Avatar className="h-20 w-20">
            <AvatarImage src={playerStats.image || ''} alt={playerStats.name} data-ai-hint="cricket player" />
            <AvatarFallback>{playerStats.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
            <CardTitle className="font-headline text-3xl">{playerStats.name}</CardTitle>
            <CardDescription className="text-base">{playerStats.country}</CardDescription>
            <Badge variant="secondary">{playerStats.role}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="batting">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="batting" disabled={!hasBattingStats}>Batting</TabsTrigger>
                <TabsTrigger value="bowling" disabled={!hasBowlingStats}>Bowling</TabsTrigger>
            </TabsList>
            {hasBattingStats && (
            <TabsContent value="batting">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><CricketBatIcon className="mr-2 h-5 w-5 text-accent" /> Batting Career Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Format</TableHead>
                                    <TableHead>M</TableHead>
                                    <TableHead>Runs</TableHead>
                                    <TableHead>HS</TableHead>
                                    <TableHead>Avg</TableHead>
                                    <TableHead>SR</TableHead>
                                    <TableHead>100s</TableHead>
                                    <TableHead>50s</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {STAT_FORMATS.map(format => playerStats.batting_stats[format] && (
                                    <TableRow key={format}>
                                        <TableCell className="font-semibold uppercase">{format}</TableCell>
                                        <TableCell>{playerStats.batting_stats[format].matches}</TableCell>
                                        <TableCell>{playerStats.batting_stats[format].runs}</TableCell>
                                        <TableCell>{playerStats.batting_stats[format].highest_score}</TableCell>
                                        <TableCell>{playerStats.batting_stats[format].average}</TableCell>
                                        <TableCell>{playerStats.batting_stats[format].strike_rate}</TableCell>
                                        <TableCell>{playerStats.batting_stats[format].hundreds}</TableCell>
                                        <TableCell>{playerStats.batting_stats[format].fifties}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            )}
            {hasBowlingStats && (
            <TabsContent value="bowling">
                <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center"><CricketBallIcon className="mr-2 h-5 w-5 text-accent"/> Bowling Career Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Format</TableHead>
                                    <TableHead>M</TableHead>
                                    <TableHead>Wkts</TableHead>
                                    <TableHead>BBI</TableHead>
                                    <TableHead>Econ</TableHead>
                                    <TableHead>5W</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {STAT_FORMATS.map(format => playerStats.bowling_stats[format] && (
                                    <TableRow key={format}>
                                        <TableCell className="font-semibold uppercase">{format}</TableCell>
                                        <TableCell>{playerStats.bowling_stats[format].matches}</TableCell>
                                        <TableCell>{playerStats.bowling_stats[format].wickets}</TableCell>
                                        <TableCell>{playerStats.bowling_stats[format].best_bowling_innings}</TableCell>
                                        <TableCell>{playerStats.bowling_stats[format].economy}</TableCell>
                                        <TableCell>{playerStats.bowling_stats[format].five_wickets}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            )}
        </Tabs>
      </CardContent>
      <CardFooter>
          <p className="text-xs text-muted-foreground">{playerStats.summary}</p>
      </CardFooter>
    </Card>
  );
}
