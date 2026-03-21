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
  ApiForbiddenResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponse } from './dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing authentication token',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all admin/staff users. Requires ADMIN or SUPER_ADMIN role.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: [UserResponse],
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Insufficient permissions',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve details of a specific user.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: UserResponse,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({
    summary: 'Create new user',
    description: 'Create a new admin/staff user account. Requires ADMIN or SUPER_ADMIN role.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiConflictResponse({
    description: 'Email already exists',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Insufficient permissions',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({
    summary: 'Update user',
    description: 'Update an existing user\'s details. Requires ADMIN or SUPER_ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponse,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Insufficient permissions',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Permanently delete a user account. Requires SUPER_ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Requires SUPER_ADMIN role',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
