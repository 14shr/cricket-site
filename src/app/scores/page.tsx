import { NavigationHeader } from '@/components/navigation-header';
import { Footer } from '@/components/footer';
import ScoresClient from './scores-client';

export const metadata = {
  title: 'Live Scores | CricStats Central',
  description: 'Live cricket scores from around the world.',
};

export default function ScoresPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <NavigationHeader />
      <main className="flex-1">
        <ScoresClient />
      </main>
      <Footer />
    </div>
  );
}
