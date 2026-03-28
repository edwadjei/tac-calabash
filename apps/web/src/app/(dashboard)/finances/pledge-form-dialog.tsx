'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPledgeSchema, type CreatePledgeInput } from '@tac/shared';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMembers } from '@/hooks/use-members';
import { useCreatePledge } from '@/hooks/use-finances';
import { getFullName } from '@tac/shared';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PledgeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PledgeFormDialog({ open, onOpenChange }: PledgeFormDialogProps) {
  const { data: membersData } = useMembers({ limit: 200 });
  const createPledge = useCreatePledge();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePledgeInput>({
    resolver: zodResolver(createPledgeSchema),
    defaultValues: {
      memberId: '',
      amount: 0,
      purpose: '',
      startDate: new Date().toISOString().split('T')[0],
      frequency: 'MONTHLY',
    },
  });

  const onSubmit = async (data: CreatePledgeInput) => {
    try {
      await createPledge.mutateAsync(data);
      toast.success('Pledge created successfully');
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const members = membersData?.data || [];
  const memberIdValue = watch('memberId');
  const frequencyValue = watch('frequency');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>New Pledge</DialogTitle>
          <DialogDescription>Create a new pledge commitment for a member.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Member *</Label>
            <Select value={memberIdValue} onValueChange={(v) => setValue('memberId', v)}>
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
            {errors.memberId && <p className="text-xs text-destructive">{errors.memberId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (GHS) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Frequency *</Label>
              <Select value={frequencyValue} onValueChange={(v) => setValue('frequency', v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONE_TIME">One Time</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="ANNUALLY">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Input id="purpose" {...register('purpose')} placeholder="e.g., Building Fund, Missions" />
            {errors.purpose && <p className="text-xs text-destructive">{errors.purpose.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input id="startDate" type="date" {...register('startDate')} />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...register('endDate')} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createPledge.isPending}>
              {createPledge.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Pledge
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
