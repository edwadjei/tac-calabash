import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

interface FollowUp {
  id: string;
  memberId: string;
  type: string;
  reason?: string;
  assignedTo?: string;
  status: string;
  notes?: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  member?: { firstName: string; lastName: string };
}

interface FollowUpParams {
  status?: string;
  type?: string;
  assignedTo?: string;
}

interface CreateFollowUpInput {
  memberId: string;
  type: string;
  reason?: string;
  assignedTo?: string;
  dueDate?: string;
  notes?: string;
}

export function useFollowUps(params?: FollowUpParams) {
  return useQuery<FollowUp[]>({
    queryKey: ['follow-ups', 'list', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/follow-up', { params });
      return data;
    },
  });
}

export function useFollowUp(id: string) {
  return useQuery<FollowUp>({
    queryKey: ['follow-ups', 'detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/follow-up/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateFollowUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateFollowUpInput) => {
      const { data } = await apiClient.post('/follow-up', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] });
    },
  });
}

export function useUpdateFollowUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateFollowUpInput> & { id: string; status?: string }) => {
      const { data } = await apiClient.patch(`/follow-up/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] });
    },
  });
}

export function useCompleteFollowUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const { data } = await apiClient.patch(`/follow-up/${id}/complete`, { notes });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] });
    },
  });
}
