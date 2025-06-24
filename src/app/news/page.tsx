import { NavigationHeader } from '@/components/navigation-header';
import { Footer } from '@/components/footer';
import NewsClient from './news-client';
import { Newspaper } from 'lucide-react';

export const metadata = {
  title: 'Cricket News | CricStats Central',
  description: 'Latest cricket news and headlines.',
};

export default function NewsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <NavigationHeader />
      <main className="flex-1">
         <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="flex items-center gap-4 mb-8">
                <Newspaper className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl md:text-5xl">
                    Latest Cricket News
                </h1>
            </div>
            <p className="text-muted-foreground mb-6">Stay informed with the latest stories and updates from the world of cricket, powered by AI.</p>
            <NewsClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
