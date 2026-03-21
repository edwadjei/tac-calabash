import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    });
  }

  async create(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    });
  }

  async update(id: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
