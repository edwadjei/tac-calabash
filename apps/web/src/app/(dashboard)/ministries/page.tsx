'use client';

import { useState } from 'react';
import { Plus, Users, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMinistries, useDeleteMinistry } from '@/hooks/use-ministries';
import { toast } from 'sonner';
import { MinistryFormDialog } from './ministry-form-dialog';

export default function MinistriesPage() {
  const { data: ministries, isLoading } = useMinistries();
  const deleteMinistry = useDeleteMinistry();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState<any>(null);
  const [deletingMinistry, setDeletingMinistry] = useState<any>(null);

  const handleDelete = async () => {
    if (!deletingMinistry) return;
    try {
      await deleteMinistry.mutateAsync(deletingMinistry.id);
      toast.success('Ministry deleted successfully');
      setDeletingMinistry(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete ministry');
    }
  };

  const COLORS = [
    'bg-indigo-50 text-indigo-600 border-indigo-100',
    'bg-emerald-50 text-emerald-600 border-emerald-100',
    'bg-amber-50 text-amber-600 border-amber-100',
    'bg-blue-50 text-blue-600 border-blue-100',
    'bg-purple-50 text-purple-600 border-purple-100',
    'bg-rose-50 text-rose-600 border-rose-100',
    'bg-cyan-50 text-cyan-600 border-cyan-100',
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ministries"
        description="Manage church ministries and their members."
      >
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Ministry
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : !ministries || ministries.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No ministries yet"
          description="Create your first ministry to start organizing church groups."
        >
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Ministry
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ministries.map((ministry: any, index: number) => {
            const colorClass = COLORS[index % COLORS.length];
            return (
              <div key={ministry.id} className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass.split(' ').slice(0, 2).join(' ')}`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingMinistry(ministry)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeletingMinistry(ministry)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="font-semibold mt-3">{ministry.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {ministry.description || ministry.purpose || 'No description'}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ministry.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                    {ministry.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MinistryFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      <MinistryFormDialog
        open={!!editingMinistry}
        onOpenChange={(open) => !open && setEditingMinistry(null)}
        ministry={editingMinistry}
      />
      <ConfirmDialog
        open={!!deletingMinistry}
        onOpenChange={(open) => !open && setDeletingMinistry(null)}
        title="Delete Ministry"
        description={`Are you sure you want to delete "${deletingMinistry?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}
