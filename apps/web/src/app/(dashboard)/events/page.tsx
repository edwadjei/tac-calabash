'use client';

import { useState } from 'react';
import { Plus, CalendarDays, MapPin, Clock, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useEvents, useDeleteEvent } from '@/hooks/use-events';
import { formatDate } from '@tac/shared';
import { toast } from 'sonner';
import { EventFormDialog } from './event-form-dialog';

const CATEGORY_COLORS: Record<string, string> = {
  SERVICE: 'bg-indigo-50 text-indigo-700',
  MEETING: 'bg-blue-50 text-blue-700',
  FELLOWSHIP: 'bg-emerald-50 text-emerald-700',
  OUTREACH: 'bg-amber-50 text-amber-700',
  CONFERENCE: 'bg-purple-50 text-purple-700',
  CELEBRATION: 'bg-rose-50 text-rose-700',
  OTHER: 'bg-gray-50 text-gray-700',
};

export default function EventsPage() {
  const [category, setCategory] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [deletingEvent, setDeletingEvent] = useState<any>(null);

  const { data: events, isLoading } = useEvents({
    category: category !== 'all' ? category : undefined,
  });
  const deleteEvent = useDeleteEvent();

  const handleDelete = async () => {
    if (!deletingEvent) return;
    try {
      await deleteEvent.mutateAsync(deletingEvent.id);
      toast.success('Event deleted successfully');
      setDeletingEvent(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete event');
    }
  };

  const now = new Date();
  const upcoming = (events || []).filter((e: any) => new Date(e.startDate) >= now);
  const past = (events || []).filter((e: any) => new Date(e.startDate) < now);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Manage church events and activities."
      >
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </PageHeader>

      {/* Filter */}
      <div className="flex gap-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="SERVICE">Service</SelectItem>
            <SelectItem value="MEETING">Meeting</SelectItem>
            <SelectItem value="FELLOWSHIP">Fellowship</SelectItem>
            <SelectItem value="OUTREACH">Outreach</SelectItem>
            <SelectItem value="CONFERENCE">Conference</SelectItem>
            <SelectItem value="CELEBRATION">Celebration</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : !events || events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events yet"
          description="Create your first event to keep the church calendar organized."
        >
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Events */}
          {upcoming.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Upcoming ({upcoming.length})</h3>
              <div className="space-y-3">
                {upcoming.map((event: any) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={() => setEditingEvent(event)}
                    onDelete={() => setDeletingEvent(event)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {past.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Past ({past.length})</h3>
              <div className="space-y-3">
                {past.map((event: any) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={() => setEditingEvent(event)}
                    onDelete={() => setDeletingEvent(event)}
                    isPast
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <EventFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <EventFormDialog
        open={!!editingEvent}
        onOpenChange={(open) => !open && setEditingEvent(null)}
        event={editingEvent}
      />
      <ConfirmDialog
        open={!!deletingEvent}
        onOpenChange={(open) => !open && setDeletingEvent(null)}
        title="Delete Event"
        description={`Are you sure you want to delete "${deletingEvent?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}

function EventCard({ event, onEdit, onDelete, isPast }: { event: any; onEdit: () => void; onDelete: () => void; isPast?: boolean }) {
  const catColor = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.OTHER;
  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          {/* Date Badge */}
          <div className="flex flex-col items-center justify-center rounded-lg bg-indigo-50 px-3 py-2 min-w-[56px]">
            <span className="text-xs text-indigo-600 font-medium">
              {formatDate(event.startDate, { month: 'short' }).split(' ')[0]}
            </span>
            <span className="text-lg font-bold text-indigo-700">
              {new Date(event.startDate).getDate()}
            </span>
          </div>
          <div>
            <h4 className="font-medium">{event.title}</h4>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(event.startDate, { hour: 'numeric', minute: '2-digit' })}
              </span>
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {event.location}
                </span>
              )}
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${catColor}`}>
                {event.category?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
