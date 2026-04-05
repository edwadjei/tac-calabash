import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID, IsNumber, IsDateString, IsPositive, Min } from 'class-validator';
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum ContributionType {
  TITHE = 'TITHE',
  OFFERING = 'OFFERING',
  SPECIAL_OFFERING = 'SPECIAL_OFFERING',
  DONATION = 'DONATION',
  PLEDGE_PAYMENT = 'PLEDGE_PAYMENT',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CHECK = 'CHECK',
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CARD = 'CARD',
}

export enum PledgeFrequency {
  ONE_TIME = 'ONE_TIME',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
}

export enum PledgeStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateContributionDto {
  @ApiProperty({
    description: 'Member ID who made the contribution',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  memberId: string;

  @ApiProperty({
    description: 'Contribution amount',
    example: 100.00,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Type of contribution',
    enum: ContributionType,
    example: ContributionType.TITHE,
  })
  @IsEnum(ContributionType)
  type: ContributionType;

  @ApiPropertyOptional({
    description: 'Category for special offerings (e.g., Building Fund, Missions)',
    example: 'Building Fund',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Date of contribution (ISO 8601 format)',
    example: '2024-01-21',
  })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({
    description: 'Payment method',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
    example: PaymentMethod.CASH,
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  method?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Reference number (check number, transaction ID)',
    example: 'CHK-12345',
  })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Thanksgiving offering',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreatePledgeDto {
  @ApiProperty({
    description: 'Member ID making the pledge',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  memberId: string;

  @ApiProperty({
    description: 'Total pledge amount',
    example: 1000.00,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Purpose of the pledge',
    example: 'Church Building Project',
  })
  @IsString()
  purpose: string;

  @ApiProperty({
    description: 'Pledge start date (ISO 8601 format)',
    example: '2024-01-01',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'Pledge end date (ISO 8601 format)',
    example: '2024-12-31',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'Payment frequency',
    enum: PledgeFrequency,
    example: PledgeFrequency.MONTHLY,
  })
  @IsEnum(PledgeFrequency)
  frequency: PledgeFrequency;
}

export class UpdatePledgeDto {
  @ApiPropertyOptional({
    description: 'Updated pledge status',
    enum: PledgeStatus,
    example: PledgeStatus.COMPLETED,
  })
  @IsEnum(PledgeStatus)
  @IsOptional()
  status?: PledgeStatus;

  @ApiPropertyOptional({
    description: 'Updated amount paid',
    example: 500.00,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  amountPaid?: number;
}

export class ContributionQueryDto {
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
    description: 'Filter by member ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  memberId?: string;

  @ApiPropertyOptional({
    description: 'Filter by contribution type',
    enum: ContributionType,
    example: ContributionType.TITHE,
  })
  @IsEnum(ContributionType)
  @IsOptional()
  type?: ContributionType;

  @ApiPropertyOptional({
    description: 'Filter contributions from this date (ISO 8601)',
    example: '2024-01-01',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter contributions until this date (ISO 8601)',
    example: '2024-12-31',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class ContributionResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  memberId: string;

  @ApiProperty({ example: 100.00 })
  amount: number;

  @ApiProperty({ enum: ContributionType, example: ContributionType.TITHE })
  type: ContributionType;

  @ApiPropertyOptional({ example: 'Building Fund' })
  category?: string;

  @ApiProperty({ example: '2024-01-21' })
  date: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  method: PaymentMethod;

  @ApiPropertyOptional({ example: 'CHK-12345' })
  reference?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: string;
}

export class PledgeResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  memberId: string;

  @ApiProperty({ example: 1000.00 })
  amount: number;

  @ApiProperty({ example: 'Church Building Project' })
  purpose: string;

  @ApiProperty({ example: '2024-01-01' })
  startDate: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  endDate?: string;

  @ApiProperty({ enum: PledgeFrequency, example: PledgeFrequency.MONTHLY })
  frequency: PledgeFrequency;

  @ApiProperty({ example: 500.00 })
  amountPaid: number;

  @ApiProperty({ enum: PledgeStatus, example: PledgeStatus.ACTIVE })
  status: PledgeStatus;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: string;
}

export class ContributionSummary {
  @ApiProperty({ example: 5000.00 })
  total: number;

  @ApiProperty({
    example: { TITHE: 3000, OFFERING: 1500, SPECIAL_OFFERING: 500 },
  })
  byType: Record<string, number>;
}

export class GivingStatementResponse {
  @ApiProperty({
    description: 'Member information',
    example: { id: 'uuid', firstName: 'John', lastName: 'Doe' },
  })
  member: {
    id: string;
    firstName: string;
    lastName: string;
  };

  @ApiProperty({ example: 2024 })
  year: number;

  @ApiProperty({ type: [ContributionResponse] })
  contributions: ContributionResponse[];

  @ApiProperty({ type: ContributionSummary })
  summary: ContributionSummary;
}

export enum FinAccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum FinJournalEntryStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
}

export class CreateFinAccountDto {
  @ApiProperty({ description: 'Account name', example: 'Cash' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Account description', example: 'Main cash account' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Account type', enum: FinAccountType, example: FinAccountType.ASSET })
  @IsEnum(FinAccountType)
  accountType: FinAccountType;

  @ApiPropertyOptional({ description: 'Whether this is a group (parent) account', default: false })
  @IsBoolean()
  @IsOptional()
  isGroup?: boolean;

  @ApiPropertyOptional({ description: 'Whether this is a contra account', default: false })
  @IsBoolean()
  @IsOptional()
  isContra?: boolean;

  @ApiPropertyOptional({ description: 'Parent account ID (must be a group account)' })
  @IsUUID()
  @IsOptional()
  parentAccountId?: string;
}

export class UpdateFinAccountDto {
  @ApiPropertyOptional({ description: 'Account name', example: 'Petty Cash' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Account description' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class FinAccountQueryDto {
  @ApiPropertyOptional({ description: 'Filter by account type', enum: FinAccountType })
  @IsEnum(FinAccountType)
  @IsOptional()
  accountType?: FinAccountType;

  @ApiPropertyOptional({ description: 'Filter by group accounts only' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isGroup?: boolean;

  @ApiPropertyOptional({ description: 'Filter by contra accounts only' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isContra?: boolean;

  @ApiPropertyOptional({ description: 'Filter by parent account ID' })
  @IsUUID()
  @IsOptional()
  parentAccountId?: string;
}

export class CreateFinJournalEntryLineDto {
  @ApiProperty({ description: 'Account ID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  accountId: string;

  @ApiProperty({ description: 'Debit amount in cents (pesewas)', example: 50000, minimum: 0 })
  @IsInt()
  @Min(0)
  debit: number;

  @ApiProperty({ description: 'Credit amount in cents (pesewas)', example: 0, minimum: 0 })
  @IsInt()
  @Min(0)
  credit: number;

  @ApiPropertyOptional({ description: 'Line notes', example: 'Cash received for sale' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateFinJournalEntryDto {
  @ApiPropertyOptional({ description: 'Transaction reference', example: 'SALE-001' })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiProperty({ description: 'Transaction date (ISO 8601)', example: '2024-01-15' })
  @IsDateString()
  transactionDate: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @ApiProperty({
    description: 'Journal entry lines (minimum 2, debits must equal credits)',
    type: [CreateFinJournalEntryLineDto],
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'A journal entry must have at least 2 lines' })
  @ValidateNested({ each: true })
  @Type(() => CreateFinJournalEntryLineDto)
  lines: CreateFinJournalEntryLineDto[];
}

export class UpdateFinJournalEntryDto {
  @ApiPropertyOptional({ description: 'Transaction reference' })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiPropertyOptional({ description: 'Transaction date (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  transactionDate?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Replace all lines (minimum 2, debits must equal credits)',
    type: [CreateFinJournalEntryLineDto],
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'A journal entry must have at least 2 lines' })
  @ValidateNested({ each: true })
  @Type(() => CreateFinJournalEntryLineDto)
  @IsOptional()
  lines?: CreateFinJournalEntryLineDto[];
}

export class FinJournalEntryQueryDto {
  @ApiPropertyOptional({ description: 'Filter by status', enum: FinJournalEntryStatus })
  @IsEnum(FinJournalEntryStatus)
  @IsOptional()
  status?: FinJournalEntryStatus;

  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @ApiPropertyOptional({ description: 'Start date filter (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date filter (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
