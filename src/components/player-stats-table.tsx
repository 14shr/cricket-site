import type { DisambiguatePlayerStatsOutput } from "@/ai/flows/disambiguate-player-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";

type PlayerStatsTableProps = {
  data: DisambiguatePlayerStatsOutput;
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
    <div className="space-y-8">
      <Card className="shadow-lg bg-card overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 xl:w-1/4 bg-muted">
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage src={playerStats.image || ''} alt={playerStats.name} data-ai-hint="cricket player" className="object-cover aspect-[4/5]" />
              <AvatarFallback className="text-5xl rounded-none aspect-[4/5]">{playerStats.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-bold font-headline text-primary">{playerStats.name}</h1>
              <p className="text-xl text-muted-foreground">{playerStats.country}</p>
              <Badge variant="outline" className="mt-2">{playerStats.role}</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
