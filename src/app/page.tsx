import CricketStatsClient from './cric-stats-client';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <CricketStatsClient />
      <Footer />
    </div>
  );
}
