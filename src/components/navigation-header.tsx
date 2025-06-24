'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CricketBallIcon } from '@/components/icons/cricket-ball-icon';

export function NavigationHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-2 sm:px-4">
        <Link href="/" className="flex flex-shrink-0 items-center gap-2 font-bold">
          <CricketBallIcon className="h-6 w-6" />
          <span className="hidden sm:inline text-lg">CricStats</span>
        </Link>
        <nav className="flex items-center gap-1 rounded-full bg-accent p-1">
          <Button
            asChild
            variant={pathname === '/' ? 'secondary' : 'ghost'}
            className="rounded-full h-8 px-3 text-xs sm:px-4 sm:text-sm shadow-none text-secondary-foreground"
          >
            <Link href="/">Home</Link>
          </Button>
          <Button
            asChild
            variant={pathname === '/scores' ? 'secondary' : 'ghost'}
            className="rounded-full h-8 px-3 text-xs sm:px-4 sm:text-sm text-secondary-foreground"
          >
            <Link href="/scores">Scores</Link>
          </Button>
          <Button
            asChild
            variant={pathname === '/stadium' ? 'secondary' : 'ghost'}
            className="rounded-full h-8 px-3 text-xs sm:px-4 sm:text-sm text-secondary-foreground"
          >
            <Link href="/stadium">Stadium</Link>
          </Button>
          <Button
            asChild
            variant={pathname === '/news' ? 'secondary' : 'ghost'}
            className="rounded-full h-8 px-3 text-xs sm:px-4 sm:text-sm text-secondary-foreground"
          >
            <Link href="/news">News</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
