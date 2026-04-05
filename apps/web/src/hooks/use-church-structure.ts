import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type {
  Assembly,
  Circuit,
  CreateAssemblyInput,
  CreateCircuitInput,
  CreateDistrictInput,
  CreatePositionInput,
  District,
  Position,
} from '@tac/shared';

export function useDistricts() {
  return useQuery<District[]>({
    queryKey: ['church-structure', 'districts'],
    queryFn: async () => {
      const { data } = await apiClient.get('/church-structure/districts');
      return data;
    },
  });
}

export function useCircuits(districtId?: string) {
  return useQuery<Circuit[]>({
    queryKey: ['church-structure', 'circuits', districtId],
    queryFn: async () => {
      const { data } = await apiClient.get('/church-structure/circuits', {
        params: districtId ? { districtId } : undefined,
      });
      return data;
    },
  });
}

export function useAssemblies(circuitId?: string) {
  return useQuery<Assembly[]>({
    queryKey: ['church-structure', 'assemblies', circuitId],
    queryFn: async () => {
      const { data } = await apiClient.get('/church-structure/assemblies', {
        params: circuitId ? { circuitId } : undefined,
      });
      return data;
    },
  });
}

export function usePositions() {
  return useQuery<Position[]>({
    queryKey: ['church-structure', 'positions'],
    queryFn: async () => {
      const { data } = await apiClient.get('/church-structure/positions');
      return data;
    },
  });
}

function useChurchStructureMutation<TInput>(
  queryKey: string[],
  mutationFn: (input: TInput) => Promise<unknown>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['church-structure'] });
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useCreateDistrict() {
  return useChurchStructureMutation<CreateDistrictInput>(
    ['church-structure', 'districts'],
    async (input) => {
      const { data } = await apiClient.post('/church-structure/districts', input);
      return data;
    },
  );
}

export function useUpdateDistrict() {
  return useChurchStructureMutation<Partial<CreateDistrictInput> & { id: string }>(
    ['church-structure', 'districts'],
    async ({ id, ...input }) => {
      const { data } = await apiClient.patch(`/church-structure/districts/${id}`, input);
      return data;
    },
  );
}

export function useDeleteDistrict() {
  return useChurchStructureMutation<string>(
    ['church-structure', 'districts'],
    async (id) => {
      const { data } = await apiClient.delete(`/church-structure/districts/${id}`);
      return data;
    },
  );
}

export function useCreateCircuit() {
  return useChurchStructureMutation<CreateCircuitInput>(
    ['church-structure', 'circuits'],
    async (input) => {
      const { data } = await apiClient.post('/church-structure/circuits', input);
      return data;
    },
  );
}

export function useUpdateCircuit() {
  return useChurchStructureMutation<Partial<CreateCircuitInput> & { id: string }>(
    ['church-structure', 'circuits'],
    async ({ id, ...input }) => {
      const { data } = await apiClient.patch(`/church-structure/circuits/${id}`, input);
      return data;
    },
  );
}

export function useDeleteCircuit() {
  return useChurchStructureMutation<string>(
    ['church-structure', 'circuits'],
    async (id) => {
      const { data } = await apiClient.delete(`/church-structure/circuits/${id}`);
      return data;
    },
  );
}

export function useCreateAssembly() {
  return useChurchStructureMutation<CreateAssemblyInput>(
    ['church-structure', 'assemblies'],
    async (input) => {
      const { data } = await apiClient.post('/church-structure/assemblies', input);
      return data;
    },
  );
}

export function useUpdateAssembly() {
  return useChurchStructureMutation<Partial<CreateAssemblyInput> & { id: string }>(
    ['church-structure', 'assemblies'],
    async ({ id, ...input }) => {
      const { data } = await apiClient.patch(`/church-structure/assemblies/${id}`, input);
      return data;
    },
  );
}

export function useDeleteAssembly() {
  return useChurchStructureMutation<string>(
    ['church-structure', 'assemblies'],
    async (id) => {
      const { data } = await apiClient.delete(`/church-structure/assemblies/${id}`);
      return data;
    },
  );
}

export function useCreatePosition() {
  return useChurchStructureMutation<CreatePositionInput>(
    ['church-structure', 'positions'],
    async (input) => {
      const { data } = await apiClient.post('/church-structure/positions', input);
      return data;
    },
  );
}

export function useUpdatePosition() {
  return useChurchStructureMutation<Partial<CreatePositionInput> & { id: string; isActive?: boolean }>(
    ['church-structure', 'positions'],
    async ({ id, ...input }) => {
      const { data } = await apiClient.patch(`/church-structure/positions/${id}`, input);
      return data;
    },
  );
}

export function useDeletePosition() {
  return useChurchStructureMutation<string>(
    ['church-structure', 'positions'],
    async (id) => {
      const { data } = await apiClient.delete(`/church-structure/positions/${id}`);
      return data;
    },
  );
}
