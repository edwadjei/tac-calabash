import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { Event, CreateEventInput } from '@tac/shared';

interface EventsParams {
  start?: string;
  end?: string;
  ministryId?: string;
  category?: string;
}

export function useEvents(params?: EventsParams) {
  return useQuery<Event[]>({
    queryKey: ['events', 'list', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/events', { params });
      return data;
    },
  });
}

export function useEvent(id: string) {
  return useQuery<Event>({
    queryKey: ['events', 'detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/events/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateEventInput) => {
      const { data } = await apiClient.post('/events', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateEventInput> & { id: string }) => {
      const { data } = await apiClient.patch(`/events/${id}`, input);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', 'detail', variables.id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/events/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
