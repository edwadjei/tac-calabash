import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { Ministry, CreateMinistryInput } from '@tac/shared';

export function useMinistries() {
  return useQuery<Ministry[]>({
    queryKey: ['ministries', 'list'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ministries');
      return data;
    },
  });
}

export function useMinistry(id: string) {
  return useQuery<Ministry>({
    queryKey: ['ministries', 'detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/ministries/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateMinistry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateMinistryInput) => {
      const { data } = await apiClient.post('/ministries', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
    },
  });
}

export function useUpdateMinistry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateMinistryInput> & { id: string }) => {
      const { data } = await apiClient.patch(`/ministries/${id}`, input);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
      queryClient.invalidateQueries({ queryKey: ['ministries', 'detail', variables.id] });
    },
  });
}

export function useDeleteMinistry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/ministries/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
    },
  });
}

export function useAddMinistryMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ministryId, memberId, role }: { ministryId: string; memberId: string; role?: string }) => {
      const { data } = await apiClient.post(`/ministries/${ministryId}/members`, { memberId, role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
    },
  });
}

export function useRemoveMinistryMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ministryId, memberId }: { ministryId: string; memberId: string }) => {
      const { data } = await apiClient.delete(`/ministries/${ministryId}/members/${memberId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
    },
  });
}
