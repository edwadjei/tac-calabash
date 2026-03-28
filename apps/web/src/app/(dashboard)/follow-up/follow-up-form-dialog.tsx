'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMembers } from '@/hooks/use-members';
import { useCreateFollowUp, useUpdateFollowUp } from '@/hooks/use-follow-up';
import { getFullName } from '@tac/shared';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface FollowUpFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  followUp?: any;
}

export function FollowUpFormDialog({ open, onOpenChange, followUp }: FollowUpFormDialogProps) {
  const { data: membersData } = useMembers({ limit: 200 });
  const createFollowUp = useCreateFollowUp();
  const updateFollowUp = useUpdateFollowUp();
  const isEditing = !!followUp;

  const [memberId, setMemberId] = useState('');
  const [type, setType] = useState('FIRST_TIMER');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (followUp) {
      setMemberId(followUp.memberId || '');
      setType(followUp.type || 'FIRST_TIMER');
      setReason(followUp.reason || '');
      setNotes(followUp.notes || '');
      setDueDate(followUp.dueDate ? followUp.dueDate.split('T')[0] : '');
    } else {
      setMemberId('');
      setType('FIRST_TIMER');
      setReason('');
      setNotes('');
      setDueDate('');
    }
  }, [followUp]);

  const handleSubmit = async () => {
    if (!memberId) {
      toast.error('Please select a member');
      return;
    }

    try {
      if (isEditing) {
        await updateFollowUp.mutateAsync({
          id: followUp.id,
          memberId,
          type,
          reason: reason || undefined,
          notes: notes || undefined,
          dueDate: dueDate || undefined,
        });
        toast.success('Follow-up updated successfully');
      } else {
        await createFollowUp.mutateAsync({
          memberId,
          type,
          reason: reason || undefined,
          notes: notes || undefined,
          dueDate: dueDate || undefined,
        });
        toast.success('Follow-up created successfully');
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const isPending = createFollowUp.isPending || updateFollowUp.isPending;
  const members = membersData?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Follow-up' : 'New Follow-up'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update follow-up details.' : 'Create a new follow-up task for a member.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Member *</Label>
            <Select value={memberId} onValueChange={setMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m: any) => (
                  <SelectItem key={m.id} value={m.id}>
                    {getFullName(m.firstName, m.lastName)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIRST_TIMER">First Timer</SelectItem>
                  <SelectItem value="ABSENTEE">Absentee</SelectItem>
                  <SelectItem value="HOSPITAL_VISIT">Hospital Visit</SelectItem>
                  <SelectItem value="HOME_VISIT">Home Visit</SelectItem>
                  <SelectItem value="COUNSELING">Counseling</SelectItem>
                  <SelectItem value="PRAYER_REQUEST">Prayer Request</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reason</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Brief reason..." />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." rows={3} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
