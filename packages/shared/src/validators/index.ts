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
  profileImage: z.string().optional(),
  familyId: z.string().uuid().optional(),
  isHeadOfFamily: z.boolean().optional(),
  assemblyId: z.string().uuid().optional(),
  nationality: z.string().optional(),
  placeOfBirth: z.string().optional(),
  fatherName: z.string().optional(),
  fatherId: z.string().uuid().optional(),
  motherName: z.string().optional(),
  motherId: z.string().uuid().optional(),
  digitalAddress: z.string().optional(),
  postalAddress: z.string().optional(),
  hometownHouseNo: z.string().optional(),
  hometownPostalAddress: z.string().optional(),
  hometownTownRegion: z.string().optional(),
  hometownPhone: z.string().optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).optional(),
  spouseName: z.string().optional(),
  spouseId: z.string().uuid().optional(),
  numberOfChildren: z.number().int().min(0).optional(),
  business: z.string().optional(),
  nextOfKinName: z.string().optional(),
  nextOfKinAddress: z.string().optional(),
  nextOfKinCityRegion: z.string().optional(),
  nextOfKinPhone: z.string().optional(),
  nextOfKinRelationship: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  notes: z.string().optional(),
  baptismDate: z.string().optional(),
  membershipDate: z.string().optional(),
  isBaptized: z.boolean().optional(),
  membershipStatus: z.enum(['ACTIVE', 'INACTIVE', 'VISITOR', 'DECEASED', 'TRANSFERRED']).optional(),
  ministryIds: z.array(z.string().uuid()).optional(),
  positionIds: z.array(z.string().uuid()).optional(),
  defaultPositionId: z.string().uuid().optional(),
});

export const registerGuestSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  assemblyId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export const createDistrictSchema = z.object({
  name: z.string().min(1, 'District name is required'),
  headquarterAssemblyId: z.string().uuid().optional(),
});

export const createCircuitSchema = z.object({
  name: z.string().min(1, 'Circuit name is required'),
  districtId: z.string().uuid('District is required'),
  headquarterAssemblyId: z.string().uuid().optional(),
});

export const createAssemblySchema = z.object({
  name: z.string().min(1, 'Assembly name is required'),
  circuitId: z.string().uuid('Circuit is required'),
});

export const createPositionSchema = z.object({
  name: z.string().min(1, 'Position name is required'),
  description: z.string().optional(),
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

// ============================================
// ACCOUNTING SCHEMAS
// ============================================

export const createFinAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  description: z.string().optional(),
  accountType: z.enum(['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE']),
  isGroup: z.boolean().default(false),
  isContra: z.boolean().default(false),
  parentAccountId: z.string().uuid().optional(),
});

export const createFinJournalEntryLineSchema = z.object({
  accountId: z.string().uuid('Invalid account ID'),
  debit: z.number().int().min(0, 'Debit must be >= 0'),
  credit: z.number().int().min(0, 'Credit must be >= 0'),
  notes: z.string().optional(),
});

export const createFinJournalEntrySchema = z.object({
  reference: z.string().optional(),
  transactionDate: z.string().min(1, 'Transaction date is required'),
  metadata: z.record(z.unknown()).optional(),
  lines: z.array(createFinJournalEntryLineSchema).min(2, 'At least 2 lines required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type RegisterGuestInput = z.infer<typeof registerGuestSchema>;
export type CreateDistrictInput = z.infer<typeof createDistrictSchema>;
export type CreateCircuitInput = z.infer<typeof createCircuitSchema>;
export type CreateAssemblyInput = z.infer<typeof createAssemblySchema>;
export type CreatePositionInput = z.infer<typeof createPositionSchema>;
export type CreateMinistryInput = z.infer<typeof createMinistrySchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateContributionInput = z.infer<typeof createContributionSchema>;
export type CreatePledgeInput = z.infer<typeof createPledgeSchema>;
export type CreateFinAccountInput = z.infer<typeof createFinAccountSchema>;
export type CreateFinJournalEntryLineInput = z.infer<typeof createFinJournalEntryLineSchema>;
export type CreateFinJournalEntryInput = z.infer<typeof createFinJournalEntrySchema>;
