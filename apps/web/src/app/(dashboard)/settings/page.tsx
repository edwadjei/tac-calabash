'use client';

import { useState } from 'react';
import { Plus, Shield, UserPlus, MoreVertical, Edit, Trash2, Key } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUsers, useDeleteUser } from '@/hooks/use-users';
import { formatDate } from '@tac/shared';
import { toast } from 'sonner';
import { UserFormDialog } from './user-form-dialog';

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MINISTRY_LEADER: 'Ministry Leader',
};

export default function SettingsPage() {
  const { data: users, isLoading } = useUsers();
  const deleteUser = useDeleteUser();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any>(null);

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser.mutateAsync(deletingUser.id);
      toast.success('User deleted');
      setDeletingUser(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage users, roles, and system configuration."
      />

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="gap-1.5">
            <Shield className="h-4 w-4" /> Users & Roles
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-1.5">
            <Key className="h-4 w-4" /> General
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowCreateDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : !users || users.length === 0 ? (
            <EmptyState
              icon={Shield}
              title="No users"
              description="Create user accounts to grant access to the dashboard."
            />
          ) : (
            <div className="rounded-xl border bg-white shadow-sm divide-y">
              {users.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {ROLE_LABELS[user.role] || user.role}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          · Joined {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={user.isActive ? 'ACTIVE' : 'INACTIVE'} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeletingUser(user)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Church Information</h3>
            <div className="space-y-4 max-w-md">
              <div className="space-y-1">
                <p className="text-sm font-medium">Church Name</p>
                <p className="text-sm text-muted-foreground">The Apostolic Church - Calabash</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Currency</p>
                <p className="text-sm text-muted-foreground">GHS (Ghana Cedi)</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Timezone</p>
                <p className="text-sm text-muted-foreground">Africa/Accra (GMT+0)</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              Contact the system administrator to update church information.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <UserFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <ConfirmDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        title="Delete User"
        description={`Are you sure you want to delete "${deletingUser?.email}"? They will lose access to the dashboard.`}
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}
