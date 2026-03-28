import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  iconBg?: string;
  iconColor?: string;
}

export function StatCard({ label, value, icon: Icon, trend, trendUp, iconBg = 'bg-blue-50', iconColor = 'text-blue-600' }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconBg)}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {trend && (
        <div className={cn('text-xs mt-1', trendUp ? 'text-green-600' : 'text-muted-foreground')}>
          {trend}
        </div>
      )}
    </div>
  );
}
