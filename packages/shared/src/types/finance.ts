export interface Contribution {
  id: string;
  memberId: string;
  amount: number;
  type: ContributionType;
  category?: string;
  date: string;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContributionType =
  | 'TITHE'
  | 'OFFERING'
  | 'SPECIAL_OFFERING'
  | 'DONATION'
  | 'PLEDGE_PAYMENT';

export type PaymentMethod = 'CASH' | 'CHECK' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CARD';

export interface Pledge {
  id: string;
  memberId: string;
  amount: number;
  purpose: string;
  startDate: string;
  endDate?: string;
  frequency: PledgeFrequency;
  amountPaid: number;
  status: PledgeStatus;
  createdAt: string;
  updatedAt: string;
}

export type PledgeFrequency = 'ONE_TIME' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
export type PledgeStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface CreateContributionInput {
  memberId: string;
  amount: number;
  type: ContributionType;
  category?: string;
  date: string;
  method?: PaymentMethod;
  reference?: string;
  notes?: string;
}

export interface CreatePledgeInput {
  memberId: string;
  amount: number;
  purpose: string;
  startDate: string;
  endDate?: string;
  frequency: PledgeFrequency;
}

export interface GivingStatement {
  member: {
    id: string;
    firstName: string;
    lastName: string;
  };
  year: number;
  contributions: Contribution[];
  summary: {
    total: number;
    byType: Record<ContributionType, number>;
  };
}
