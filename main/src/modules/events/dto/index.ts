import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID, IsBoolean, IsDateString, MinLength } from 'class-validator';

export enum EventCategory {
  SERVICE = 'SERVICE',
  MEETING = 'MEETING',
  FELLOWSHIP = 'FELLOWSHIP',
  OUTREACH = 'OUTREACH',
  CONFERENCE = 'CONFERENCE',
  CELEBRATION = 'CELEBRATION',
  OTHER = 'OTHER',
}

export class CreateEventDto {
  @ApiProperty({
    description: 'Event title',
    example: 'Sunday Worship Service',
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Weekly Sunday worship service with praise, worship, and the Word.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Event location',
    example: 'Main Sanctuary',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Event start date and time (ISO 8601 format)',
    example: '2024-01-21T09:00:00.000Z',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'Event end date and time (ISO 8601 format)',
    example: '2024-01-21T12:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Whether the event is an all-day event',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isAllDay?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the event recurs',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @ApiPropertyOptional({
    description: 'Recurrence rule (RRULE format)',
    example: 'FREQ=WEEKLY;BYDAY=SU',
  })
  @IsString()
  @IsOptional()
  recurrence?: string;

  @ApiProperty({
    description: 'Event category',
    enum: EventCategory,
    example: EventCategory.SERVICE,
  })
  @IsEnum(EventCategory)
  category: EventCategory;

  @ApiPropertyOptional({
    description: 'Associated ministry ID (if ministry-specific event)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  ministryId?: string;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}

export class EventQueryDto {
  @ApiPropertyOptional({
    description: 'Filter events starting from this date (ISO 8601)',
    example: '2024-01-01',
  })
  @IsDateString()
  @IsOptional()
  start?: string;

  @ApiPropertyOptional({
    description: 'Filter events until this date (ISO 8601)',
    example: '2024-12-31',
  })
  @IsDateString()
  @IsOptional()
  end?: string;

  @ApiPropertyOptional({
    description: 'Filter by ministry ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  ministryId?: string;

  @ApiPropertyOptional({
    description: 'Filter by event category',
    enum: EventCategory,
    example: EventCategory.SERVICE,
  })
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;
}

export class EventResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'Sunday Worship Service' })
  title: string;

  @ApiPropertyOptional({ example: 'Weekly Sunday worship service' })
  description?: string;

  @ApiPropertyOptional({ example: 'Main Sanctuary' })
  location?: string;

  @ApiProperty({ example: '2024-01-21T09:00:00.000Z' })
  startDate: string;

  @ApiPropertyOptional({ example: '2024-01-21T12:00:00.000Z' })
  endDate?: string;

  @ApiProperty({ example: false })
  isAllDay: boolean;

  @ApiProperty({ example: true })
  isRecurring: boolean;

  @ApiPropertyOptional({ example: 'FREQ=WEEKLY;BYDAY=SU' })
  recurrence?: string;

  @ApiProperty({ enum: EventCategory, example: EventCategory.SERVICE })
  category: EventCategory;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  ministryId?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: string;
}
