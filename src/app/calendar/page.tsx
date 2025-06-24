import { NavigationHeader } from '@/components/navigation-header';
import { Footer } from '@/components/footer';
import CalendarClient from './calendar-client';
import { CalendarDays } from 'lucide-react';

export const metadata = {
  title: 'Match Calendar | CricStats Central',
  description: 'View upcoming cricket match schedules.',
};

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <NavigationHeader />
      <main className="flex-1">
         <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="flex items-center gap-4 mb-8">
                <CalendarDays className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl md:text-5xl">
                Match Calendar
                </h1>
            </div>
            <p className="text-muted-foreground mb-6">Select a date to view the schedule of cricket matches from around the world.</p>
            <CalendarClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
