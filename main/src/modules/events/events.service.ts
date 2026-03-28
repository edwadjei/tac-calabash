import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { start?: string; end?: string; ministryId?: string; category?: string }) {
    const where: any = {};
    if (params.start) {
      where.startDate = { gte: new Date(params.start) };
    }
    if (params.end) {
      where.startDate = { ...where.startDate, lte: new Date(params.end) };
    }
    if (params.ministryId) {
      where.ministryId = params.ministryId;
    }
    if (params.category) {
      where.category = params.category;
    }
    return this.prisma.event.findMany({
      where,
      include: { ministry: true },
      orderBy: { startDate: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: { ministry: true },
    });
  }

  async create(data: any) {
    return this.prisma.event.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.event.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.event.delete({ where: { id } });
  }
}
