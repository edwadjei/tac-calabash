import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import {
  CreateAnnouncementDto,
  SendNotificationDto,
  RegisterDeviceDto,
  AnnouncementResponse,
  NotificationResponse,
  DeviceTokenResponse,
} from './dto';

@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@Controller('notifications')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing authentication token',
})
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('announcements')
  @ApiOperation({
    summary: 'Get announcements',
    description: 'Retrieve published announcements, optionally filtered by ministry.',
  })
  @ApiQuery({
    name: 'ministryId',
    required: false,
    description: 'Filter by ministry ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Announcements retrieved successfully',
    type: [AnnouncementResponse],
  })
  getAnnouncements(@Query('ministryId') ministryId?: string) {
    return this.notificationsService.getAnnouncements(ministryId);
  }

  @Post('announcements')
  @ApiOperation({
    summary: 'Create announcement',
    description: 'Create a new church or ministry announcement.',
  })
  @ApiResponse({
    status: 201,
    description: 'Announcement created successfully',
    type: AnnouncementResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  createAnnouncement(@Body() dto: CreateAnnouncementDto) {
    return this.notificationsService.createAnnouncement(dto);
  }

  @Post('send')
  @ApiOperation({
    summary: 'Send push notification',
    description: 'Send a push notification to all members or specific recipients.',
  })
  @ApiResponse({
    status: 201,
    description: 'Notification sent successfully',
    type: NotificationResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  send(@Body() dto: SendNotificationDto) {
    return this.notificationsService.send(dto);
  }

  @Post('register-device')
  @ApiOperation({
    summary: 'Register device for push notifications',
    description: 'Register a mobile device to receive push notifications. Called from the mobile app after login.',
  })
  @ApiResponse({
    status: 201,
    description: 'Device registered successfully',
    type: DeviceTokenResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  registerDevice(@Body() dto: RegisterDeviceDto) {
    return this.notificationsService.registerDevice(dto);
  }
}
