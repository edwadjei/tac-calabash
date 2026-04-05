import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  VISITOR = 'VISITOR',
  DECEASED = 'DECEASED',
  TRANSFERRED = 'TRANSFERRED',
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
}

export class CreateMemberDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiPropertyOptional({ example: 'Michael' })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiPropertyOptional({ example: 'john.doe@email.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+233 24 123 4567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({ example: '123 Main Street, Accra' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Accra' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg' })
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiPropertyOptional({ example: 'Ghanaian' })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiPropertyOptional({ example: 'Koforidua' })
  @IsString()
  @IsOptional()
  placeOfBirth?: string;

  @ApiPropertyOptional({ example: 'Father Name' })
  @IsString()
  @IsOptional()
  fatherName?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsOptional()
  fatherId?: string;

  @ApiPropertyOptional({ example: 'Mother Name' })
  @IsString()
  @IsOptional()
  motherName?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsOptional()
  motherId?: string;

  @ApiPropertyOptional({ example: 'GA-123-4567' })
  @IsString()
  @IsOptional()
  digitalAddress?: string;

  @ApiPropertyOptional({ example: 'P.O. Box CT 123' })
  @IsString()
  @IsOptional()
  postalAddress?: string;

  @ApiPropertyOptional({ example: 'A12' })
  @IsString()
  @IsOptional()
  hometownHouseNo?: string;

  @ApiPropertyOptional({ example: 'P.O. Box 45' })
  @IsString()
  @IsOptional()
  hometownPostalAddress?: string;

  @ApiPropertyOptional({ example: 'Kumasi, Ashanti' })
  @IsString()
  @IsOptional()
  hometownTownRegion?: string;

  @ApiPropertyOptional({ example: '+233 20 000 0000' })
  @IsString()
  @IsOptional()
  hometownPhone?: string;

  @ApiPropertyOptional({ enum: MaritalStatus, example: MaritalStatus.MARRIED })
  @IsEnum(MaritalStatus)
  @IsOptional()
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional({ example: 'Spouse Name' })
  @IsString()
  @IsOptional()
  spouseName?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsOptional()
  spouseId?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @Min(0)
  @IsOptional()
  numberOfChildren?: number;

  @ApiPropertyOptional({ example: 'Trader' })
  @IsString()
  @IsOptional()
  business?: string;

  @ApiPropertyOptional({ example: 'Next of Kin' })
  @IsString()
  @IsOptional()
  nextOfKinName?: string;

  @ApiPropertyOptional({ example: 'Madina, Accra' })
  @IsString()
  @IsOptional()
  nextOfKinAddress?: string;

  @ApiPropertyOptional({ example: 'Accra, Greater Accra' })
  @IsString()
  @IsOptional()
  nextOfKinCityRegion?: string;

  @ApiPropertyOptional({ example: '+233 24 987 6543' })
  @IsString()
  @IsOptional()
  nextOfKinPhone?: string;

  @ApiPropertyOptional({ example: 'Brother' })
  @IsString()
  @IsOptional()
  nextOfKinRelationship?: string;

  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @ApiPropertyOptional({ example: '+233 24 987 6543' })
  @IsString()
  @IsOptional()
  emergencyPhone?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsOptional()
  familyId?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isHeadOfFamily?: boolean;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsOptional()
  assemblyId?: string;

  @ApiPropertyOptional({ example: '2020-12-25' })
  @IsDateString()
  @IsOptional()
  baptismDate?: string;

  @ApiPropertyOptional({ example: '2019-01-01' })
  @IsDateString()
  @IsOptional()
  membershipDate?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isBaptized?: boolean;

  @ApiPropertyOptional({ enum: MembershipStatus, example: MembershipStatus.ACTIVE })
  @IsEnum(MembershipStatus)
  @IsOptional()
  membershipStatus?: MembershipStatus;

  @ApiPropertyOptional({ example: 'Active in youth ministry' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  ministryIds?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  positionIds?: string[];

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsOptional()
  defaultPositionId?: string;
}

export class RegisterGuestDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiPropertyOptional({ example: '+233 24 123 4567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'john.doe@email.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsOptional()
  assemblyId?: string;

  @ApiPropertyOptional({ example: 'Visiting from Kumasi' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}

export class MemberResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ enum: MembershipStatus, example: MembershipStatus.ACTIVE })
  membershipStatus: MembershipStatus;

  @ApiProperty({ example: false })
  isBaptized: boolean;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: string;
}

export class PaginationMeta {
  @ApiProperty({ example: 150 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 8 })
  totalPages: number;
}

export class PaginatedMembersResponse {
  @ApiProperty({ type: [MemberResponse] })
  data: MemberResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}

export class MemberQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ example: 'john' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: MembershipStatus, example: MembershipStatus.ACTIVE })
  @IsEnum(MembershipStatus)
  @IsOptional()
  status?: MembershipStatus;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsOptional()
  ministryId?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  @IsOptional()
  assemblyId?: string;
}
