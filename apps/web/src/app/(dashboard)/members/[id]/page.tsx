'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, MapPin, Phone, Mail, User, Calendar, Briefcase, ArrowUpCircle } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useConvertGuest, useDeleteMember, useMember } from '@/hooks/use-members';
import { formatDate, getFullName, getInitials } from '@tac/shared';
import { toast } from 'sonner';

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-right text-sm">{value}</div>
    </div>
  );
}

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: member, isLoading } = useMember(id);
  const deleteMember = useDeleteMember();
  const convertGuest = useConvertGuest();
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

  const handleConvert = async () => {
    try {
      await convertGuest.mutateAsync(id);
      toast.success('Guest converted to full member');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to convert guest');
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[720px] rounded-2xl" />;
  }

  if (!member) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Member not found.</p>;
  }

  const fullName = getFullName(member.firstName, member.lastName, member.middleName);

  return (
    <div className="space-y-6">
      <PageHeader title="Member Profile" description="Detailed member profile and linked relationships.">
        <Button variant="ghost" onClick={() => router.push('/members')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </PageHeader>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        {member.membershipStatus === 'VISITOR' && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            This person is registered as a guest. Convert them to a full member when the full profile is ready.
          </div>
        )}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-sky-100 text-sky-700">
                {getInitials(member.firstName, member.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{fullName}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={member.membershipStatus} />
                {member.assembly?.name && <span className="text-sm text-muted-foreground">{member.assembly.name}</span>}
                {member.dateOfBirth && (
                  <span className="text-sm text-muted-foreground">
                    Born {formatDate(member.dateOfBirth)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {member.membershipStatus === 'VISITOR' && (
              <Button variant="outline" onClick={handleConvert} disabled={convertGuest.isPending}>
                <ArrowUpCircle className="mr-2 h-4 w-4" />
                Convert to Member
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push(`/members/${member.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              Delete
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <DetailCard title="Personal Info">
          <DetailRow label="Phone" value={member.phone && <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{member.phone}</span>} />
          <DetailRow label="Email" value={member.email && <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{member.email}</span>} />
          <DetailRow label="Gender" value={member.gender} />
          <DetailRow label="Nationality" value={member.nationality} />
          <DetailRow label="Place of Birth" value={member.placeOfBirth} />
        </DetailCard>

        <DetailCard title="Church Information">
          <DetailRow label="Assembly" value={member.assembly?.name} />
          <DetailRow label="Circuit" value={member.assembly?.circuit?.name} />
          <DetailRow label="District" value={member.assembly?.circuit?.district?.name} />
          <DetailRow label="Membership Date" value={member.membershipDate && formatDate(member.membershipDate)} />
          <DetailRow label="Baptism" value={member.isBaptized ? `Yes${member.baptismDate ? ` (${formatDate(member.baptismDate)})` : ''}` : 'No'} />
          <DetailRow label="Positions" value={member.positions?.length ? (
            <div className="flex flex-wrap justify-end gap-2">
              {member.positions.map((position) => (
                <span key={position.id} className="rounded-full bg-slate-100 px-2 py-1 text-xs">
                  {position.position?.name}{position.isDefault ? ' *' : ''}
                </span>
              ))}
            </div>
          ) : undefined} />
          <DetailRow label="Ministries" value={member.ministryMemberships?.length ? (
            <div className="flex flex-wrap justify-end gap-2">
              {member.ministryMemberships.map((membership) => (
                <span key={membership.id} className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                  {membership.ministry?.name}
                </span>
              ))}
            </div>
          ) : undefined} />
        </DetailCard>

        <DetailCard title="Family">
          <DetailRow label="Father" value={member.father ? <Link href={`/members/${member.father.id}`} className="text-sky-700 hover:underline">{member.father.firstName} {member.father.lastName}</Link> : member.fatherName} />
          <DetailRow label="Mother" value={member.mother ? <Link href={`/members/${member.mother.id}`} className="text-sky-700 hover:underline">{member.mother.firstName} {member.mother.lastName}</Link> : member.motherName} />
          <DetailRow label="Marital Status" value={member.maritalStatus} />
          <DetailRow label="Spouse" value={member.spouse ? <Link href={`/members/${member.spouse.id}`} className="text-sky-700 hover:underline">{member.spouse.firstName} {member.spouse.lastName}</Link> : member.spouseName} />
          <DetailRow label="Children" value={member.numberOfChildren?.toString()} />
        </DetailCard>

        <DetailCard title="Address">
          <DetailRow label="Digital Address" value={member.digitalAddress} />
          <DetailRow label="Postal Address" value={member.postalAddress} />
          <DetailRow label="City/Town" value={member.city && <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{member.city}</span>} />
          <DetailRow label="Hometown House No" value={member.hometownHouseNo} />
          <DetailRow label="Hometown Postal Address" value={member.hometownPostalAddress} />
          <DetailRow label="Hometown Town/Region" value={member.hometownTownRegion} />
          <DetailRow label="Hometown Phone" value={member.hometownPhone} />
        </DetailCard>

        <DetailCard title="Next of Kin">
          <DetailRow label="Name" value={member.nextOfKinName} />
          <DetailRow label="Relationship" value={member.nextOfKinRelationship} />
          <DetailRow label="Address" value={member.nextOfKinAddress} />
          <DetailRow label="City/Town/Region" value={member.nextOfKinCityRegion} />
          <DetailRow label="Phone" value={member.nextOfKinPhone} />
        </DetailCard>

        <DetailCard title="Occupation">
          <DetailRow label="Business" value={member.business && <span className="inline-flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground" />{member.business}</span>} />
          <DetailRow label="Recorded By" value={member.recordedBy && <span className="inline-flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" />{member.recordedBy}</span>} />
          <DetailRow label="Created" value={member.createdAt && <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{formatDate(member.createdAt)}</span>} />
          <DetailRow label="Notes" value={member.notes} />
        </DetailCard>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Member"
        description={`Are you sure you want to delete ${fullName}? This action cannot be undone.`}
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}
