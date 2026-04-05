'use client';

import { useParams } from 'next/navigation';
import { MemberForm } from '../../components/member-form';
import { useMember } from '@/hooks/use-members';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditMemberPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: member, isLoading } = useMember(id);

  if (isLoading) {
    return <Skeleton className="h-[520px] rounded-2xl" />;
  }

  if (!member) {
    return <p className="text-sm text-muted-foreground">Member not found.</p>;
  }

  return <MemberForm member={member} />;
}
