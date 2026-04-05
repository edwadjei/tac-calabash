import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700',
  INACTIVE: 'bg-gray-100 text-gray-600',
  VISITOR: 'bg-amber-50 text-amber-700',
  DECEASED: 'bg-gray-100 text-gray-500',
  TRANSFERRED: 'bg-blue-50 text-blue-700',
  PENDING: 'bg-amber-50 text-amber-700',
  IN_PROGRESS: 'bg-blue-50 text-blue-700',
  COMPLETED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  OVERDUE: 'bg-red-50 text-red-700',
  // Accounting
  DRAFT: 'bg-yellow-50 text-yellow-700',
  POSTED: 'bg-green-50 text-green-700',
  ASSET: 'bg-blue-50 text-blue-700',
  LIABILITY: 'bg-red-50 text-red-700',
  EQUITY: 'bg-purple-50 text-purple-700',
  INCOME: 'bg-green-50 text-green-700',
  EXPENSE: 'bg-orange-50 text-orange-700',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', style, className)}>
      {label}
    </span>
  );
}
