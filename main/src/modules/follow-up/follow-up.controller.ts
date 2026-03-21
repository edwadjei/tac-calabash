import { Controller, Get, Post, Patch, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
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
import { FollowUpService } from './follow-up.service';
import {
  CreateFollowUpDto,
  UpdateFollowUpDto,
  CompleteFollowUpDto,
  FollowUpQueryDto,
  FollowUpResponse,
} from './dto';

@ApiTags('Follow-Up')
@ApiBearerAuth('access-token')
@Controller('follow-up')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing authentication token',
})
export class FollowUpController {
  constructor(private readonly followUpService: FollowUpService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all follow-ups',
    description: 'Retrieve follow-up tasks with optional filtering by status, type, or assignee.',
  })
  @ApiResponse({
    status: 200,
    description: 'Follow-ups retrieved successfully',
    type: [FollowUpResponse],
  })
  findAll(@Query() query: FollowUpQueryDto) {
    return this.followUpService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get follow-up by ID',
    description: 'Retrieve detailed information about a specific follow-up task.',
  })
  @ApiParam({
    name: 'id',
    description: 'Follow-up UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Follow-up found successfully',
    type: FollowUpResponse,
  })
  @ApiNotFoundResponse({
    description: 'Follow-up not found',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.followUpService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create follow-up task',
    description: 'Create a new follow-up task for a member (e.g., new visitor follow-up, absence follow-up).',
  })
  @ApiResponse({
    status: 201,
    description: 'Follow-up created successfully',
    type: FollowUpResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  create(@Body() dto: CreateFollowUpDto) {
    return this.followUpService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update follow-up',
    description: 'Update a follow-up task (status, notes, assignee, etc.).',
  })
  @ApiParam({
    name: 'id',
    description: 'Follow-up UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Follow-up updated successfully',
    type: FollowUpResponse,
  })
  @ApiNotFoundResponse({
    description: 'Follow-up not found',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFollowUpDto,
  ) {
    return this.followUpService.update(id, dto);
  }

  @Patch(':id/complete')
  @ApiOperation({
    summary: 'Mark follow-up as completed',
    description: 'Mark a follow-up task as completed with optional completion notes.',
  })
  @ApiParam({
    name: 'id',
    description: 'Follow-up UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Follow-up completed successfully',
    type: FollowUpResponse,
  })
  @ApiNotFoundResponse({
    description: 'Follow-up not found',
  })
  complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CompleteFollowUpDto,
  ) {
    return this.followUpService.complete(id, dto.notes);
  }
}
