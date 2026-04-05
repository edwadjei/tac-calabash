export type FinAccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
export type FinJournalEntryStatus = 'DRAFT' | 'POSTED';

export interface FinAccount {
  id: string;
  code: string;
  name: string;
  description?: string;
  accountType: FinAccountType;
  isGroup: boolean;
  isContra: boolean;
  parentAccountId?: string;
  parentAccount?: FinAccount;
  childAccounts?: FinAccount[];
  createdAt: string;
  updatedAt: string;
}

export interface FinJournalEntryLine {
  id: string;
  journalEntryId: string;
  accountId: string;
  debit: number;
  credit: number;
  notes?: string;
  account?: FinAccount;
}

export interface FinJournalEntry {
  id: string;
  status: FinJournalEntryStatus;
  reference?: string;
  transactionDate: string;
  metadata?: Record<string, unknown>;
  postedAt?: string;
  createdAt: string;
  updatedAt: string;
  lines: FinJournalEntryLine[];
}

export interface CreateFinAccountInput {
  name: string;
  description?: string;
  accountType: FinAccountType;
  isGroup?: boolean;
  isContra?: boolean;
  parentAccountId?: string;
}

export interface UpdateFinAccountInput {
  name?: string;
  description?: string;
}

export interface CreateFinJournalEntryLineInput {
  accountId: string;
  debit: number;
  credit: number;
  notes?: string;
}

export interface CreateFinJournalEntryInput {
  reference?: string;
  transactionDate: string;
  metadata?: Record<string, unknown>;
  lines: CreateFinJournalEntryLineInput[];
}

export interface UpdateFinJournalEntryInput {
  reference?: string;
  transactionDate?: string;
  metadata?: Record<string, unknown>;
  lines?: CreateFinJournalEntryLineInput[];
}
