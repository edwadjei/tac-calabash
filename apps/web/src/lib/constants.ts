import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardCheck,
  Calendar,
  DollarSign,
  CheckCircle,
  BarChart3,
  Megaphone,
  Settings,
} from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Members', href: '/members', icon: Users },
  { label: 'Ministries', href: '/ministries', icon: Building2 },
  { label: 'Attendance', href: '/attendance', icon: ClipboardCheck },
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'Finances', href: '/finances', icon: DollarSign },
  { label: 'Follow-ups', href: '/follow-up', icon: CheckCircle },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
] as const;

export const SECONDARY_NAV_ITEMS = [
  { label: 'Announcements', href: '/announcements', icon: Megaphone },
  { label: 'Settings', href: '/settings', icon: Settings, roles: ['SUPER_ADMIN', 'ADMIN'] },
] as const;
