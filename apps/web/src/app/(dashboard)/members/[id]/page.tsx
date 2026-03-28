'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Phone, Mail, MapPin, Calendar, Church, User } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useMember, useDeleteMember } from '@/hooks/use-members';
import { getInitials, formatDate, getFullName, calculateAge } from '@tac/shared';
import { toast } from 'sonner';
import { useState } from 'react';
import { MemberFormDialog } from '../member-form-dialog';

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: member, isLoading } = useMember(id);
  const deleteMember = useDeleteMember();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMember.mutateAsync(id);
      toast.success('Member deleted successfully');
      router.push('/members');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Member not found.</p>
        <Button variant="link" onClick={() => router.push('/members')}>
          Back to Members
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/members')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-lg">
              {getInitials(member.firstName, member.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">
              {getFullName(member.firstName, member.lastName, member.middleName)}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={member.membershipStatus} />
              {member.dateOfBirth && (
                <span className="text-sm text-muted-foreground">
                  {calculateAge(member.dateOfBirth)} years old
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Contact Information</h3>
          <div className="divide-y">
            <InfoRow icon={Phone} label="Phone" value={member.phone} />
            <InfoRow icon={Mail} label="Email" value={member.email} />
            <InfoRow icon={MapPin} label="Address" value={[member.address, member.city].filter(Boolean).join(', ') || undefined} />
          </div>
          {!member.phone && !member.email && !member.address && (
            <p className="text-sm text-muted-foreground">No contact information available.</p>
          )}
        </div>

        {/* Church Info */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Church Information</h3>
          <div className="divide-y">
            <InfoRow icon={Calendar} label="Membership Date" value={member.membershipDate ? formatDate(member.membershipDate) : undefined} />
            <InfoRow icon={Church} label="Baptized" value={member.isBaptized ? `Yes${member.baptismDate ? ` (${formatDate(member.baptismDate)})` : ''}` : 'No'} />
            <InfoRow icon={User} label="Gender" value={member.gender} />
            <InfoRow icon={Calendar} label="Date of Birth" value={member.dateOfBirth ? formatDate(member.dateOfBirth) : undefined} />
          </div>
        </div>

        {/* Emergency Contact */}
        {(member.emergencyContact || member.emergencyPhone) && (
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Emergency Contact</h3>
            <div className="divide-y">
              <InfoRow icon={User} label="Name" value={member.emergencyContact} />
              <InfoRow icon={Phone} label="Phone" value={member.emergencyPhone} />
            </div>
          </div>
        )}

        {/* Notes */}
        {member.notes && (
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Notes</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{member.notes}</p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <MemberFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        member={member}
      />
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Member"
        description={`Are you sure you want to delete ${member.firstName} ${member.lastName}? This action cannot be undone.`}
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}
