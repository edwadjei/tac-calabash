import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type {
  CreateContributionInput,
  CreatePledgeInput,
  FinAccount,
  FinJournalEntry,
  CreateFinAccountInput,
  UpdateFinAccountInput,
  CreateFinJournalEntryInput,
  UpdateFinJournalEntryInput,
} from '@tac/shared';

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
  amountPaid: number;
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

interface FinAccountsParams {
  accountType?: string;
  isGroup?: boolean;
  isContra?: boolean;
  parentAccountId?: string;
}

export function useFinAccounts(params?: FinAccountsParams) {
  return useQuery<FinAccount[]>({
    queryKey: ['fin-accounts', 'list', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/finances/accounts', { params });
      return data;
    },
  });
}

export function useFinAccount(id: string) {
  return useQuery<FinAccount>({
    queryKey: ['fin-accounts', 'detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/finances/accounts/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateFinAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateFinAccountInput) => {
      const { data } = await apiClient.post('/finances/accounts', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fin-accounts'] });
    },
  });
}

export function useUpdateFinAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateFinAccountInput & { id: string }) => {
      const { data } = await apiClient.patch(`/finances/accounts/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fin-accounts'] });
    },
  });
}

export function useDeleteFinAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/finances/accounts/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fin-accounts'] });
    },
  });
}

interface FinJournalEntriesParams {
  status?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export function useFinJournalEntries(params?: FinJournalEntriesParams) {
  return useQuery<{ data: FinJournalEntry[]; meta: any }>({
    queryKey: ['fin-journal-entries', 'list', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/finances/journal-entries', { params });
      return data;
    },
  });
}

export function useFinJournalEntry(id: string) {
  return useQuery<FinJournalEntry>({
    queryKey: ['fin-journal-entries', 'detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/finances/journal-entries/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateFinJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateFinJournalEntryInput) => {
      const { data } = await apiClient.post('/finances/journal-entries', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fin-journal-entries'] });
    },
  });
}

export function useUpdateFinJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateFinJournalEntryInput & { id: string }) => {
      const { data } = await apiClient.patch(`/finances/journal-entries/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fin-journal-entries'] });
    },
  });
}

export function usePostFinJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(`/finances/journal-entries/${id}/post`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fin-journal-entries'] });
    },
  });
}

export function useDeleteFinJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/finances/journal-entries/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fin-journal-entries'] });
    },
  });
}
