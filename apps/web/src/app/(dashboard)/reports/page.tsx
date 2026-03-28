'use client';

import { useState } from 'react';
import { BarChart3, Users, Banknote, ClipboardCheck } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AttendanceChart } from '@/components/charts/attendance-chart';
import { FinanceChart } from '@/components/charts/finance-chart';
import { useDashboardStats, useMembershipReport, useAttendanceReport, useFinancialReport } from '@/hooks/use-reports';
import { formatCurrency } from '@tac/shared';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ReportsPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: membershipReport, isLoading: membershipLoading } = useMembershipReport();
  const { data: attendanceReport, isLoading: attendanceLoading } = useAttendanceReport();
  const { data: financialReport, isLoading: financialLoading } = useFinancialReport({ year: new Date().getFullYear() });

  const attendanceData = (attendanceReport?.attendance || []).map((a: any) => ({
    label: a.date,
    count: a._count,
  }));

  const financeData = (financialReport?.byMonth || []).map((m: any) => ({
    label: MONTHS[m.month - 1] || `M${m.month}`,
    amount: m.total,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="View insights and analytics about your church."
      />

      {/* Summary Stats */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
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
            icon={BarChart3}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <StatCard
            label="Upcoming Events"
            value={stats?.upcomingEvents ?? 0}
            icon={ClipboardCheck}
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

      <Tabs defaultValue="membership" className="space-y-4">
        <TabsList>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* Membership Report */}
        <TabsContent value="membership" className="space-y-4">
          {membershipLoading ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold mb-4">By Status</h3>
                {membershipReport?.byStatus && membershipReport.byStatus.length > 0 ? (
                  <div className="space-y-3">
                    {membershipReport.byStatus.map((item: any) => {
                      const total = membershipReport.byStatus.reduce((s: number, i: any) => s + i._count, 0);
                      const pct = total > 0 ? ((item._count / total) * 100).toFixed(0) : 0;
                      return (
                        <div key={item.membershipStatus} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.membershipStatus}</span>
                            <span className="font-medium">{item._count} ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-indigo-600" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No membership data available.</p>
                )}
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold mb-4">By Gender</h3>
                {membershipReport?.byGender && membershipReport.byGender.length > 0 ? (
                  <div className="space-y-3">
                    {membershipReport.byGender.map((item: any) => {
                      const total = membershipReport.byGender.reduce((s: number, i: any) => s + i._count, 0);
                      const pct = total > 0 ? ((item._count / total) * 100).toFixed(0) : 0;
                      return (
                        <div key={item.gender} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.gender || 'Not specified'}</span>
                            <span className="font-medium">{item._count} ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No gender data available.</p>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Attendance Report */}
        <TabsContent value="attendance" className="space-y-4">
          {attendanceLoading ? (
            <Skeleton className="h-80 rounded-xl" />
          ) : (
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold mb-4">Attendance Trends</h3>
              {attendanceData.length > 0 ? (
                <AttendanceChart data={attendanceData} />
              ) : (
                <p className="text-sm text-muted-foreground py-12 text-center">
                  No attendance data available. Start recording attendance to see trends.
                </p>
              )}
            </div>
          )}
        </TabsContent>

        {/* Financial Report */}
        <TabsContent value="financial" className="space-y-4">
          {financialLoading ? (
            <Skeleton className="h-80 rounded-xl" />
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Monthly Income ({new Date().getFullYear()})</h3>
                  <span className="text-sm font-semibold text-green-700">
                    Total: {formatCurrency(financialReport?.total ?? 0)}
                  </span>
                </div>
                {financeData.length > 0 ? (
                  <FinanceChart data={financeData} />
                ) : (
                  <p className="text-sm text-muted-foreground py-12 text-center">
                    No financial data available for this year.
                  </p>
                )}
              </div>

              {financialReport?.byType && financialReport.byType.length > 0 && (
                <div className="rounded-xl border bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold mb-4">By Contribution Type</h3>
                  <div className="space-y-3">
                    {financialReport.byType.map((item: any) => (
                      <div key={item.type} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm">{item.type?.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-semibold">{formatCurrency(item._sum?.amount ?? 0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
