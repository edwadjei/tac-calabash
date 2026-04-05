'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const FINANCES_TABS = [
  { label: 'Contributions', href: '/finances/contributions' },
  { label: 'Pledges', href: '/finances/pledges' },
  { label: 'Chart of Accounts', href: '/finances/accounts' },
  { label: 'Journal Entries', href: '/finances/journal-entries' },
];

export function FinancesNav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex gap-1 border-b">
      {FINANCES_TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            'border-b-2 px-4 py-2 text-sm font-medium transition-colors -mb-px',
            pathname.startsWith(tab.href)
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground',
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
