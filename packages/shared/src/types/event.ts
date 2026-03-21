export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrence?: string;
  category: EventCategory;
  ministryId?: string;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory =
  | 'SERVICE'
  | 'MEETING'
  | 'FELLOWSHIP'
  | 'OUTREACH'
  | 'CONFERENCE'
  | 'CELEBRATION'
  | 'OTHER';

export interface CreateEventInput {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isAllDay?: boolean;
  isRecurring?: boolean;
  recurrence?: string;
  category: EventCategory;
  ministryId?: string;
}
