import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const createMemberSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  familyId: z.string().uuid().optional(),
});

export const createMinistrySchema = z.object({
  name: z.string().min(1, 'Ministry name is required'),
  description: z.string().optional(),
  purpose: z.string().optional(),
});

export const createEventSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isAllDay: z.boolean().default(false),
  category: z.enum([
    'SERVICE',
    'MEETING',
    'FELLOWSHIP',
    'OUTREACH',
    'CONFERENCE',
    'CELEBRATION',
    'OTHER',
  ]),
  ministryId: z.string().uuid().optional(),
});

export const createContributionSchema = z.object({
  memberId: z.string().uuid('Invalid member ID'),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['TITHE', 'OFFERING', 'SPECIAL_OFFERING', 'DONATION', 'PLEDGE_PAYMENT']),
  category: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  method: z.enum(['CASH', 'CHECK', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CARD']).default('CASH'),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export const createPledgeSchema = z.object({
  memberId: z.string().uuid('Invalid member ID'),
  amount: z.number().positive('Amount must be positive'),
  purpose: z.string().min(1, 'Purpose is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  frequency: z.enum(['ONE_TIME', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type CreateMinistryInput = z.infer<typeof createMinistrySchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateContributionInput = z.infer<typeof createContributionSchema>;
export type CreatePledgeInput = z.infer<typeof createPledgeSchema>;
