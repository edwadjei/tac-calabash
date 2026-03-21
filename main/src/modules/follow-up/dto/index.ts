import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';

export enum FollowUpType {
  NEW_VISITOR = 'NEW_VISITOR',
  ABSENT_MEMBER = 'ABSENT_MEMBER',
  PASTORAL_CARE = 'PASTORAL_CARE',
  GENERAL = 'GENERAL',
}

export enum FollowUpStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateFollowUpDto {
  @ApiProperty({
    description: 'Member ID requiring follow-up',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  memberId: string;

  @ApiProperty({
    description: 'Type of follow-up',
    enum: FollowUpType,
    example: FollowUpType.NEW_VISITOR,
  })
  @IsEnum(FollowUpType)
  type: FollowUpType;

  @ApiPropertyOptional({
    description: 'Reason for follow-up',
    example: 'First-time visitor on Sunday service',
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({
    description: 'User/Staff ID assigned to this follow-up',
    example: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  })
  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: 'Due date for completing the follow-up (ISO 8601)',
    example: '2024-01-25',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Initial notes',
    example: 'Called but no answer. Will try again.',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateFollowUpDto {
  @ApiPropertyOptional({
    description: 'Updated status',
    enum: FollowUpStatus,
    example: FollowUpStatus.IN_PROGRESS,
  })
  @IsEnum(FollowUpStatus)
  @IsOptional()
  status?: FollowUpStatus;

  @ApiPropertyOptional({
    description: 'User/Staff ID to reassign to',
    example: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  })
  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: 'Updated notes',
    example: 'Spoke with member. They are doing well.',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Updated due date (ISO 8601)',
    example: '2024-01-30',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export class CompleteFollowUpDto {
  @ApiPropertyOptional({
    description: 'Completion notes',
    example: 'Successfully contacted. Member is happy and plans to attend regularly.',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class FollowUpQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: FollowUpStatus,
    example: FollowUpStatus.PENDING,
  })
  @IsEnum(FollowUpStatus)
  @IsOptional()
  status?: FollowUpStatus;

  @ApiPropertyOptional({
    description: 'Filter by type',
    enum: FollowUpType,
    example: FollowUpType.NEW_VISITOR,
  })
  @IsEnum(FollowUpType)
  @IsOptional()
  type?: FollowUpType;

  @ApiPropertyOptional({
    description: 'Filter by assigned user',
    example: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  })
  @IsUUID()
  @IsOptional()
  assignedTo?: string;
}

export class FollowUpResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  memberId: string;

  @ApiProperty({ enum: FollowUpType, example: FollowUpType.NEW_VISITOR })
  type: FollowUpType;

  @ApiPropertyOptional({ example: 'First-time visitor on Sunday service' })
  reason?: string;

  @ApiPropertyOptional({ example: 'b2c3d4e5-f6a7-8901-bcde-f23456789012' })
  assignedTo?: string;

  @ApiProperty({ enum: FollowUpStatus, example: FollowUpStatus.PENDING })
  status: FollowUpStatus;

  @ApiPropertyOptional({ example: 'Called but no answer.' })
  notes?: string;

  @ApiPropertyOptional({ example: '2024-01-25' })
  dueDate?: string;

  @ApiPropertyOptional({ example: '2024-01-26T10:30:00.000Z' })
  completedAt?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: string;
}
