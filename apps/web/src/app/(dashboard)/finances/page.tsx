'use client';

import { useState, useCallback } from 'react';
import { Plus, Banknote, TrendingUp, Receipt, HandCoins } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { SearchInput } from '@/components/shared/search-input';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useContributions, usePledges } from '@/hooks/use-finances';
import { formatCurrency, formatDate, getFullName } from '@tac/shared';
import { ContributionFormDialog } from './contribution-form-dialog';
import { PledgeFormDialog } from './pledge-form-dialog';

export default function FinancesPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [pledgeStatusFilter, setPledgeStatusFilter] = useState<string>('all');
  const [showContributionDialog, setShowContributionDialog] = useState(false);
  const [showPledgeDialog, setShowPledgeDialog] = useState(false);

  const { data: contributionsData, isLoading: contribLoading } = useContributions({
    page,
    limit: 10,
    type: typeFilter !== 'all' ? typeFilter : undefined,
  });

  const { data: pledges, isLoading: pledgesLoading } = usePledges({
    status: pledgeStatusFilter !== 'all' ? pledgeStatusFilter : undefined,
  });

  const contributionColumns = [
    {
      key: 'member',
      header: 'Member',
      cell: (row: any) => (
        <span className="font-medium">
          {row.member ? getFullName(row.member.firstName, row.member.lastName) : 'Unknown'}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (row: any) => (
        <StatusBadge status={row.type} />
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (row: any) => (
        <span className="font-semibold text-green-700">{formatCurrency(row.amount)}</span>
      ),
    },
    {
      key: 'method',
      header: 'Method',
      cell: (row: any) => (
        <span className="text-sm text-muted-foreground">{row.method?.replace(/_/g, ' ')}</span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      cell: (row: any) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.date)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finances"
        description="Manage contributions, tithes, offerings, and pledges."
      />

      <Tabs defaultValue="contributions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contributions" className="gap-1.5">
            <Receipt className="h-4 w-4" /> Contributions
          </TabsTrigger>
          <TabsTrigger value="pledges" className="gap-1.5">
            <HandCoins className="h-4 w-4" /> Pledges
          </TabsTrigger>
        </TabsList>

        {/* Contributions Tab */}
        <TabsContent value="contributions" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="TITHE">Tithe</SelectItem>
                <SelectItem value="OFFERING">Offering</SelectItem>
                <SelectItem value="SPECIAL_OFFERING">Special Offering</SelectItem>
                <SelectItem value="DONATION">Donation</SelectItem>
                <SelectItem value="PLEDGE_PAYMENT">Pledge Payment</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowContributionDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Record Contribution
            </Button>
          </div>

          <DataTable
            columns={contributionColumns}
            data={contributionsData?.data || []}
            isLoading={contribLoading}
            page={page}
            totalPages={contributionsData?.meta?.totalPages || 1}
            onPageChange={setPage}
            emptyMessage="No contributions recorded yet."
          />
        </TabsContent>

        {/* Pledges Tab */}
        <TabsContent value="pledges" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
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
              <Plus className="h-4 w-4 mr-2" />
              New Pledge
            </Button>
          </div>

          {pledgesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : !pledges || pledges.length === 0 ? (
            <EmptyState icon={HandCoins} title="No pledges" description="Pledges will appear here once created." />
          ) : (
            <div className="space-y-3">
              {pledges.map((pledge: any) => {
                const progress = pledge.amount > 0 ? Math.min(100, (pledge.paidAmount / pledge.amount) * 100) : 0;
                return (
                  <div key={pledge.id} className="rounded-xl border bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">
                          {pledge.member ? getFullName(pledge.member.firstName, pledge.member.lastName) : 'Unknown'}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-0.5">{pledge.purpose}</p>
                      </div>
                      <StatusBadge status={pledge.status} />
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{formatCurrency(pledge.paidAmount)} of {formatCurrency(pledge.amount)}</span>
                        <span className="font-medium">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{pledge.frequency?.replace(/_/g, ' ')}</span>
                      <span>Started {formatDate(pledge.startDate)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ContributionFormDialog open={showContributionDialog} onOpenChange={setShowContributionDialog} />
      <PledgeFormDialog open={showPledgeDialog} onOpenChange={setShowPledgeDialog} />
    </div>
  );
}
