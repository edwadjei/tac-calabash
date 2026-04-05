import type { Assembly, MaritalStatus, MemberPosition } from './church-structure';
import type { MinistryMember } from './ministry';

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
  assemblyId?: string;
  nationality?: string;
  placeOfBirth?: string;
  fatherName?: string;
  fatherId?: string;
  motherName?: string;
  motherId?: string;
  digitalAddress?: string;
  postalAddress?: string;
  hometownHouseNo?: string;
  hometownPostalAddress?: string;
  hometownTownRegion?: string;
  hometownPhone?: string;
  maritalStatus?: MaritalStatus;
  spouseName?: string;
  spouseId?: string;
  numberOfChildren?: number;
  business?: string;
  nextOfKinName?: string;
  nextOfKinAddress?: string;
  nextOfKinCityRegion?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  recordedBy?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
  familyId?: string;
  isHeadOfFamily: boolean;
  assembly?: Assembly;
  father?: Member;
  mother?: Member;
  spouse?: Member;
  positions?: MemberPosition[];
  ministryMemberships?: MinistryMember[];
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
  profileImage?: string;
  familyId?: string;
  isHeadOfFamily?: boolean;
  assemblyId?: string;
  nationality?: string;
  placeOfBirth?: string;
  fatherName?: string;
  fatherId?: string;
  motherName?: string;
  motherId?: string;
  digitalAddress?: string;
  postalAddress?: string;
  hometownHouseNo?: string;
  hometownPostalAddress?: string;
  hometownTownRegion?: string;
  hometownPhone?: string;
  maritalStatus?: MaritalStatus;
  spouseName?: string;
  spouseId?: string;
  numberOfChildren?: number;
  business?: string;
  nextOfKinName?: string;
  nextOfKinAddress?: string;
  nextOfKinCityRegion?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
  membershipDate?: string;
  baptismDate?: string;
  isBaptized?: boolean;
  membershipStatus?: MembershipStatus;
  ministryIds?: string[];
  positionIds?: string[];
  defaultPositionId?: string;
}

export interface UpdateMemberInput extends Partial<CreateMemberInput> {
  id?: string;
}

export interface RegisterGuestInput {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  gender?: 'MALE' | 'FEMALE';
  assemblyId?: string;
  notes?: string;
}
