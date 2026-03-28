'use client';

import { useState } from 'react';
import { Plus, ClipboardCheck, Users, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAttendanceSessions } from '@/hooks/use-attendance';
import { useEvents } from '@/hooks/use-events';
import { formatDate } from '@tac/shared';
import { RecordAttendanceDialog } from './record-attendance-dialog';

export default function AttendancePage() {
  const { data: sessions, isLoading } = useAttendanceSessions();
  const [showRecordDialog, setShowRecordDialog] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Track and manage church attendance records."
      >
        <Button onClick={() => setShowRecordDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Record Attendance
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !sessions || sessions.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No attendance records"
          description="Start recording attendance for your church services and events."
        >
          <Button onClick={() => setShowRecordDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Record Attendance
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {sessions.map((session: any) => (
            <div key={session.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{session.event?.title || session.type || 'Service'}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(session.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-green-600">{session.totalPresent}</p>
                      <p className="text-xs text-muted-foreground">Present</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-600">{session.totalAbsent}</p>
                      <p className="text-xs text-muted-foreground">Absent</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <RecordAttendanceDialog
        open={showRecordDialog}
        onOpenChange={setShowRecordDialog}
      />
    </div>
  );
}
