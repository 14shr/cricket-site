import CricStatsClient from './cric-stats-client';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
            CricStats Central
          </h1>
          <p className="mt-4 text-lg text-foreground/80">
            Enter a player's name to get their career statistics, powered by AI.
          </p>
        </header>
        <CricStatsClient />
      </div>
    </main>
  );
}
