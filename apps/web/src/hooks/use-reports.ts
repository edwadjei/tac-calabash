import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalMinistries: number;
  upcomingEvents: number;
  monthlyContributions: number;
}

interface MembershipReport {
  byStatus: { membershipStatus: string; _count: number }[];
  byGender: { gender: string; _count: number }[];
  newMembers: any[];
}

interface AttendanceReport {
  attendance: { date: string; type: string; _count: number }[];
  startDate: string;
  endDate: string;
}

interface FinancialReport {
  year: number;
  byType: { type: string; _sum: { amount: number } }[];
  byMonth: { month: number; total: number }[];
  total: number;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['reports', 'dashboard'],
    queryFn: async () => {
      const { data } = await apiClient.get('/reports/dashboard');
      return data;
    },
  });
}

export function useMembershipReport(params?: { startDate?: string; endDate?: string }) {
  return useQuery<MembershipReport>({
    queryKey: ['reports', 'membership', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/reports/membership', { params });
      return data;
    },
  });
}

export function useAttendanceReport(params?: { startDate?: string; endDate?: string }) {
  return useQuery<AttendanceReport>({
    queryKey: ['reports', 'attendance', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/reports/attendance', { params });
      return data;
    },
  });
}

export function useFinancialReport(params?: { year?: number }) {
  return useQuery<FinancialReport>({
    queryKey: ['reports', 'financial', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/reports/financial', { params });
      return data;
    },
  });
}
