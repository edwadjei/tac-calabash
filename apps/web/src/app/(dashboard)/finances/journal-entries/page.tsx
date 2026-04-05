'use client';

import { useState } from 'react';
import { Plus, CheckCircle, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinJournalEntries, usePostFinJournalEntry, useDeleteFinJournalEntry } from '@/hooks/use-finances';
import { formatCentsAsCurrency, formatDate } from '@tac/shared';
import { FinancesNav } from '../finances-nav';
import { FinJournalEntryFormDialog } from './fin-journal-entry-form-dialog';
import { toast } from 'sonner';
import type { FinJournalEntry } from '@tac/shared';

export default function JournalEntriesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [postTarget, setPostTarget] = useState<FinJournalEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FinJournalEntry | null>(null);

  const { data: entriesData, isLoading } = useFinJournalEntries({
    page,
    limit: 10,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const postEntry = usePostFinJournalEntry();
  const deleteEntry = useDeleteFinJournalEntry();

  const handlePost = async () => {
    if (!postTarget) return;
    try {
      await postEntry.mutateAsync(postTarget.id);
      toast.success('Journal entry posted successfully');
      setPostTarget(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to post entry');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEntry.mutateAsync(deleteTarget.id);
      toast.success('Journal entry deleted');
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete entry');
    }
  };

  const columns = [
    {
      key: 'reference',
      header: 'Reference',
      cell: (row: FinJournalEntry) => <span className="font-medium">{row.reference || '-'}</span>,
    },
    {
      key: 'transactionDate',
      header: 'Date',
      cell: (row: FinJournalEntry) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.transactionDate)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row: FinJournalEntry) => <StatusBadge status={row.status} />,
    },
    {
      key: 'lines',
      header: 'Lines',
      cell: (row: FinJournalEntry) => (
        <span className="text-sm text-muted-foreground">{row.lines?.length ?? 0} lines</span>
      ),
    },
    {
      key: 'total',
      header: 'Total Debit',
      cell: (row: FinJournalEntry) => {
        const totalDebit = row.lines?.reduce((sum, line) => sum + line.debit, 0) ?? 0;
        return <span className="font-semibold text-green-700">{formatCentsAsCurrency(totalDebit)}</span>;
      },
    },
    {
      key: 'actions',
      header: '',
      cell: (row: FinJournalEntry) => (
        <div className="flex items-center justify-end gap-1">
          {row.status === 'DRAFT' && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setPostTarget(row)}>
                <CheckCircle className="mr-1 h-4 w-4 text-green-600" /> Post
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      ),
      className: 'w-[140px]',
    },
  ];

  return (
    <div className="space-y-6">
      <FinancesNav />
      <PageHeader
        title="Journal Entries"
        description="Record and manage double-entry journal entries."
      />

      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="POSTED">Posted</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setShowFormDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={entriesData?.data || []}
        isLoading={isLoading}
        page={page}
        totalPages={entriesData?.meta?.totalPages || 1}
        onPageChange={setPage}
        emptyMessage="No journal entries yet."
      />

      <FinJournalEntryFormDialog open={showFormDialog} onOpenChange={setShowFormDialog} />

      <ConfirmDialog
        open={!!postTarget}
        onOpenChange={(open) => !open && setPostTarget(null)}
        title="Post Journal Entry"
        description={`Post entry "${postTarget?.reference || 'Untitled'}"? This is irreversible; posted entries cannot be modified or deleted.`}
        confirmLabel="Post Entry"
        onConfirm={handlePost}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Journal Entry"
        description={`Delete draft entry "${deleteTarget?.reference || 'Untitled'}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}
