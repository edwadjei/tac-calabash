'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContributionSchema, type CreateContributionInput, amountToCents } from '@tac/shared';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMembers } from '@/hooks/use-members';
import { useCreateContribution } from '@/hooks/use-finances';
import { getFullName } from '@tac/shared';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ContributionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContributionFormDialog({ open, onOpenChange }: ContributionFormDialogProps) {
  const { data: membersData } = useMembers({ limit: 200 });
  const createContribution = useCreateContribution();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateContributionInput>({
    resolver: zodResolver(createContributionSchema),
    defaultValues: {
      memberId: '',
      amount: 0,
      type: 'TITHE',
      date: new Date().toISOString().split('T')[0],
      method: 'CASH',
      reference: '',
      notes: '',
    },
  });

  const onSubmit = async (data: CreateContributionInput) => {
    try {
      await createContribution.mutateAsync({ ...data, amount: amountToCents(data.amount) });
      toast.success('Contribution recorded successfully');
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const members = membersData?.data || [];
  const typeValue = watch('type');
  const methodValue = watch('method');
  const memberIdValue = watch('memberId');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Contribution</DialogTitle>
          <DialogDescription>Record a tithe, offering, or other contribution.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Member *</Label>
            <Select value={memberIdValue} onValueChange={(value) => setValue('memberId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member: any) => (
                  <SelectItem key={member.id} value={member.id}>
                    {getFullName(member.firstName, member.lastName)}
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
              <Label>Type *</Label>
              <Select value={typeValue} onValueChange={(value) => setValue('type', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TITHE">Tithe</SelectItem>
                  <SelectItem value="OFFERING">Offering</SelectItem>
                  <SelectItem value="SPECIAL_OFFERING">Special Offering</SelectItem>
                  <SelectItem value="DONATION">Donation</SelectItem>
                  <SelectItem value="PLEDGE_PAYMENT">Pledge Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={methodValue} onValueChange={(value) => setValue('method', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CHECK">Check</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference</Label>
            <Input id="reference" {...register('reference')} placeholder="Transaction reference..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} placeholder="Additional notes..." rows={2} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createContribution.isPending}>
              {createContribution.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
