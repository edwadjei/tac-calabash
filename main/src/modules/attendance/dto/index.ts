import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, IsBoolean, IsArray, ArrayMinSize } from 'class-validator';

export enum AttendanceType {
  SUNDAY_SERVICE = 'SUNDAY_SERVICE',
  MIDWEEK_SERVICE = 'MIDWEEK_SERVICE',
  MINISTRY_MEETING = 'MINISTRY_MEETING',
  SPECIAL_EVENT = 'SPECIAL_EVENT',
}

export class RecordAttendanceDto {
  @ApiProperty({
    description: 'Member ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  memberId: string;

  @ApiProperty({
    description: 'Date of attendance (ISO 8601 format)',
    example: '2024-01-21',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Type of service/meeting',
    enum: AttendanceType,
    example: AttendanceType.SUNDAY_SERVICE,
  })
  @IsEnum(AttendanceType)
  type: AttendanceType;

  @ApiPropertyOptional({
    description: 'Event ID (if attendance is for a specific event)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  eventId?: string;

  @ApiPropertyOptional({
    description: 'Ministry ID (if attendance is for a ministry meeting)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  ministryId?: string;

  @ApiPropertyOptional({
    description: 'Whether the member was present',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isPresent?: boolean;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Arrived late',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class BulkAttendanceDto {
  @ApiProperty({
    description: 'Date of attendance (ISO 8601 format)',
    example: '2024-01-21',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Type of service/meeting',
    enum: AttendanceType,
    example: AttendanceType.SUNDAY_SERVICE,
  })
  @IsEnum(AttendanceType)
  type: AttendanceType;

  @ApiProperty({
    description: 'Array of member IDs who were present',
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b2c3d4e5-f6a7-8901-bcde-f23456789012'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  memberIds: string[];

  @ApiPropertyOptional({
    description: 'Event ID (if attendance is for a specific event)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  eventId?: string;

  @ApiPropertyOptional({
    description: 'Ministry ID (if attendance is for a ministry meeting)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  ministryId?: string;
}

export class AttendanceQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by date (ISO 8601 format)',
    example: '2024-01-21',
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({
    description: 'Filter by attendance type',
    enum: AttendanceType,
    example: AttendanceType.SUNDAY_SERVICE,
  })
  @IsEnum(AttendanceType)
  @IsOptional()
  type?: AttendanceType;

  @ApiPropertyOptional({
    description: 'Filter by member ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  memberId?: string;

  @ApiPropertyOptional({
    description: 'Filter by ministry ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  ministryId?: string;
}

export class AttendanceResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  memberId: string;

  @ApiProperty({ example: '2024-01-21' })
  date: string;

  @ApiProperty({ enum: AttendanceType, example: AttendanceType.SUNDAY_SERVICE })
  type: AttendanceType;

  @ApiProperty({ example: true })
  isPresent: boolean;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  eventId?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  ministryId?: string;

  @ApiProperty({ example: '2024-01-21T10:30:00.000Z' })
  createdAt: string;
}

export class BulkAttendanceResponse {
  @ApiProperty({ description: 'Number of attendance records created', example: 25 })
  count: number;
}
