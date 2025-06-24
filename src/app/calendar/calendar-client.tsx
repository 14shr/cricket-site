'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getMatchScheduleAction } from '@/app/actions';
import type { GetMatchScheduleOutput } from '@/ai/flows/get-match-schedule';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MatchScheduleList, MatchScheduleSkeleton } from '@/components/match-schedule-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function CalendarClient() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [schedule, setSchedule] = useState<GetMatchScheduleOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (date) {
        handleDateSelect(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on initial load with today's date

  const handleDateSelect = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    setDate(selectedDate);
    setLoading(true);
    setError(null);
    setSchedule(null);

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const result = await getMatchScheduleAction({ date: formattedDate });

    if (result.error) {
        setError(result.error);
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: result.error,
        });
    } else {
        setSchedule(result.data);
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <Card className="p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="rounded-md"
                />
            </Card>
        </div>
        <div className="md:col-span-2">
             {loading && <MatchScheduleSkeleton />}
             {error && !loading && (
                <Alert variant="destructive" className="mt-8">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {schedule && !loading && date && <MatchScheduleList schedule={schedule} selectedDate={date} />}
        </div>
    </div>
  );
}
