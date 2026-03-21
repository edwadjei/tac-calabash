import { Controller, Get, Post, Patch, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { MinistriesService } from './ministries.service';
import {
  CreateMinistryDto,
  UpdateMinistryDto,
  AddMinistryMemberDto,
  MinistryResponse,
  MinistryWithCountResponse,
  MinistryDetailResponse,
  MinistryMemberResponse,
} from './dto';

@ApiTags('Ministries')
@ApiBearerAuth('access-token')
@Controller('ministries')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing authentication token',
})
export class MinistriesController {
  constructor(private readonly ministriesService: MinistriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all ministries',
    description: 'Retrieve a list of all church ministries with member counts.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of ministries retrieved successfully',
    type: [MinistryWithCountResponse],
  })
  findAll() {
    return this.ministriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get ministry by ID',
    description: 'Retrieve detailed information about a specific ministry including its members.',
  })
  @ApiParam({
    name: 'id',
    description: 'Ministry UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Ministry found successfully',
    type: MinistryDetailResponse,
  })
  @ApiNotFoundResponse({
    description: 'Ministry not found',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ministriesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new ministry',
    description: 'Create a new church ministry.',
  })
  @ApiResponse({
    status: 201,
    description: 'Ministry created successfully',
    type: MinistryResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiConflictResponse({
    description: 'Ministry with this name already exists',
  })
  create(@Body() createMinistryDto: CreateMinistryDto) {
    return this.ministriesService.create(createMinistryDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update ministry',
    description: 'Update an existing ministry\'s information.',
  })
  @ApiParam({
    name: 'id',
    description: 'Ministry UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Ministry updated successfully',
    type: MinistryResponse,
  })
  @ApiNotFoundResponse({
    description: 'Ministry not found',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMinistryDto: UpdateMinistryDto,
  ) {
    return this.ministriesService.update(id, updateMinistryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deactivate ministry',
    description: 'Soft delete a ministry by setting it as inactive.',
  })
  @ApiParam({
    name: 'id',
    description: 'Ministry UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Ministry deactivated successfully',
    type: MinistryResponse,
  })
  @ApiNotFoundResponse({
    description: 'Ministry not found',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ministriesService.remove(id);
  }

  @Post(':id/members')
  @ApiOperation({
    summary: 'Add member to ministry',
    description: 'Add a church member to a ministry with an optional role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Ministry UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 201,
    description: 'Member added to ministry successfully',
    type: MinistryMemberResponse,
  })
  @ApiNotFoundResponse({
    description: 'Ministry or member not found',
  })
  @ApiConflictResponse({
    description: 'Member is already in this ministry',
  })
  addMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addMemberDto: AddMinistryMemberDto,
  ) {
    return this.ministriesService.addMember(id, addMemberDto);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({
    summary: 'Remove member from ministry',
    description: 'Remove a member from a ministry (soft delete - preserves history).',
  })
  @ApiParam({
    name: 'id',
    description: 'Ministry UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiParam({
    name: 'memberId',
    description: 'Member UUID',
    example: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  })
  @ApiResponse({
    status: 200,
    description: 'Member removed from ministry successfully',
    type: MinistryMemberResponse,
  })
  @ApiNotFoundResponse({
    description: 'Ministry membership not found',
  })
  removeMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
  ) {
    return this.ministriesService.removeMember(id, memberId);
  }
}
