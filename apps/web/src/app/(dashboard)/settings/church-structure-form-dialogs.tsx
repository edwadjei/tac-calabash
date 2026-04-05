'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Assembly, Circuit, District, Position } from '@tac/shared';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

function BaseDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">{children}</div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DistrictFormDialog({
  open,
  onOpenChange,
  district,
  assemblies,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  district?: District | null;
  assemblies: Assembly[];
  onSubmit: (input: { name: string; headquarterAssemblyId?: string }) => void;
}) {
  const { register, reset, watch, setValue } = useForm<{ name: string; headquarterAssemblyId?: string }>({
    defaultValues: { name: '', headquarterAssemblyId: undefined },
  });

  useEffect(() => {
    reset({
      name: district?.name || '',
      headquarterAssemblyId: district?.headquarterAssemblyId,
    });
  }, [district, reset]);

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={district ? 'Edit District' : 'Add District'}
      description="Districts group multiple circuits and can point to a headquarters assembly."
      onSubmit={() => onSubmit({ name: watch('name'), headquarterAssemblyId: watch('headquarterAssemblyId') })}
      submitLabel={district ? 'Update District' : 'Create District'}
    >
      <div className="space-y-2">
        <Label>District Name</Label>
        <Input {...register('name')} />
      </div>
      <div className="space-y-2">
        <Label>Headquarters Assembly</Label>
        <Select value={watch('headquarterAssemblyId') || '__none__'} onValueChange={(value) => setValue('headquarterAssemblyId', value === '__none__' ? undefined : value)}>
          <SelectTrigger><SelectValue placeholder="Select headquarters assembly" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">None yet</SelectItem>
            {assemblies.map((assembly) => (
              <SelectItem key={assembly.id} value={assembly.id}>{assembly.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </BaseDialog>
  );
}

export function CircuitFormDialog({
  open,
  onOpenChange,
  circuit,
  districts,
  assemblies,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circuit?: Circuit | null;
  districts: District[];
  assemblies: Assembly[];
  onSubmit: (input: { name: string; districtId: string; headquarterAssemblyId?: string }) => void;
}) {
  const { register, reset, watch, setValue } = useForm<{ name: string; districtId: string; headquarterAssemblyId?: string }>({
    defaultValues: { name: '', districtId: '', headquarterAssemblyId: undefined },
  });

  useEffect(() => {
    reset({
      name: circuit?.name || '',
      districtId: circuit?.districtId || '',
      headquarterAssemblyId: circuit?.headquarterAssemblyId,
    });
  }, [circuit, reset]);

  const filteredAssemblies = assemblies.filter((assembly) => !watch('districtId') || assembly.circuit?.districtId === watch('districtId'));

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={circuit ? 'Edit Circuit' : 'Add Circuit'}
      description="Circuits belong to districts and should also point to a headquarters assembly."
      onSubmit={() => onSubmit({ name: watch('name'), districtId: watch('districtId'), headquarterAssemblyId: watch('headquarterAssemblyId') })}
      submitLabel={circuit ? 'Update Circuit' : 'Create Circuit'}
    >
      <div className="space-y-2">
        <Label>Circuit Name</Label>
        <Input {...register('name')} />
      </div>
      <div className="space-y-2">
        <Label>District</Label>
        <Select value={watch('districtId') || '__none__'} onValueChange={(value) => setValue('districtId', value === '__none__' ? '' : value)}>
          <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Select district</SelectItem>
            {districts.map((district) => (
              <SelectItem key={district.id} value={district.id}>{district.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Headquarters Assembly</Label>
        <Select value={watch('headquarterAssemblyId') || '__none__'} onValueChange={(value) => setValue('headquarterAssemblyId', value === '__none__' ? undefined : value)}>
          <SelectTrigger><SelectValue placeholder="Select headquarters assembly" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">None yet</SelectItem>
            {filteredAssemblies.map((assembly) => (
              <SelectItem key={assembly.id} value={assembly.id}>{assembly.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </BaseDialog>
  );
}

export function AssemblyFormDialog({
  open,
  onOpenChange,
  assembly,
  circuits,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assembly?: Assembly | null;
  circuits: Circuit[];
  onSubmit: (input: { name: string; circuitId: string }) => void;
}) {
  const { register, reset, watch, setValue } = useForm<{ name: string; circuitId: string }>({
    defaultValues: { name: '', circuitId: '' },
  });

  useEffect(() => {
    reset({
      name: assembly?.name || '',
      circuitId: assembly?.circuitId || '',
    });
  }, [assembly, reset]);

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={assembly ? 'Edit Assembly' : 'Add Assembly'}
      description="Assemblies sit at the bottom of the district and circuit hierarchy."
      onSubmit={() => onSubmit({ name: watch('name'), circuitId: watch('circuitId') })}
      submitLabel={assembly ? 'Update Assembly' : 'Create Assembly'}
    >
      <div className="space-y-2">
        <Label>Assembly Name</Label>
        <Input {...register('name')} />
      </div>
      <div className="space-y-2">
        <Label>Circuit</Label>
        <Select value={watch('circuitId') || '__none__'} onValueChange={(value) => setValue('circuitId', value === '__none__' ? '' : value)}>
          <SelectTrigger><SelectValue placeholder="Select circuit" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Select circuit</SelectItem>
            {circuits.map((circuit) => (
              <SelectItem key={circuit.id} value={circuit.id}>{circuit.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </BaseDialog>
  );
}

export function PositionFormDialog({
  open,
  onOpenChange,
  position,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position?: Position | null;
  onSubmit: (input: { name: string; description?: string }) => void;
}) {
  const { register, reset, watch } = useForm<{ name: string; description?: string }>({
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    reset({
      name: position?.name || '',
      description: position?.description || '',
    });
  }, [position, reset]);

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={position ? 'Edit Position' : 'Add Position'}
      description="Positions can be assigned to members and one can be marked as the default."
      onSubmit={() => onSubmit({ name: watch('name'), description: watch('description') })}
      submitLabel={position ? 'Update Position' : 'Create Position'}
    >
      <div className="space-y-2">
        <Label>Position Name</Label>
        <Input {...register('name')} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea rows={4} {...register('description')} />
      </div>
    </BaseDialog>
  );
}
