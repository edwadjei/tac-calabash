import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  isActive: boolean;
  publishDate: string;
  expiryDate?: string;
  createdBy?: { id: string; email: string };
  createdAt: string;
  updatedAt: string;
}

interface CreateAnnouncementInput {
  title: string;
  content: string;
  priority?: string;
  publishDate?: string;
  expiryDate?: string;
}

export function useAnnouncements(params?: { isActive?: boolean }) {
  return useQuery<Announcement[]>({
    queryKey: ['announcements', 'list', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/notifications/announcements', { params });
      return data;
    },
  });
}

export function useAnnouncement(id: string) {
  return useQuery<Announcement>({
    queryKey: ['announcements', 'detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/notifications/announcements/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateAnnouncementInput) => {
      const { data } = await apiClient.post('/notifications/announcements', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateAnnouncementInput> & { id: string }) => {
      const { data } = await apiClient.patch(`/notifications/announcements/${id}`, input);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements', 'detail', variables.id] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/notifications/announcements/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}
