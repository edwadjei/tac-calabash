import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  IsDateString,
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

export class CreateMemberDto {
  @ApiProperty({
    description: 'Member first name',
    example: 'John',
  })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({
    description: 'Member last name',
    example: 'Doe',
  })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiPropertyOptional({
    description: 'Member middle name',
    example: 'Michael',
  })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'john.doe@email.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+233 24 123 4567',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Date of birth (ISO 8601 format)',
    example: '1990-05-15',
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Gender',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'Residential address',
    example: '123 Main Street, Accra',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'City of residence',
    example: 'Accra',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    description: 'Family ID to link member to a family',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  familyId?: string;

  @ApiPropertyOptional({
    description: 'Whether this member is the head of their family',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isHeadOfFamily?: boolean;

  @ApiPropertyOptional({
    description: 'Emergency contact name',
    example: 'Jane Doe',
  })
  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact phone',
    example: '+233 24 987 6543',
  })
  @IsString()
  @IsOptional()
  emergencyPhone?: string;
}

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  @ApiPropertyOptional({
    description: 'Membership status',
    enum: MembershipStatus,
    example: MembershipStatus.ACTIVE,
  })
  @IsEnum(MembershipStatus)
  @IsOptional()
  membershipStatus?: MembershipStatus;

  @ApiPropertyOptional({
    description: 'Date of baptism (ISO 8601 format)',
    example: '2020-12-25',
  })
  @IsDateString()
  @IsOptional()
  baptismDate?: string;

  @ApiPropertyOptional({
    description: 'Whether the member is baptized',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isBaptized?: boolean;

  @ApiPropertyOptional({
    description: 'Date member joined the church (ISO 8601 format)',
    example: '2019-01-01',
  })
  @IsDateString()
  @IsOptional()
  membershipDate?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the member',
    example: 'Active in youth ministry',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class MemberResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiPropertyOptional({ example: 'Michael' })
  middleName?: string;

  @ApiPropertyOptional({ example: 'john.doe@email.com' })
  email?: string;

  @ApiPropertyOptional({ example: '+233 24 123 4567' })
  phone?: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  gender?: Gender;

  @ApiPropertyOptional({ example: '123 Main Street, Accra' })
  address?: string;

  @ApiPropertyOptional({ example: 'Accra' })
  city?: string;

  @ApiProperty({ enum: MembershipStatus, example: MembershipStatus.ACTIVE })
  membershipStatus: MembershipStatus;

  @ApiProperty({ example: false })
  isBaptized: boolean;

  @ApiPropertyOptional({ example: '2020-12-25' })
  baptismDate?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: string;
}

export class PaginationMeta {
  @ApiProperty({ description: 'Total number of records', example: 150 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of records per page', example: 20 })
  limit: number;

  @ApiProperty({ description: 'Total number of pages', example: 8 })
  totalPages: number;
}

export class PaginatedMembersResponse {
  @ApiProperty({ type: [MemberResponse] })
  data: MemberResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}

export class MemberQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of records per page',
    example: 20,
    default: 20,
  })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Search term (searches first name, last name, email)',
    example: 'john',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by membership status',
    enum: MembershipStatus,
    example: MembershipStatus.ACTIVE,
  })
  @IsEnum(MembershipStatus)
  @IsOptional()
  status?: MembershipStatus;

  @ApiPropertyOptional({
    description: 'Filter by ministry ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  ministryId?: string;
}
