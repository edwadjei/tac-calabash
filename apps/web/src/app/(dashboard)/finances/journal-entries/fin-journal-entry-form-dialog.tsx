'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { amountToCents, formatCurrency } from '@tac/shared';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinAccounts, useCreateFinJournalEntry } from '@/hooks/use-finances';
import { toast } from 'sonner';
import { Loader2, Plus, X, CheckCircle2, AlertCircle } from 'lucide-react';

const formLineSchema = z.object({
  accountId: z.string().uuid('Select an account'),
  debit: z.number().min(0, 'Must be >= 0'),
  credit: z.number().min(0, 'Must be >= 0'),
  notes: z.string().optional(),
});

const formSchema = z.object({
  reference: z.string().optional(),
  transactionDate: z.string().min(1, 'Transaction date is required'),
  lines: z.array(formLineSchema).min(2, 'At least 2 lines required'),
});

type FormValues = z.infer<typeof formSchema>;

interface FinJournalEntryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinJournalEntryFormDialog({
  open,
  onOpenChange,
}: FinJournalEntryFormDialogProps) {
  const { data: accounts } = useFinAccounts({ isGroup: false });
  const createEntry = useCreateFinJournalEntry();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reference: '',
      transactionDate: new Date().toISOString().split('T')[0],
      lines: [
        { accountId: '', debit: 0, credit: 0, notes: '' },
        { accountId: '', debit: 0, credit: 0, notes: '' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' });
  const watchedLines = watch('lines');

  const totalDebit = watchedLines?.reduce((sum, line) => sum + (line.debit || 0), 0) ?? 0;
  const totalCredit = watchedLines?.reduce((sum, line) => sum + (line.credit || 0), 0) ?? 0;
  const isBalanced = totalDebit > 0 && totalDebit === totalCredit;

  const onSubmit = async (data: FormValues) => {
    if (!isBalanced) {
      toast.error('Debits and credits must be equal and greater than zero');
      return;
    }

    try {
      await createEntry.mutateAsync({
        reference: data.reference || undefined,
        transactionDate: data.transactionDate,
        lines: data.lines.map((line) => ({
          accountId: line.accountId,
          debit: amountToCents(line.debit),
          credit: amountToCents(line.credit),
          notes: line.notes || undefined,
        })),
      });
      toast.success('Journal entry created successfully');
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const leafAccounts = accounts ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Journal Entry</DialogTitle>
          <DialogDescription>
            Create a double-entry journal entry. Total debits must equal total credits.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input id="reference" {...register('reference')} placeholder="e.g. SALE-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionDate">Date *</Label>
              <Input id="transactionDate" type="date" {...register('transactionDate')} />
              {errors.transactionDate && (
                <p className="text-xs text-destructive">{errors.transactionDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Lines</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ accountId: '', debit: 0, credit: 0, notes: '' })}
              >
                <Plus className="mr-1 h-3 w-3" /> Add Line
              </Button>
            </div>

            {errors.lines?.root && (
              <p className="text-xs text-destructive">{errors.lines.root.message}</p>
            )}

            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_100px_100px_32px] gap-2 px-1 text-xs font-medium text-muted-foreground">
                <span>Account</span>
                <span>Debit (GHS)</span>
                <span>Credit (GHS)</span>
                <span />
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_100px_100px_32px] items-start gap-2">
                  <div>
                    <Select
                      value={watchedLines?.[index]?.accountId || ''}
                      onValueChange={(value) => setValue(`lines.${index}.accountId`, value)}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {leafAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.code} - {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.lines?.[index]?.accountId && (
                      <p className="mt-0.5 text-xs text-destructive">
                        {errors.lines[index].accountId?.message}
                      </p>
                    )}
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    className="h-9 text-sm"
                    {...register(`lines.${index}.debit`, { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    className="h-9 text-sm"
                    {...register(`lines.${index}.credit`, { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => fields.length > 2 && remove(index)}
                    disabled={fields.length <= 2}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[1fr_100px_100px_32px] gap-2 border-t px-1 pt-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                {isBalanced ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
                <span>{isBalanced ? 'Balanced' : 'Unbalanced'}</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(totalDebit)}</span>
              <span className="text-sm font-semibold">{formatCurrency(totalCredit)}</span>
              <span />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createEntry.isPending || !isBalanced}>
              {createEntry.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Entry
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
