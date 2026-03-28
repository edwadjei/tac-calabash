import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

interface AttendanceRecord {
  id: string;
  eventId: string;
  memberId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  checkInTime?: string;
  notes?: string;
  member?: { id: string; firstName: string; lastName: string };
  event?: { id: string; title: string; startDate: string };
  createdAt: string;
}

interface AttendanceSession {
  id: string;
  eventId: string;
  date: string;
  type: string;
  totalPresent: number;
  totalAbsent: number;
  event?: { id: string; title: string };
  records?: AttendanceRecord[];
  createdAt: string;
}

interface AttendanceParams {
  eventId?: string;
  date?: string;
  type?: string;
}

interface RecordAttendanceInput {
  date: string;
  type: string;
  memberIds: string[];
}

export function useAttendanceSessions(params?: AttendanceParams) {
  return useQuery<AttendanceSession[]>({
    queryKey: ['attendance', 'sessions', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/attendance', { params });
      return data;
    },
  });
}

export function useAttendanceSession(id: string) {
  return useQuery<AttendanceSession>({
    queryKey: ['attendance', 'session', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/attendance/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useRecordAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RecordAttendanceInput) => {
      const { data } = await apiClient.post('/attendance/bulk', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useUpdateAttendanceRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { data } = await apiClient.patch(`/attendance/${id}`, { status, notes });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}
