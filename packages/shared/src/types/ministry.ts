export interface Ministry {
  id: string;
  name: string;
  description?: string;
  purpose?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MinistryMember {
  id: string;
  memberId: string;
  ministryId: string;
  role: MinistryRole;
  joinedAt: string;
  leftAt?: string;
  isActive: boolean;
}

export type MinistryRole = 'LEADER' | 'ASSISTANT_LEADER' | 'SECRETARY' | 'TREASURER' | 'MEMBER';

export interface CreateMinistryInput {
  name: string;
  description?: string;
  purpose?: string;
}

export interface AddMinistryMemberInput {
  memberId: string;
  role?: MinistryRole;
}
