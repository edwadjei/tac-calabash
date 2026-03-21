import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { date?: string; type?: string }) {
    const where: any = {};
    if (params.date) {
      where.date = new Date(params.date);
    }
    if (params.type) {
      where.type = params.type;
    }
    return this.prisma.attendance.findMany({
      where,
      include: { member: true },
      orderBy: { date: 'desc' },
    });
  }

  async record(data: any) {
    return this.prisma.attendance.create({ data });
  }

  async recordBulk(data: { date: string; type: string; memberIds: string[] }) {
    const records = data.memberIds.map((memberId) => ({
      memberId,
      date: new Date(data.date),
      type: data.type as any,
      isPresent: true,
    }));
    return this.prisma.attendance.createMany({ data: records });
  }
}
