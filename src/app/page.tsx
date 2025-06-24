import CricketStatsClient from './cric-stats-client';
import { NavigationHeader } from '@/components/navigation-header';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <NavigationHeader />
      <main className="flex flex-1 flex-col items-center p-4 pt-8 sm:p-8 sm:pt-12 md:p-12 md:pt-16">
        <div className="w-full max-w-4xl space-y-8">
          <header className="text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
              CricStats Finder
            </h1>
            <p className="mt-4 text-lg text-foreground/80">
              Enter a player's name to get their career statistics, powered by AI.
            </p>
          </header>
          <CricketStatsClient />
        </div>
      </main>
    </div>
  );
}
