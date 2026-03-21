import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID, MinLength } from 'class-validator';

export enum MinistryRole {
  LEADER = 'LEADER',
  ASSISTANT_LEADER = 'ASSISTANT_LEADER',
  SECRETARY = 'SECRETARY',
  TREASURER = 'TREASURER',
  MEMBER = 'MEMBER',
}

export class CreateMinistryDto {
  @ApiProperty({
    description: 'Ministry name',
    example: 'Youth Ministry',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({
    description: 'Brief description of the ministry',
    example: 'Ministry focused on spiritual growth and development of young people aged 13-30',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Purpose statement of the ministry',
    example: 'To equip and empower the next generation of leaders',
  })
  @IsString()
  @IsOptional()
  purpose?: string;
}

export class UpdateMinistryDto extends PartialType(CreateMinistryDto) {}

export class AddMinistryMemberDto {
  @ApiProperty({
    description: 'Member ID to add to the ministry',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  memberId: string;

  @ApiPropertyOptional({
    description: 'Role of the member in the ministry',
    enum: MinistryRole,
    default: MinistryRole.MEMBER,
    example: MinistryRole.MEMBER,
  })
  @IsEnum(MinistryRole)
  @IsOptional()
  role?: MinistryRole;
}

export class MinistryMemberResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  memberId: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  ministryId: string;

  @ApiProperty({ enum: MinistryRole, example: MinistryRole.MEMBER })
  role: MinistryRole;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  joinedAt: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class MinistryResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'Youth Ministry' })
  name: string;

  @ApiPropertyOptional({ example: 'Ministry focused on spiritual growth of young people' })
  description?: string;

  @ApiPropertyOptional({ example: 'To equip the next generation of leaders' })
  purpose?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: string;
}

export class MinistryWithCountResponse extends MinistryResponse {
  @ApiProperty({
    description: 'Count of members in the ministry',
    example: { members: 25 },
  })
  _count: { members: number };
}

export class MinistryDetailResponse extends MinistryResponse {
  @ApiProperty({
    description: 'List of ministry members with their details',
    type: [MinistryMemberResponse],
  })
  members: MinistryMemberResponse[];
}
