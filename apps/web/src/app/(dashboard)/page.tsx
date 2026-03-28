'use client';

import { Users, Church, CalendarDays, Banknote, ArrowUpRight, Clock, UserPlus, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { AttendanceChart } from '@/components/charts/attendance-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats } from '@/hooks/use-reports';
import { useEvents } from '@/hooks/use-events';
import { useMembers } from '@/hooks/use-members';
import { useFollowUps } from '@/hooks/use-follow-up';
import { formatDate, formatCurrency, getInitials } from '@tac/shared';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <Skeleton className="h-5 w-40 mb-4" />
      <Skeleton className="h-[240px] w-full" />
    </div>
  );
}

function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: membersData, isLoading: membersLoading } = useMembers({ limit: 5 });
  const { data: followUps, isLoading: followUpsLoading } = useFollowUps({ status: 'PENDING' });

  const upcomingEvents = (events || []).slice(0, 5);
  const recentMembers = membersData?.data?.slice(0, 5) || [];
  const pendingFollowUps = (followUps || []).slice(0, 5);

  // Mock attendance data for chart (will be replaced with real data from reports)
  const attendanceData = [
    { label: 'Week 1', count: 0 },
    { label: 'Week 2', count: 0 },
    { label: 'Week 3', count: 0 },
    { label: 'Week 4', count: 0 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's what's happening at TAC Calabash."
      />

      {/* Stat Cards */}
      {statsLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Members"
            value={stats?.totalMembers ?? 0}
            icon={Users}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            trend={`${stats?.activeMembers ?? 0} active`}
          />
          <StatCard
            label="Active Ministries"
            value={stats?.totalMinistries ?? 0}
            icon={Church}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <StatCard
            label="Upcoming Events"
            value={stats?.upcomingEvents ?? 0}
            icon={CalendarDays}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <StatCard
            label="Monthly Contributions"
            value={formatCurrency(stats?.monthlyContributions ?? 0)}
            icon={Banknote}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
        </div>
      )}

      {/* Charts + Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <div className="lg:col-span-2">
          {statsLoading ? (
            <ChartSkeleton />
          ) : (
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold mb-4">Attendance Trends</h3>
              <AttendanceChart data={attendanceData} />
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Upcoming Events</h3>
            <Link href="/events" className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {eventsLoading ? (
            <ListSkeleton rows={4} />
          ) : upcomingEvents.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No upcoming events" />
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event: any) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(event.startDate, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Recent Members</h3>
            <Link href="/members" className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {membersLoading ? (
            <ListSkeleton />
          ) : recentMembers.length === 0 ? (
            <EmptyState icon={UserPlus} title="No members yet" />
          ) : (
            <div className="space-y-3">
              {recentMembers.map((member: any) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs">
                      {getInitials(member.firstName, member.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{member.phone || member.email}</p>
                  </div>
                  <StatusBadge status={member.membershipStatus || 'ACTIVE'} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Follow-ups */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Pending Follow-ups</h3>
            <Link href="/follow-up" className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {followUpsLoading ? (
            <ListSkeleton />
          ) : pendingFollowUps.length === 0 ? (
            <EmptyState icon={Clock} title="No pending follow-ups" />
          ) : (
            <div className="space-y-3">
              {pendingFollowUps.map((fu: any) => (
                <div key={fu.id} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {fu.member ? `${fu.member.firstName} ${fu.member.lastName}` : 'Unknown member'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {fu.type?.replace(/_/g, ' ')} {fu.dueDate ? `· Due ${formatDate(fu.dueDate)}` : ''}
                    </p>
                  </div>
                  <StatusBadge status={fu.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
