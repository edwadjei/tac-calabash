import { Controller, Get, Post, Patch, Body, Param, Query, ParseUUIDPipe, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FinancesService } from './finances.service';
import {
  CreateContributionDto,
  CreatePledgeDto,
  UpdatePledgeDto,
  ContributionQueryDto,
  ContributionResponse,
  PledgeResponse,
  GivingStatementResponse,
} from './dto';

@ApiTags('Finances')
@ApiBearerAuth('access-token')
@Controller('finances')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing authentication token',
})
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  // ==================== CONTRIBUTIONS ====================

  @Get('contributions')
  @ApiOperation({
    summary: 'Get all contributions',
    description: 'Retrieve a list of contributions with optional filtering by member, type, and date range.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of contributions retrieved successfully',
    type: [ContributionResponse],
  })
  getContributions(@Query() query: ContributionQueryDto) {
    return this.financesService.getContributions(query);
  }

  @Post('contributions')
  @ApiOperation({
    summary: 'Record contribution',
    description: 'Record a new financial contribution (tithe, offering, donation, etc.).',
  })
  @ApiResponse({
    status: 201,
    description: 'Contribution recorded successfully',
    type: ContributionResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiNotFoundResponse({
    description: 'Member not found',
  })
  recordContribution(@Body() dto: CreateContributionDto) {
    return this.financesService.recordContribution(dto);
  }

  // ==================== PLEDGES ====================

  @Get('pledges')
  @ApiOperation({
    summary: 'Get all pledges',
    description: 'Retrieve a list of pledges with optional filtering by member.',
  })
  @ApiQuery({
    name: 'memberId',
    required: false,
    description: 'Filter by member ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'List of pledges retrieved successfully',
    type: [PledgeResponse],
  })
  getPledges(@Query('memberId') memberId?: string) {
    return this.financesService.getPledges(memberId);
  }

  @Post('pledges')
  @ApiOperation({
    summary: 'Create pledge',
    description: 'Create a new giving pledge for a member.',
  })
  @ApiResponse({
    status: 201,
    description: 'Pledge created successfully',
    type: PledgeResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiNotFoundResponse({
    description: 'Member not found',
  })
  createPledge(@Body() dto: CreatePledgeDto) {
    return this.financesService.createPledge(dto);
  }

  @Patch('pledges/:id')
  @ApiOperation({
    summary: 'Update pledge',
    description: 'Update a pledge status or amount paid.',
  })
  @ApiParam({
    name: 'id',
    description: 'Pledge UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Pledge updated successfully',
    type: PledgeResponse,
  })
  @ApiNotFoundResponse({
    description: 'Pledge not found',
  })
  updatePledge(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePledgeDto,
  ) {
    return this.financesService.updatePledge(id, dto);
  }

  // ==================== STATEMENTS ====================

  @Get('statements/:memberId')
  @ApiOperation({
    summary: 'Get giving statement',
    description: 'Generate a giving statement for a member for a specific year. Includes all contributions and a summary.',
  })
  @ApiParam({
    name: 'memberId',
    description: 'Member UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Year for the statement (defaults to current year)',
    example: 2024,
  })
  @ApiResponse({
    status: 200,
    description: 'Giving statement generated successfully',
    type: GivingStatementResponse,
  })
  @ApiNotFoundResponse({
    description: 'Member not found',
  })
  getStatement(
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Query('year') year?: number,
  ) {
    return this.financesService.getStatement(memberId, year);
  }
}
