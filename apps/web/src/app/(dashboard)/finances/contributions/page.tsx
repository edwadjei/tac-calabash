'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContributions } from '@/hooks/use-finances';
import { formatCentsAsCurrency, formatDate, getFullName } from '@tac/shared';
import { FinancesNav } from '../finances-nav';
import { ContributionFormDialog } from './contribution-form-dialog';

export default function ContributionsPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showContributionDialog, setShowContributionDialog] = useState(false);

  const { data: contributionsData, isLoading } = useContributions({
    page,
    limit: 10,
    type: typeFilter !== 'all' ? typeFilter : undefined,
  });

  const columns = [
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
      cell: (row: any) => <StatusBadge status={row.type} />,
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (row: any) => (
        <span className="font-semibold text-green-700">{formatCentsAsCurrency(row.amount)}</span>
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
      <FinancesNav />
      <PageHeader
        title="Contributions"
        description="Manage member contributions and automatically post the related journal entries."
      />

      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <Select
          value={typeFilter}
          onValueChange={(value) => {
            setTypeFilter(value);
            setPage(1);
          }}
        >
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
          <Plus className="mr-2 h-4 w-4" />
          Record Contribution
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={contributionsData?.data || []}
        isLoading={isLoading}
        page={page}
        totalPages={contributionsData?.meta?.totalPages || 1}
        onPageChange={setPage}
        emptyMessage="No contributions recorded yet."
      />

      <ContributionFormDialog
        open={showContributionDialog}
        onOpenChange={setShowContributionDialog}
      />
    </div>
  );
}
