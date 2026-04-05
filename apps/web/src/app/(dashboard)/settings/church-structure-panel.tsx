'use client';

import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Building2, GitBranch, Church, Briefcase } from 'lucide-react';
import type { Assembly, Circuit, District, Position } from '@tac/shared';
import {
  useAssemblies,
  useCircuits,
  useCreateAssembly,
  useCreateCircuit,
  useCreateDistrict,
  useCreatePosition,
  useDeleteAssembly,
  useDeleteCircuit,
  useDeleteDistrict,
  useDeletePosition,
  useDistricts,
  usePositions,
  useUpdateAssembly,
  useUpdateCircuit,
  useUpdateDistrict,
  useUpdatePosition,
} from '@/hooks/use-church-structure';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { toast } from 'sonner';
import {
  AssemblyFormDialog,
  CircuitFormDialog,
  DistrictFormDialog,
  PositionFormDialog,
} from './church-structure-form-dialogs';

type DeleteTarget =
  | { type: 'district'; record: District }
  | { type: 'circuit'; record: Circuit }
  | { type: 'assembly'; record: Assembly }
  | { type: 'position'; record: Position }
  | null;

export function ChurchStructurePanel() {
  const { data: districts = [], isLoading } = useDistricts();
  const { data: circuits = [] } = useCircuits();
  const { data: assemblies = [] } = useAssemblies();
  const { data: positions = [] } = usePositions();

  const createDistrict = useCreateDistrict();
  const updateDistrict = useUpdateDistrict();
  const deleteDistrict = useDeleteDistrict();
  const createCircuit = useCreateCircuit();
  const updateCircuit = useUpdateCircuit();
  const deleteCircuit = useDeleteCircuit();
  const createAssembly = useCreateAssembly();
  const updateAssembly = useUpdateAssembly();
  const deleteAssembly = useDeleteAssembly();
  const createPosition = useCreatePosition();
  const updatePosition = useUpdatePosition();
  const deletePosition = useDeletePosition();

  const [districtDialogOpen, setDistrictDialogOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [circuitDialogOpen, setCircuitDialogOpen] = useState(false);
  const [editingCircuit, setEditingCircuit] = useState<Circuit | null>(null);
  const [assemblyDialogOpen, setAssemblyDialogOpen] = useState(false);
  const [editingAssembly, setEditingAssembly] = useState<Assembly | null>(null);
  const [positionDialogOpen, setPositionDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const saveDistrict = async (input: { name: string; headquarterAssemblyId?: string }) => {
    try {
      if (editingDistrict) {
        await updateDistrict.mutateAsync({ id: editingDistrict.id, ...input });
      } else {
        await createDistrict.mutateAsync(input);
      }
      toast.success(`District ${editingDistrict ? 'updated' : 'created'}`);
      setDistrictDialogOpen(false);
      setEditingDistrict(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save district');
    }
  };

  const saveCircuit = async (input: { name: string; districtId: string; headquarterAssemblyId?: string }) => {
    try {
      if (editingCircuit) {
        await updateCircuit.mutateAsync({ id: editingCircuit.id, ...input });
      } else {
        await createCircuit.mutateAsync(input);
      }
      toast.success(`Circuit ${editingCircuit ? 'updated' : 'created'}`);
      setCircuitDialogOpen(false);
      setEditingCircuit(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save circuit');
    }
  };

  const saveAssembly = async (input: { name: string; circuitId: string }) => {
    try {
      if (editingAssembly) {
        await updateAssembly.mutateAsync({ id: editingAssembly.id, ...input });
      } else {
        await createAssembly.mutateAsync(input);
      }
      toast.success(`Assembly ${editingAssembly ? 'updated' : 'created'}`);
      setAssemblyDialogOpen(false);
      setEditingAssembly(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save assembly');
    }
  };

  const savePosition = async (input: { name: string; description?: string }) => {
    try {
      if (editingPosition) {
        await updatePosition.mutateAsync({ id: editingPosition.id, ...input });
      } else {
        await createPosition.mutateAsync(input);
      }
      toast.success(`Position ${editingPosition ? 'updated' : 'created'}`);
      setPositionDialogOpen(false);
      setEditingPosition(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save position');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'district') {
        await deleteDistrict.mutateAsync(deleteTarget.record.id);
      }
      if (deleteTarget.type === 'circuit') {
        await deleteCircuit.mutateAsync(deleteTarget.record.id);
      }
      if (deleteTarget.type === 'assembly') {
        await deleteAssembly.mutateAsync(deleteTarget.record.id);
      }
      if (deleteTarget.type === 'position') {
        await deletePosition.mutateAsync(deleteTarget.record.id);
      }
      toast.success(`${deleteTarget.type} removed`);
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Delete failed');
    }
  };

  const flattenedAssemblies = useMemo(() => assemblies, [assemblies]);

  if (isLoading) {
    return <div className="rounded-2xl border bg-white p-6 text-sm text-muted-foreground">Loading church structure...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => { setEditingDistrict(null); setDistrictDialogOpen(true); }}>
          <Building2 className="mr-2 h-4 w-4" /> Add District
        </Button>
        <Button variant="outline" onClick={() => { setEditingCircuit(null); setCircuitDialogOpen(true); }}>
          <GitBranch className="mr-2 h-4 w-4" /> Add Circuit
        </Button>
        <Button variant="outline" onClick={() => { setEditingAssembly(null); setAssemblyDialogOpen(true); }}>
          <Church className="mr-2 h-4 w-4" /> Add Assembly
        </Button>
        <Button variant="outline" onClick={() => { setEditingPosition(null); setPositionDialogOpen(true); }}>
          <Briefcase className="mr-2 h-4 w-4" /> Add Position
        </Button>
      </div>

      {districts.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No church structure yet"
          description="Create districts, circuits, and assemblies before assigning members."
        />
      ) : (
        <div className="space-y-4">
          {districts.map((district) => (
            <div key={district.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{district.name}</h3>
                    {district.headquarterAssembly?.name && <StatusBadge status="ACTIVE" className="bg-sky-50 text-sky-700" />}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    HQ: {district.headquarterAssembly?.name || 'Not assigned yet'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setEditingDistrict(district); setDistrictDialogOpen(true); }}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteTarget({ type: 'district', record: district })}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {(district.circuits || []).map((circuit) => (
                  <div key={circuit.id} className="rounded-xl border border-border/70 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-medium">{circuit.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          HQ: {circuit.headquarterAssembly?.name || 'Not assigned yet'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingCircuit(circuit); setCircuitDialogOpen(true); }}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget({ type: 'circuit', record: circuit })}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(circuit.assemblies || []).map((assembly) => (
                        <div key={assembly.id} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm shadow-sm">
                          <Church className="h-4 w-4 text-muted-foreground" />
                          {assembly.name}
                          <button type="button" onClick={() => { setEditingAssembly(assembly); setAssemblyDialogOpen(true); }}>
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                          <button type="button" onClick={() => setDeleteTarget({ type: 'assembly', record: assembly })}>
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Positions</h3>
            <p className="text-sm text-muted-foreground">Members can hold multiple positions, with one marked default.</p>
          </div>
          <Button variant="outline" onClick={() => { setEditingPosition(null); setPositionDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Position
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {positions.map((position) => (
            <div key={position.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{position.name}</p>
                  {position.description && <p className="text-sm text-muted-foreground">{position.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingPosition(position); setPositionDialogOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget({ type: 'position', record: position })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DistrictFormDialog
        open={districtDialogOpen}
        onOpenChange={setDistrictDialogOpen}
        district={editingDistrict}
        assemblies={flattenedAssemblies}
        onSubmit={saveDistrict}
      />
      <CircuitFormDialog
        open={circuitDialogOpen}
        onOpenChange={setCircuitDialogOpen}
        circuit={editingCircuit}
        districts={districts}
        assemblies={flattenedAssemblies}
        onSubmit={saveCircuit}
      />
      <AssemblyFormDialog
        open={assemblyDialogOpen}
        onOpenChange={setAssemblyDialogOpen}
        assembly={editingAssembly}
        circuits={circuits}
        onSubmit={saveAssembly}
      />
      <PositionFormDialog
        open={positionDialogOpen}
        onOpenChange={setPositionDialogOpen}
        position={editingPosition}
        onSubmit={savePosition}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete record"
        description={`Delete this ${deleteTarget?.type}?`}
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}
