import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { User } from '@tac/shared';

interface CreateUserInput {
  email: string;
  password: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MINISTRY_LEADER';
}

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users', 'list'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users');
      return data;
    },
  });
}

export function useUser(id: string) {
  return useQuery<User>({
    queryKey: ['users', 'detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const { data } = await apiClient.post('/users', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateUserInput> & { id: string; isActive?: boolean }) => {
      const { data } = await apiClient.patch(`/users/${id}`, input);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'detail', variables.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/users/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
