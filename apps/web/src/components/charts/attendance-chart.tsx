'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AttendanceChartProps {
  data: { label: string; count: number }[];
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#94a3b8' }} />
        <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#94a3b8' }} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
          cursor={{ fill: '#f8fafc' }}
        />
        <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Attendance" />
      </BarChart>
    </ResponsiveContainer>
  );
}
