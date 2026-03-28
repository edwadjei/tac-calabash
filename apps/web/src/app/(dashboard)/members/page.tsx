'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Phone, Mail } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { SearchInput } from '@/components/shared/search-input';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMembers } from '@/hooks/use-members';
import { getInitials, formatDate } from '@tac/shared';
import { MemberFormDialog } from './member-form-dialog';

export default function MembersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data, isLoading } = useMembers({
    page,
    limit: 10,
    search: search || undefined,
    status: status !== 'all' ? status : undefined,
  });

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const columns = [
    {
      key: 'name',
      header: 'Member',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs">
              {getInitials(row.firstName, row.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-muted-foreground">{row.gender || '—'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      cell: (row: any) => (
        <div className="space-y-1">
          {row.phone && (
            <div className="flex items-center gap-1.5 text-sm">
              <Phone className="h-3 w-3 text-muted-foreground" />
              {row.phone}
            </div>
          )}
          {row.email && (
            <div className="flex items-center gap-1.5 text-sm">
              <Mail className="h-3 w-3 text-muted-foreground" />
              {row.email}
            </div>
          )}
          {!row.phone && !row.email && <span className="text-sm text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row: any) => <StatusBadge status={row.membershipStatus || 'ACTIVE'} />,
    },
    {
      key: 'joined',
      header: 'Joined',
      cell: (row: any) => (
        <span className="text-sm text-muted-foreground">
          {row.membershipDate ? formatDate(row.membershipDate) : formatDate(row.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        description="Manage your church members and their information."
      >
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-sm">
          <SearchInput
            placeholder="Search members..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="VISITOR">Visitor</SelectItem>
            <SelectItem value="TRANSFERRED">Transferred</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.meta?.totalPages || 1}
        onPageChange={setPage}
        onRowClick={(row) => router.push(`/members/${row.id}`)}
        emptyMessage="No members found. Add your first member to get started."
      />

      {/* Create Dialog */}
      <MemberFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
