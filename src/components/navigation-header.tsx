import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CricketBallIcon } from '@/components/icons/cricket-ball-icon';

export function NavigationHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <CricketBallIcon className="h-6 w-6 text-primary" />
          <span className="text-lg">CricStats</span>
        </Link>
        <nav className="flex items-center gap-1 rounded-full bg-card p-1 shadow-sm">
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
