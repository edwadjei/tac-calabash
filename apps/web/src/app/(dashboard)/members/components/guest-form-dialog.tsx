'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { registerGuestSchema, type RegisterGuestInput } from '@tac/shared';
import { useRegisterGuest } from '@/hooks/use-members';
import { useAssemblies } from '@/hooks/use-church-structure';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface GuestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (memberId: string) => void;
}

export function GuestFormDialog({ open, onOpenChange, onSuccess }: GuestFormDialogProps) {
  const registerGuest = useRegisterGuest();
  const { data: assemblies = [] } = useAssemblies();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterGuestInput>({
    resolver: zodResolver(registerGuestSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      notes: '',
    },
  });

  const onSubmit = async (data: RegisterGuestInput) => {
    try {
      const member = await registerGuest.mutateAsync(data);
      toast.success('Guest registered successfully');
      reset();
      onOpenChange(false);
      onSuccess?.(member.id);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to register guest');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Register Guest</DialogTitle>
          <DialogDescription>Create a simplified visitor record and convert it later when needed.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guest-last-name">Surname</Label>
              <Input id="guest-last-name" {...register('lastName')} />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest-first-name">First Name</Label>
              <Input id="guest-first-name" {...register('firstName')} />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guest-phone">Phone</Label>
              <Input id="guest-phone" {...register('phone')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest-email">Email</Label>
              <Input id="guest-email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={watch('gender') || ''}
                onValueChange={(value) => setValue('gender', value as 'MALE' | 'FEMALE')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assembly</Label>
              <Select
                value={watch('assemblyId') || ''}
                onValueChange={(value) => setValue('assemblyId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assembly" />
                </SelectTrigger>
                <SelectContent>
                  {assemblies.map((assembly) => (
                    <SelectItem key={assembly.id} value={assembly.id}>
                      {assembly.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-notes">Notes</Label>
            <Textarea id="guest-notes" {...register('notes')} placeholder="Visiting from Kumasi" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={registerGuest.isPending}>
              {registerGuest.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Guest
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
