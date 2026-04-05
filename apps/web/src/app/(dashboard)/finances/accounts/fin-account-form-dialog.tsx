'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFinAccountSchema, type CreateFinAccountInput } from '@tac/shared';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinAccounts, useCreateFinAccount, useUpdateFinAccount } from '@/hooks/use-finances';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { FinAccount } from '@tac/shared';

interface FinAccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editAccount?: FinAccount | null;
}

export function FinAccountFormDialog({
  open,
  onOpenChange,
  editAccount,
}: FinAccountFormDialogProps) {
  const { data: accounts } = useFinAccounts({ isGroup: true });
  const createAccount = useCreateFinAccount();
  const updateAccount = useUpdateFinAccount();

  const isEditing = !!editAccount;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateFinAccountInput>({
    resolver: zodResolver(createFinAccountSchema),
    defaultValues: {
      name: editAccount?.name ?? '',
      description: editAccount?.description ?? '',
      accountType: editAccount?.accountType ?? 'ASSET',
      isGroup: editAccount?.isGroup ?? false,
      isContra: editAccount?.isContra ?? false,
      parentAccountId: editAccount?.parentAccountId ?? undefined,
    },
  });

  const onSubmit = async (data: CreateFinAccountInput) => {
    try {
      if (isEditing) {
        await updateAccount.mutateAsync({
          id: editAccount.id,
          name: data.name,
          description: data.description,
        });
        toast.success('Account updated successfully');
      } else {
        await createAccount.mutateAsync(data);
        toast.success('Account created successfully');
      }
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const accountTypeValue = watch('accountType');
  const isGroupValue = watch('isGroup');
  const parentAccountIdValue = watch('parentAccountId');
  const isPending = createAccount.isPending || updateAccount.isPending;

  const groupAccounts = accounts?.filter((account) => account.isGroup) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Account' : 'New Account'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the account name and description.'
              : 'Create a new account in the chart of accounts. A code will be auto-generated.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register('name')} placeholder="e.g. Cash, Sales Revenue" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {!isEditing && (
            <>
              <div className="space-y-2">
                <Label>Account Type *</Label>
                <Select value={accountTypeValue} onValueChange={(value) => setValue('accountType', value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASSET">Asset</SelectItem>
                    <SelectItem value="LIABILITY">Liability</SelectItem>
                    <SelectItem value="EQUITY">Equity</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isGroup"
                    {...register('isGroup')}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isGroup" className="text-sm font-normal">
                    Group account
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isContra"
                    {...register('isContra')}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isContra" className="text-sm font-normal">
                    Contra account
                  </Label>
                </div>
              </div>

              {!isGroupValue && groupAccounts.length > 0 && (
                <div className="space-y-2">
                  <Label>Parent Account</Label>
                  <Select
                    value={parentAccountIdValue ?? 'none'}
                    onValueChange={(value) => setValue('parentAccountId', value === 'none' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No parent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No parent</SelectItem>
                      {groupAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Optional description..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
