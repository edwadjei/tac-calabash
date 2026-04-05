import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccountingService } from './accounting.service';
import {
  CreateFinAccountDto,
  UpdateFinAccountDto,
  FinAccountQueryDto,
  CreateFinJournalEntryDto,
  UpdateFinJournalEntryDto,
  FinJournalEntryQueryDto,
} from './dto';

@ApiTags('Finances')
@ApiBearerAuth('access-token')
@Controller('finances')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing authentication token',
})
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Post('accounts')
  @ApiOperation({
    summary: 'Create account',
    description: 'Create a new account in the chart of accounts. Code is auto-generated based on account type.',
  })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input or validation error' })
  createFinAccount(@Body() dto: CreateFinAccountDto) {
    return this.accountingService.createFinAccount(dto);
  }

  @Get('accounts')
  @ApiOperation({
    summary: 'List accounts',
    description: 'Retrieve all accounts with optional filtering by type, group, and parent.',
  })
  @ApiResponse({ status: 200, description: 'List of accounts retrieved successfully' })
  getFinAccounts(@Query() query: FinAccountQueryDto) {
    return this.accountingService.getFinAccounts(query);
  }

  @Get('accounts/:id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiParam({ name: 'id', description: 'Account UUID' })
  @ApiResponse({ status: 200, description: 'Account retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  getFinAccount(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountingService.getFinAccount(id);
  }

  @Patch('accounts/:id')
  @ApiOperation({
    summary: 'Update account',
    description: 'Update account name and/or description only.',
  })
  @ApiParam({ name: 'id', description: 'Account UUID' })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  updateFinAccount(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFinAccountDto) {
    return this.accountingService.updateFinAccount(id, dto);
  }

  @Delete('accounts/:id')
  @ApiOperation({
    summary: 'Delete account',
    description: 'Delete an account. Cannot delete group accounts with children or accounts with journal entries.',
  })
  @ApiParam({ name: 'id', description: 'Account UUID' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiBadRequestResponse({ description: 'Account has children or journal entries' })
  deleteFinAccount(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountingService.deleteFinAccount(id);
  }

  @Post('journal-entries')
  @ApiOperation({
    summary: 'Create journal entry',
    description: 'Create a new journal entry in DRAFT status. Debits must equal credits across all lines.',
  })
  @ApiResponse({ status: 201, description: 'Journal entry created successfully' })
  @ApiBadRequestResponse({ description: 'Unbalanced entry or invalid accounts' })
  createFinJournalEntry(@Body() dto: CreateFinJournalEntryDto) {
    return this.accountingService.createFinJournalEntry(dto);
  }

  @Get('journal-entries')
  @ApiOperation({
    summary: 'List journal entries',
    description: 'Retrieve journal entries with pagination and optional status/date filtering.',
  })
  @ApiResponse({ status: 200, description: 'List of journal entries retrieved successfully' })
  getFinJournalEntries(@Query() query: FinJournalEntryQueryDto) {
    return this.accountingService.getFinJournalEntries(query);
  }

  @Get('journal-entries/:id')
  @ApiOperation({ summary: 'Get journal entry by ID' })
  @ApiParam({ name: 'id', description: 'Journal entry UUID' })
  @ApiResponse({ status: 200, description: 'Journal entry retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Journal entry not found' })
  getFinJournalEntry(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountingService.getFinJournalEntry(id);
  }

  @Patch('journal-entries/:id')
  @ApiOperation({
    summary: 'Update journal entry',
    description: 'Update a DRAFT journal entry. Cannot update posted entries.',
  })
  @ApiParam({ name: 'id', description: 'Journal entry UUID' })
  @ApiResponse({ status: 200, description: 'Journal entry updated successfully' })
  @ApiNotFoundResponse({ description: 'Journal entry not found' })
  @ApiBadRequestResponse({ description: 'Entry is posted or unbalanced lines' })
  updateFinJournalEntry(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFinJournalEntryDto,
  ) {
    return this.accountingService.updateFinJournalEntry(id, dto);
  }

  @Patch('journal-entries/:id/post')
  @ApiOperation({
    summary: 'Post journal entry',
    description: 'Finalize a DRAFT journal entry. This is irreversible; posted entries cannot be modified or deleted.',
  })
  @ApiParam({ name: 'id', description: 'Journal entry UUID' })
  @ApiResponse({ status: 200, description: 'Journal entry posted successfully' })
  @ApiNotFoundResponse({ description: 'Journal entry not found' })
  @ApiBadRequestResponse({ description: 'Entry is already posted' })
  postFinJournalEntry(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountingService.postFinJournalEntry(id);
  }

  @Delete('journal-entries/:id')
  @ApiOperation({
    summary: 'Delete journal entry',
    description: 'Delete a DRAFT journal entry and all its lines. Cannot delete posted entries.',
  })
  @ApiParam({ name: 'id', description: 'Journal entry UUID' })
  @ApiResponse({ status: 200, description: 'Journal entry deleted successfully' })
  @ApiNotFoundResponse({ description: 'Journal entry not found' })
  @ApiBadRequestResponse({ description: 'Entry is posted' })
  deleteFinJournalEntry(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountingService.deleteFinJournalEntry(id);
  }
}
