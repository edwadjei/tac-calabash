'use client';

import { useState } from 'react';
import { Plus, Clock, CheckCircle, AlertCircle, MoreVertical, Edit, Trash2, Phone } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFollowUps, useCompleteFollowUp, useUpdateFollowUp } from '@/hooks/use-follow-up';
import { formatDate, getFullName } from '@tac/shared';
import { toast } from 'sonner';
import { FollowUpFormDialog } from './follow-up-form-dialog';

export default function FollowUpPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<any>(null);

  const { data: followUps, isLoading } = useFollowUps({
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });
  const completeFollowUp = useCompleteFollowUp();

  const handleComplete = async (id: string) => {
    try {
      await completeFollowUp.mutateAsync({ id });
      toast.success('Follow-up marked as completed');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to complete follow-up');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Follow-ups"
        description="Track pastoral care and member follow-up activities."
      >
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Follow-up
        </Button>
      </PageHeader>

      {/* Filter */}
      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !followUps || followUps.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No follow-ups"
          description="Create follow-up tasks to ensure no member falls through the cracks."
        >
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Follow-up
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {followUps.map((fu: any) => (
            <div key={fu.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    fu.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                    fu.status === 'PENDING' ? 'bg-red-50 text-red-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {fu.status === 'COMPLETED' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {fu.member ? getFullName(fu.member.firstName, fu.member.lastName) : 'Unknown Member'}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {fu.type?.replace(/_/g, ' ')}
                      {fu.reason && ` — ${fu.reason}`}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <StatusBadge status={fu.status} />
                      {fu.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          Due {formatDate(fu.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {fu.status !== 'COMPLETED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleComplete(fu.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Complete
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingFollowUp(fu)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {fu.notes && (
                <p className="text-sm text-muted-foreground mt-2 ml-13 pl-13">{fu.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <FollowUpFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <FollowUpFormDialog
        open={!!editingFollowUp}
        onOpenChange={(open) => !open && setEditingFollowUp(null)}
        followUp={editingFollowUp}
      />
    </div>
  );
}
