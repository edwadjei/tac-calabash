'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMembers } from '@/hooks/use-members';
import { useEvents } from '@/hooks/use-events';
import { useRecordAttendance } from '@/hooks/use-attendance';
import { getFullName } from '@tac/shared';
import { toast } from 'sonner';
import { Loader2, Check, X } from 'lucide-react';

interface RecordAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordAttendanceDialog({ open, onOpenChange }: RecordAttendanceDialogProps) {
  const { data: membersData } = useMembers({ limit: 200 });
  const { data: events } = useEvents();
  const recordAttendance = useRecordAttendance();

  const [eventId, setEventId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('SUNDAY_SERVICE');
  const [records, setRecords] = useState<Record<string, string>>({});

  const members = membersData?.data || [];

  const toggleMember = (memberId: string) => {
    setRecords((prev) => {
      const current = prev[memberId];
      if (!current || current === 'ABSENT') {
        return { ...prev, [memberId]: 'PRESENT' };
      }
      return { ...prev, [memberId]: 'ABSENT' };
    });
  };

  const handleSubmit = async () => {
    const presentMemberIds = Object.entries(records)
      .filter(([, status]) => status === 'PRESENT')
      .map(([memberId]) => memberId);

    if (presentMemberIds.length === 0) {
      toast.error('Please mark at least one member as present');
      return;
    }

    try {
      await recordAttendance.mutateAsync({
        date,
        type,
        memberIds: presentMemberIds,
      });
      toast.success('Attendance recorded successfully');
      onOpenChange(false);
      setRecords({});
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to record attendance');
    }
  };

  const presentCount = Object.values(records).filter((s) => s === 'PRESENT').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Attendance</DialogTitle>
          <DialogDescription>
            Mark attendance for members. Click a member to toggle between present and absent.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUNDAY_SERVICE">Sunday Service</SelectItem>
                  <SelectItem value="MIDWEEK_SERVICE">Midweek Service</SelectItem>
                  <SelectItem value="PRAYER_MEETING">Prayer Meeting</SelectItem>
                  <SelectItem value="BIBLE_STUDY">Bible Study</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {events && events.length > 0 && (
            <div className="space-y-2">
              <Label>Linked Event (optional)</Label>
              <Select value={eventId} onValueChange={setEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event: any) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Attendance Summary */}
          <div className="flex items-center gap-4 py-2 px-3 rounded-lg bg-muted text-sm">
            <span>Total: {members.length}</span>
            <span className="text-green-600">Present: {presentCount}</span>
            <span className="text-red-600">
              Absent: {Object.values(records).filter((s) => s === 'ABSENT').length}
            </span>
          </div>

          {/* Member List */}
          <div className="border rounded-lg max-h-[340px] overflow-y-auto divide-y">
            {members.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground text-center">No members found.</p>
            ) : (
              members.map((member: any) => {
                const status = records[member.id];
                const isPresent = status === 'PRESENT';
                return (
                  <button
                    key={member.id}
                    type="button"
                    className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    onClick={() => toggleMember(member.id)}
                  >
                    <span className="text-sm">
                      {getFullName(member.firstName, member.lastName)}
                    </span>
                    {status && (
                      <span className={`flex items-center gap-1 text-xs font-medium ${isPresent ? 'text-green-600' : 'text-red-600'}`}>
                        {isPresent ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        {isPresent ? 'Present' : 'Absent'}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={recordAttendance.isPending}>
            {recordAttendance.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
