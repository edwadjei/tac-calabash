'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';
import { SheetClose } from '@/components/ui/sheet';

export function MobileSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold">TAC Calabash</div>
          <div className="text-xs text-slate-400">Church Admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive(item.href) ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800',
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            </SheetClose>
          );
        })}

        <Separator className="my-3 bg-white/10" />

        {SECONDARY_NAV_ITEMS.map((item) => {
          if ('roles' in item && item.roles && userRole && !(item.roles as readonly string[]).includes(userRole)) return null;
          const Icon = item.icon;
          return (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive(item.href) ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800',
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            </SheetClose>
          );
        })}
      </nav>
    </div>
  );
}
