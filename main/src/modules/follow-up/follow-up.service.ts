import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FollowUpService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { status?: string; type?: string }) {
    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.type) where.type = params.type;

    return this.prisma.followUp.findMany({
      where,
      include: { member: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.followUp.findUnique({
      where: { id },
      include: { member: true },
    });
  }

  async create(data: any) {
    return this.prisma.followUp.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.followUp.update({ where: { id }, data });
  }

  async complete(id: string, notes?: string) {
    return this.prisma.followUp.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        notes: notes || undefined,
      },
    });
  }
}
