import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID, IsBoolean, IsArray, IsDateString } from 'class-validator';

export enum NotificationType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  REMINDER = 'REMINDER',
  EVENT = 'EVENT',
  PERSONAL = 'PERSONAL',
}

export class CreateAnnouncementDto {
  @ApiProperty({
    description: 'Announcement title',
    example: 'Church Picnic Next Sunday',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Announcement content',
    example: 'Join us for our annual church picnic at Central Park. Bring your family and friends!',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Ministry ID (if ministry-specific announcement)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  ministryId?: string;

  @ApiPropertyOptional({
    description: 'Whether to publish immediately',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description: 'Expiration date for the announcement (ISO 8601)',
    example: '2024-02-01',
  })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class SendNotificationDto {
  @ApiProperty({
    description: 'Notification title',
    example: 'Service Reminder',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Notification body/content',
    example: 'Don\'t forget! Sunday service starts at 9:00 AM',
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.REMINDER,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({
    description: 'Specific member IDs to send to (if not specified, sends to all)',
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  recipients?: string[];
}

export class RegisterDeviceDto {
  @ApiProperty({
    description: 'Member ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  memberId: string;

  @ApiProperty({
    description: 'Push notification token (Expo Push Token)',
    example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Device platform',
    example: 'ios',
    enum: ['ios', 'android'],
  })
  @IsString()
  platform: string;
}

export class AnnouncementResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'Church Picnic Next Sunday' })
  title: string;

  @ApiProperty({ example: 'Join us for our annual church picnic...' })
  content: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  ministryId?: string;

  @ApiProperty({ example: true })
  isPublished: boolean;

  @ApiPropertyOptional({ example: '2024-01-20T10:00:00.000Z' })
  publishedAt?: string;

  @ApiPropertyOptional({ example: '2024-02-01T00:00:00.000Z' })
  expiresAt?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: string;
}

export class NotificationResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'Service Reminder' })
  title: string;

  @ApiProperty({ example: 'Don\'t forget! Sunday service starts at 9:00 AM' })
  body: string;

  @ApiProperty({ enum: NotificationType, example: NotificationType.REMINDER })
  type: NotificationType;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  sentAt: string;
}

export class DeviceTokenResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  memberId: string;

  @ApiProperty({ example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' })
  token: string;

  @ApiProperty({ example: 'ios' })
  platform: string;
}
