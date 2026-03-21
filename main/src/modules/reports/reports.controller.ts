import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import {
  ReportDateRangeDto,
  FinancialReportQueryDto,
  DashboardStatsResponse,
  MembershipReportResponse,
  AttendanceReportResponse,
  FinancialReportResponse,
} from './dto';

@ApiTags('Reports')
@ApiBearerAuth('access-token')
@Controller('reports')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing authentication token',
})
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get dashboard statistics',
    description: 'Retrieve key statistics for the admin dashboard including member counts, ministry counts, upcoming events, and monthly contributions.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
    type: DashboardStatsResponse,
  })
  getDashboard() {
    return this.reportsService.getDashboardStats();
  }

  @Get('membership')
  @ApiOperation({
    summary: 'Get membership report',
    description: 'Generate a membership report showing member distribution by status and gender, plus new members in the specified date range.',
  })
  @ApiResponse({
    status: 200,
    description: 'Membership report generated successfully',
    type: MembershipReportResponse,
  })
  getMembershipReport(@Query() query: ReportDateRangeDto) {
    return this.reportsService.getMembershipReport(query);
  }

  @Get('attendance')
  @ApiOperation({
    summary: 'Get attendance report',
    description: 'Generate an attendance report showing attendance trends over the specified date range (defaults to last 3 months).',
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance report generated successfully',
    type: AttendanceReportResponse,
  })
  getAttendanceReport(@Query() query: ReportDateRangeDto) {
    return this.reportsService.getAttendanceReport(query);
  }

  @Get('financial')
  @ApiOperation({
    summary: 'Get financial report',
    description: 'Generate a financial report showing contributions by type and by month for the specified year (defaults to current year).',
  })
  @ApiResponse({
    status: 200,
    description: 'Financial report generated successfully',
    type: FinancialReportResponse,
  })
  getFinancialReport(@Query() query: FinancialReportQueryDto) {
    return this.reportsService.getFinancialReport(query.year);
  }
}
