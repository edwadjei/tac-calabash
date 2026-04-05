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
import { MembersService } from './members.service';
import {
  CreateMemberDto,
  UpdateMemberDto,
  MemberResponse,
  PaginatedMembersResponse,
  MemberQueryDto,
  RegisterGuestDto,
} from './dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Members')
@ApiBearerAuth('access-token')
@Controller('members')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing authentication token',
  schema: {
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  },
})
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all members',
    description: 'Retrieve a paginated list of church members with optional filtering and search.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of members retrieved successfully',
    type: PaginatedMembersResponse,
  })
  findAll(@Query() query: MemberQueryDto) {
    return this.membersService.findAll(query);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search members',
    description: 'Lightweight member search for autocomplete fields such as father, mother, and spouse links.',
  })
  search(@Query('query') query?: string) {
    return this.membersService.searchMembers(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get member by ID',
    description: 'Retrieve detailed information about a specific member including family and ministry associations.',
  })
  @ApiParam({
    name: 'id',
    description: 'Member UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Member found successfully',
    type: MemberResponse,
  })
  @ApiNotFoundResponse({
    description: 'Member not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Member not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.membersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new member',
    description: 'Register a new church member with their personal information.',
  })
  @ApiResponse({
    status: 201,
    description: 'Member created successfully',
    type: MemberResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['firstName must be a string', 'email must be an email'],
        error: 'Bad Request',
      },
    },
  })
  create(@Body() createMemberDto: CreateMemberDto, @CurrentUser() user?: { email?: string }) {
    return this.membersService.create(createMemberDto as unknown as Record<string, unknown>, user);
  }

  @Post('guest')
  @ApiOperation({
    summary: 'Register guest',
    description: 'Create a visitor record with a simplified payload.',
  })
  registerGuest(@Body() dto: RegisterGuestDto, @CurrentUser() user?: { email?: string }) {
    return this.membersService.registerGuest(dto as unknown as Record<string, unknown>, user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update member',
    description: 'Update an existing member\'s information. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Member UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Member updated successfully',
    type: MemberResponse,
  })
  @ApiNotFoundResponse({
    description: 'Member not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.membersService.update(id, updateMemberDto as unknown as Record<string, unknown>);
  }

  @Patch(':id/convert')
  @ApiOperation({
    summary: 'Convert guest to member',
    description: 'Promote a VISITOR record to a full ACTIVE member.',
  })
  convertGuest(@Param('id', ParseUUIDPipe) id: string) {
    return this.membersService.convertGuestToMember(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deactivate member',
    description: 'Soft delete a member by setting their status to INACTIVE. The record is preserved for historical purposes.',
  })
  @ApiParam({
    name: 'id',
    description: 'Member UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Member deactivated successfully',
    type: MemberResponse,
  })
  @ApiNotFoundResponse({
    description: 'Member not found',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.membersService.remove(id);
  }
}
