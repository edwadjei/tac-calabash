import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const token = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
      },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: { token, userId, expiresAt },
    });

    return token;
  }

  async refreshToken(token: string) {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { email: refreshToken.user.email, sub: refreshToken.user.id, role: refreshToken.user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async logout(token: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token } });
    return { message: 'Logged out successfully' };
  }
}
