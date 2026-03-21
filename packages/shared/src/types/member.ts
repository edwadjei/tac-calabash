export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE';
  address?: string;
  city?: string;
  profileImage?: string;
  membershipDate?: string;
  membershipStatus: MembershipStatus;
  baptismDate?: string;
  isBaptized: boolean;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
  familyId?: string;
  isHeadOfFamily: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MembershipStatus = 'ACTIVE' | 'INACTIVE' | 'VISITOR' | 'DECEASED' | 'TRANSFERRED';

export interface Family {
  id: string;
  name: string;
  address?: string;
  members?: Member[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberInput {
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE';
  address?: string;
  city?: string;
  familyId?: string;
}

export interface UpdateMemberInput extends Partial<CreateMemberInput> {
  membershipStatus?: MembershipStatus;
  baptismDate?: string;
  isBaptized?: boolean;
}
