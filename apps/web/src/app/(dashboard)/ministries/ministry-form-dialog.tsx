'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMinistrySchema, type CreateMinistryInput } from '@tac/shared';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateMinistry, useUpdateMinistry } from '@/hooks/use-ministries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface MinistryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ministry?: any;
}

export function MinistryFormDialog({ open, onOpenChange, ministry }: MinistryFormDialogProps) {
  const createMinistry = useCreateMinistry();
  const updateMinistry = useUpdateMinistry();
  const isEditing = !!ministry;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMinistryInput>({
    resolver: zodResolver(createMinistrySchema),
    defaultValues: { name: '', description: '', purpose: '' },
  });

  useEffect(() => {
    if (ministry) {
      reset({
        name: ministry.name || '',
        description: ministry.description || '',
        purpose: ministry.purpose || '',
      });
    } else {
      reset({ name: '', description: '', purpose: '' });
    }
  }, [ministry, reset]);

  const onSubmit = async (data: CreateMinistryInput) => {
    try {
      if (isEditing) {
        await updateMinistry.mutateAsync({ id: ministry.id, ...data });
        toast.success('Ministry updated successfully');
      } else {
        await createMinistry.mutateAsync(data);
        toast.success('Ministry created successfully');
      }
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const isPending = createMinistry.isPending || updateMinistry.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Ministry' : 'Create Ministry'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update ministry details.' : 'Add a new ministry to the church.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register('name')} placeholder="Ministry name" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="Brief description..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea id="purpose" {...register('purpose')} placeholder="Mission or purpose statement..." rows={3} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
