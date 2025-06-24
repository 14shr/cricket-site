import CricketStatsClient from './cric-stats-client';
import { Footer } from '@/components/footer';
import { NavigationHeader } from '@/components/navigation-header';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <NavigationHeader />
      <CricketStatsClient />
      <Footer />
    </div>
  );
}
