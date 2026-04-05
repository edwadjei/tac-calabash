'use client';

import { useState } from 'react';
import { HandCoins, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { usePledges } from '@/hooks/use-finances';
import { formatCentsAsCurrency, formatDate, getFullName } from '@tac/shared';
import { FinancesNav } from '../finances-nav';
import { PledgeFormDialog } from './pledge-form-dialog';

export default function PledgesPage() {
  const [pledgeStatusFilter, setPledgeStatusFilter] = useState<string>('all');
  const [showPledgeDialog, setShowPledgeDialog] = useState(false);

  const { data: pledges, isLoading } = usePledges({
    status: pledgeStatusFilter !== 'all' ? pledgeStatusFilter : undefined,
  });

  return (
    <div className="space-y-6">
      <FinancesNav />
      <PageHeader
        title="Pledges"
        description="Track commitment-based giving and current payment progress."
      />

      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <Select value={pledgeStatusFilter} onValueChange={setPledgeStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setShowPledgeDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Pledge
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : !pledges || pledges.length === 0 ? (
        <EmptyState
          icon={HandCoins}
          title="No pledges"
          description="Pledges will appear here once created."
        />
      ) : (
        <div className="space-y-3">
          {pledges.map((pledge: any) => {
            const progress =
              pledge.amount > 0 ? Math.min(100, (pledge.amountPaid / pledge.amount) * 100) : 0;

            return (
              <div key={pledge.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">
                      {pledge.member
                        ? getFullName(pledge.member.firstName, pledge.member.lastName)
                        : 'Unknown'}
                    </h4>
                    <p className="mt-0.5 text-sm text-muted-foreground">{pledge.purpose}</p>
                  </div>
                  <StatusBadge status={pledge.status} />
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatCentsAsCurrency(pledge.amountPaid)} of{' '}
                      {formatCentsAsCurrency(pledge.amount)}
                    </span>
                    <span className="font-medium">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{pledge.frequency?.replace(/_/g, ' ')}</span>
                  <span>Started {formatDate(pledge.startDate)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PledgeFormDialog open={showPledgeDialog} onOpenChange={setShowPledgeDialog} />
    </div>
  );
}
