import type { GetMatchScheduleOutput } from "@/ai/flows/get-match-schedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Clock, MapPin, Trophy } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type MatchScheduleListProps = {
    schedule: GetMatchScheduleOutput;
    selectedDate: Date;
};

export function MatchScheduleList({ schedule, selectedDate }: MatchScheduleListProps) {
    if (!schedule.matches || schedule.matches.length === 0) {
        return (
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>No Matches Found</CardTitle>
                    <CardDescription>
                        {schedule.summary || `There are no matches scheduled for ${selectedDate.toLocaleDateString()}.`}
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="mt-8 space-y-4">
            {schedule.matches.map((match, index) => (
                <Card key={index} className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">{match.team1} vs {match.team2}</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-1">
                            <Trophy className="h-4 w-4" /> <span>{match.competition}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                       <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{match.time}</span>
                       </div>
                       <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{match.venue}</span>
                       </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}


export function MatchScheduleSkeleton() {
    return (
        <div className="mt-8 space-y-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="shadow-md">
                    <CardHeader>
                         <Skeleton className="h-6 w-3/4" />
                         <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <Skeleton className="h-5 w-32" />
                         <Skeleton className="h-5 w-48" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
