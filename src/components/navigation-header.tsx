import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CricketBallIcon } from '@/components/icons/cricket-ball-icon';

export function NavigationHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-foreground/20 bg-primary/90 text-primary-foreground backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <CricketBallIcon className="h-6 w-6" />
          <span className="text-lg">CricStats</span>
        </Link>
        <nav className="flex items-center gap-1 rounded-full bg-card/80 p-1 shadow-sm">
          <Button asChild variant="secondary" className="rounded-full h-8 px-4 shadow-none">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-full h-8 px-4" disabled>
            <Link href="#">Scores</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-full h-8 px-4" disabled>
            <Link href="#">News</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
