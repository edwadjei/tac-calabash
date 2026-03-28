'use client';

import { useState } from 'react';
import { Plus, Megaphone, MoreVertical, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAnnouncements, useDeleteAnnouncement } from '@/hooks/use-announcements';
import { formatDate } from '@tac/shared';
import { toast } from 'sonner';
import { AnnouncementFormDialog } from './announcement-form-dialog';

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-50 text-gray-600 border-gray-200',
  NORMAL: 'bg-blue-50 text-blue-700 border-blue-200',
  HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
  URGENT: 'bg-red-50 text-red-700 border-red-200',
};

export default function AnnouncementsPage() {
  const { data: announcements, isLoading } = useAnnouncements();
  const deleteAnnouncement = useDeleteAnnouncement();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<any>(null);

  const handleDelete = async () => {
    if (!deletingAnnouncement) return;
    try {
      await deleteAnnouncement.mutateAsync(deletingAnnouncement.id);
      toast.success('Announcement deleted');
      setDeletingAnnouncement(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Create and manage church announcements."
      >
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : !announcements || announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements"
          description="Create your first announcement to share with the church."
        >
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement: any) => (
            <div key={announcement.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                      PRIORITY_COLORS[announcement.priority] || PRIORITY_COLORS.NORMAL
                    }`}>
                      {announcement.priority === 'URGENT' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {announcement.priority}
                    </span>
                    {!announcement.isActive && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-500">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>Published {formatDate(announcement.publishDate || announcement.createdAt)}</span>
                    {announcement.expiryDate && (
                      <span>Expires {formatDate(announcement.expiryDate)}</span>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingAnnouncement(announcement)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => setDeletingAnnouncement(announcement)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnnouncementFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <AnnouncementFormDialog
        open={!!editingAnnouncement}
        onOpenChange={(open) => !open && setEditingAnnouncement(null)}
        announcement={editingAnnouncement}
      />
      <ConfirmDialog
        open={!!deletingAnnouncement}
        onOpenChange={(open) => !open && setDeletingAnnouncement(null)}
        title="Delete Announcement"
        description={`Are you sure you want to delete "${deletingAnnouncement?.title}"?`}
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}
