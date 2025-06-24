import { NavigationHeader } from '@/components/navigation-header';
import { Footer } from '@/components/footer';
import StadiumClient from './stadium-client';

export const metadata = {
  title: 'Stadium View | CricStats Central',
  description: 'Explore cricket stadiums in 3D.',
};

export default function StadiumPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <NavigationHeader />
      <main className="flex-1">
        <StadiumClient />
      </main>
      <Footer />
    </div>
  );
}
