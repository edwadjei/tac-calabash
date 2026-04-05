export interface District {
  id: string;
  name: string;
  headquarterAssemblyId?: string;
  headquarterAssembly?: Assembly;
  circuits?: Circuit[];
  createdAt: string;
  updatedAt: string;
}

export interface Circuit {
  id: string;
  name: string;
  districtId: string;
  headquarterAssemblyId?: string;
  district?: District;
  headquarterAssembly?: Assembly;
  assemblies?: Assembly[];
  createdAt: string;
  updatedAt: string;
}

export interface Assembly {
  id: string;
  name: string;
  circuitId: string;
  circuit?: Circuit;
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MemberPosition {
  id: string;
  memberId: string;
  positionId: string;
  isDefault: boolean;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  position?: Position;
}

export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';

export interface CreateDistrictInput {
  name: string;
  headquarterAssemblyId?: string;
}

export interface CreateCircuitInput {
  name: string;
  districtId: string;
  headquarterAssemblyId?: string;
}

export interface CreateAssemblyInput {
  name: string;
  circuitId: string;
}

export interface CreatePositionInput {
  name: string;
  description?: string;
}
