'use client';

import { useState } from 'react';
import { Plus, BookOpen, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useFinAccounts, useDeleteFinAccount } from '@/hooks/use-finances';
import { FinancesNav } from '../finances-nav';
import { FinAccountFormDialog } from './fin-account-form-dialog';
import { toast } from 'sonner';
import type { FinAccount } from '@tac/shared';

export default function ChartOfAccountsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editAccount, setEditAccount] = useState<FinAccount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FinAccount | null>(null);

  const { data: accounts, isLoading } = useFinAccounts({
    accountType: typeFilter !== 'all' ? typeFilter : undefined,
    isGroup: groupFilter === 'groups' ? true : groupFilter === 'leaf' ? false : undefined,
  });

  const deleteAccount = useDeleteFinAccount();

  const handleEdit = (account: FinAccount) => {
    setEditAccount(account);
    setShowFormDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAccount.mutateAsync(deleteTarget.id);
      toast.success('Account deleted successfully');
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete account');
    }
  };

  const columns = [
    {
      key: 'code',
      header: 'Code',
      cell: (row: FinAccount) => <span className="font-mono font-medium">{row.code}</span>,
    },
    {
      key: 'name',
      header: 'Name',
      cell: (row: FinAccount) => (
        <div>
          <span className="font-medium">{row.name}</span>
          {row.description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'accountType',
      header: 'Type',
      cell: (row: FinAccount) => <StatusBadge status={row.accountType} />,
    },
    {
      key: 'isGroup',
      header: 'Group',
      cell: (row: FinAccount) =>
        row.isGroup ? (
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            Group
          </span>
        ) : null,
    },
    {
      key: 'parent',
      header: 'Parent',
      cell: (row: FinAccount) =>
        row.parentAccount ? (
          <span className="text-sm text-muted-foreground">
            {row.parentAccount.code} - {row.parentAccount.name}
          </span>
        ) : null,
    },
    {
      key: 'actions',
      header: '',
      cell: (row: FinAccount) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
      className: 'w-[80px]',
    },
  ];

  return (
    <div className="space-y-6">
      <FinancesNav />
      <PageHeader
        title="Chart of Accounts"
        description="Manage your financial accounts for double-entry bookkeeping."
      />

      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div className="flex gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ASSET">Asset</SelectItem>
              <SelectItem value="LIABILITY">Liability</SelectItem>
              <SelectItem value="EQUITY">Equity</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="groups">Groups Only</SelectItem>
              <SelectItem value="leaf">Leaf Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => {
            setEditAccount(null);
            setShowFormDialog(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Account
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 rounded-xl" />
          ))}
        </div>
      ) : !accounts || accounts.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No accounts"
          description="Create your first account to start building the chart of accounts."
        />
      ) : (
        <DataTable columns={columns} data={accounts} isLoading={false} emptyMessage="No accounts found." />
      )}

      <FinAccountFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        editAccount={editAccount}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Account"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}
