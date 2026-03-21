import { ApiProperty, ApiPropertyOptional, PartialType, OmitType } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsBoolean, IsOptional, MinLength } from 'class-validator';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MINISTRY_LEADER = 'MINISTRY_LEADER',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address (used for login)',
    example: 'admin@taccalabash.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'securePassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    default: UserRole.ADMIN,
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'New email address',
    example: 'newemail@taccalabash.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'New password (minimum 6 characters)',
    example: 'newSecurePassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Whether the user account is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UserResponse {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'admin@taccalabash.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  role: UserRole;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: string;
}
