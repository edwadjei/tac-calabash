import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import {
  RecordAttendanceDto,
  BulkAttendanceDto,
  AttendanceQueryDto,
  AttendanceResponse,
  BulkAttendanceResponse,
} from './dto';

@ApiTags('Attendance')
@ApiBearerAuth('access-token')
@Controller('attendance')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing authentication token',
})
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiOperation({
    summary: 'Get attendance records',
    description: 'Retrieve attendance records with optional filtering by date, type, member, or ministry.',
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance records retrieved successfully',
    type: [AttendanceResponse],
  })
  findAll(@Query() query: AttendanceQueryDto) {
    return this.attendanceService.findAll(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Record individual attendance',
    description: 'Record attendance for a single member.',
  })
  @ApiResponse({
    status: 201,
    description: 'Attendance recorded successfully',
    type: AttendanceResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  record(@Body() dto: RecordAttendanceDto) {
    return this.attendanceService.record(dto);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Record bulk attendance',
    description: 'Record attendance for multiple members at once. Useful for recording attendance after a service.',
  })
  @ApiResponse({
    status: 201,
    description: 'Bulk attendance recorded successfully',
    type: BulkAttendanceResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  recordBulk(@Body() dto: BulkAttendanceDto) {
    return this.attendanceService.recordBulk(dto);
  }
}
