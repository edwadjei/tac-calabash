import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsNumber } from 'class-validator';

export class ReportDateRangeDto {
  @ApiPropertyOptional({
    description: 'Start date for the report (ISO 8601 format)',
    example: '2024-01-01',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for the report (ISO 8601 format)',
    example: '2024-12-31',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class FinancialReportQueryDto {
  @ApiPropertyOptional({
    description: 'Year for the financial report (defaults to current year)',
    example: 2024,
  })
  @IsNumber()
  @IsOptional()
  year?: number;
}

export class DashboardStatsResponse {
  @ApiProperty({ description: 'Total number of members', example: 250 })
  totalMembers: number;

  @ApiProperty({ description: 'Number of active members', example: 220 })
  activeMembers: number;

  @ApiProperty({ description: 'Number of active ministries', example: 8 })
  totalMinistries: number;

  @ApiProperty({ description: 'Number of upcoming events', example: 5 })
  upcomingEvents: number;

  @ApiProperty({ description: 'Total contributions this month', example: 15000.00 })
  monthlyContributions: number;
}

export class MembershipByStatus {
  @ApiProperty({ example: 'ACTIVE' })
  membershipStatus: string;

  @ApiProperty({ example: 200 })
  _count: number;
}

export class MembershipByGender {
  @ApiProperty({ example: 'MALE' })
  gender: string;

  @ApiProperty({ example: 120 })
  _count: number;
}

export class MembershipReportResponse {
  @ApiProperty({ type: [MembershipByStatus] })
  byStatus: MembershipByStatus[];

  @ApiProperty({ type: [MembershipByGender] })
  byGender: MembershipByGender[];

  @ApiProperty({
    description: 'List of new members in the date range',
    type: 'array',
    items: { type: 'object' },
  })
  newMembers: any[];
}

export class AttendanceByDate {
  @ApiProperty({ example: '2024-01-21' })
  date: string;

  @ApiProperty({ example: 'SUNDAY_SERVICE' })
  type: string;

  @ApiProperty({ example: 150 })
  _count: number;
}

export class AttendanceReportResponse {
  @ApiProperty({ type: [AttendanceByDate] })
  attendance: AttendanceByDate[];

  @ApiProperty({ example: '2024-01-01' })
  startDate: string;

  @ApiProperty({ example: '2024-03-31' })
  endDate: string;
}

export class ContributionByType {
  @ApiProperty({ example: 'TITHE' })
  type: string;

  @ApiProperty({
    example: { amount: 50000 },
  })
  _sum: { amount: number };
}

export class ContributionByMonth {
  @ApiProperty({ example: 1 })
  month: number;

  @ApiProperty({ example: 15000.00 })
  total: number;
}

export class FinancialReportResponse {
  @ApiProperty({ description: 'Year of the report', example: 2024 })
  year: number;

  @ApiProperty({ type: [ContributionByType] })
  byType: ContributionByType[];

  @ApiProperty({ type: [ContributionByMonth] })
  byMonth: ContributionByMonth[];

  @ApiProperty({ description: 'Total contributions for the year', example: 180000.00 })
  total: number;
}
