import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { Member, CreateMemberInput, PaginationMeta } from '@tac/shared';

interface MembersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  ministryId?: string;
}

interface PaginatedMembers {
  data: Member[];
  meta: PaginationMeta;
}

export function useMembers(params?: MembersParams) {
  return useQuery<PaginatedMembers>({
    queryKey: ['members', 'list', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/members', { params });
      return data;
    },
  });
}

export function useMember(id: string) {
  return useQuery<Member>({
    queryKey: ['members', 'detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/members/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateMemberInput) => {
      const { data } = await apiClient.post('/members', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateMemberInput> & { id: string }) => {
      const { data } = await apiClient.patch(`/members/${id}`, input);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', 'detail', variables.id] });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/members/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}
