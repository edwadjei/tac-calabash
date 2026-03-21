import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FinancesService {
  constructor(private prisma: PrismaService) {}

  async getContributions(params: {
    memberId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = {};
    if (params.memberId) where.memberId = params.memberId;
    if (params.type) where.type = params.type;
    if (params.startDate || params.endDate) {
      where.date = {};
      if (params.startDate) where.date.gte = new Date(params.startDate);
      if (params.endDate) where.date.lte = new Date(params.endDate);
    }

    return this.prisma.contribution.findMany({
      where,
      include: { member: true },
      orderBy: { date: 'desc' },
    });
  }

  async recordContribution(data: any) {
    return this.prisma.contribution.create({
      data: { ...data, date: new Date(data.date) },
    });
  }

  async getPledges(memberId?: string) {
    return this.prisma.pledge.findMany({
      where: memberId ? { memberId } : {},
      include: { member: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPledge(data: any) {
    return this.prisma.pledge.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
  }

  async updatePledge(id: string, data: any) {
    return this.prisma.pledge.update({ where: { id }, data });
  }

  async getStatement(memberId: string, year?: number) {
    const targetYear = year || new Date().getFullYear();
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31);

    const contributions = await this.prisma.contribution.findMany({
      where: {
        memberId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'asc' },
    });

    const member = await this.prisma.member.findUnique({ where: { id: memberId } });

    const summary = contributions.reduce(
      (acc, c) => {
        acc.total += Number(c.amount);
        acc.byType[c.type] = (acc.byType[c.type] || 0) + Number(c.amount);
        return acc;
      },
      { total: 0, byType: {} as Record<string, number> },
    );

    return { member, year: targetYear, contributions, summary };
  }
}
