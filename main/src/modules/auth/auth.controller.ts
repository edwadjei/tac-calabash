import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import {
  LoginDto,
  RefreshTokenDto,
  LogoutDto,
  LoginResponse,
  RefreshResponse,
  LogoutResponse,
} from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate a user with email and password. Returns access and refresh tokens.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns access token, refresh token, and user details.',
    type: LoginResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email', 'password must be at least 6 characters'],
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  async login(@Request() req: any): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Exchange a valid refresh token for a new access token.',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: RefreshResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid refresh token',
        error: 'Unauthorized',
      },
    },
  })
  async refresh(@Body() dto: RefreshTokenDto): Promise<RefreshResponse> {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'User logout',
    description: 'Invalidate the refresh token to log out the user.',
  })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    type: LogoutResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing authentication token',
  })
  async logout(@Body() dto: LogoutDto): Promise<LogoutResponse> {
    return this.authService.logout(dto.refreshToken);
  }
}
