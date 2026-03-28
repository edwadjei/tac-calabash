import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { CreateContributionInput, CreatePledgeInput } from '@tac/shared';

interface Contribution {
  id: string;
  memberId: string;
  amount: number;
  type: string;
  category?: string;
  date: string;
  method: string;
  reference?: string;
  notes?: string;
  member?: { id: string; firstName: string; lastName: string };
  createdAt: string;
}

interface Pledge {
  id: string;
  memberId: string;
  amount: number;
  paidAmount: number;
  purpose: string;
  startDate: string;
  endDate?: string;
  frequency: string;
  status: string;
  member?: { id: string; firstName: string; lastName: string };
  createdAt: string;
}

interface ContributionsParams {
  page?: number;
  limit?: number;
  type?: string;
  method?: string;
  memberId?: string;
  startDate?: string;
  endDate?: string;
}

interface PledgesParams {
  status?: string;
  memberId?: string;
}

export function useContributions(params?: ContributionsParams) {
  return useQuery<{ data: Contribution[]; meta: any }>({
    queryKey: ['contributions', 'list', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/finances/contributions', { params });
      return data;
    },
  });
}

export function useContribution(id: string) {
  return useQuery<Contribution>({
    queryKey: ['contributions', 'detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/finances/contributions/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateContributionInput) => {
      const { data } = await apiClient.post('/finances/contributions', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDeleteContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/finances/contributions/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function usePledges(params?: PledgesParams) {
  return useQuery<Pledge[]>({
    queryKey: ['pledges', 'list', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/finances/pledges', { params });
      return data;
    },
  });
}

export function usePledge(id: string) {
  return useQuery<Pledge>({
    queryKey: ['pledges', 'detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/finances/pledges/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreatePledgeInput) => {
      const { data } = await apiClient.post('/finances/pledges', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
    },
  });
}

export function useUpdatePledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreatePledgeInput> & { id: string }) => {
      const { data } = await apiClient.patch(`/finances/pledges/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
    },
  });
}
