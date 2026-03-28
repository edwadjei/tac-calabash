import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalMembers,
      activeMembers,
      totalMinistries,
      upcomingEvents,
      recentContributions,
    ] = await Promise.all([
      this.prisma.member.count(),
      this.prisma.member.count({ where: { membershipStatus: 'ACTIVE' } }),
      this.prisma.ministry.count({ where: { isActive: true } }),
      this.prisma.event.count({
        where: { startDate: { gte: new Date() } },
      }),
      this.prisma.contribution.aggregate({
        _sum: { amount: true },
        where: {
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return {
      totalMembers,
      activeMembers,
      totalMinistries,
      upcomingEvents,
      monthlyContributions: recentContributions._sum.amount || 0,
    };
  }

  async getMembershipReport(params: { startDate?: string; endDate?: string }) {
    const where: any = {};
    if (params.startDate) {
      where.membershipDate = { gte: new Date(params.startDate) };
    }
    if (params.endDate) {
      where.membershipDate = { ...where.membershipDate, lte: new Date(params.endDate) };
    }

    const [byStatus, byGender, newMembers] = await Promise.all([
      this.prisma.member.groupBy({
        by: ['membershipStatus'],
        _count: true,
      }),
      this.prisma.member.groupBy({
        by: ['gender'],
        _count: true,
      }),
      this.prisma.member.findMany({
        where,
        orderBy: { membershipDate: 'desc' },
        take: 50,
      }),
    ]);

    return { byStatus, byGender, newMembers };
  }

  async getAttendanceReport(params: { startDate?: string; endDate?: string }) {
    const startDate = params.startDate
      ? new Date(params.startDate)
      : new Date(new Date().setMonth(new Date().getMonth() - 3));
    const endDate = params.endDate ? new Date(params.endDate) : new Date();

    const attendance = await this.prisma.attendance.groupBy({
      by: ['date', 'type'],
      where: { date: { gte: startDate, lte: endDate } },
      _count: true,
    });

    return { attendance, startDate, endDate };
  }

  async getFinancialReport(year?: number) {
    const targetYear = Number(year) || new Date().getFullYear();
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31);

    const [byType, byMonth, total] = await Promise.all([
      this.prisma.contribution.groupBy({
        by: ['type'],
        where: { date: { gte: startDate, lte: endDate } },
        _sum: { amount: true },
      }),
      this.prisma.$queryRaw`
        SELECT
          EXTRACT(MONTH FROM date) as month,
          SUM(amount) as total
        FROM contributions
        WHERE date >= ${startDate} AND date <= ${endDate}
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `,
      this.prisma.contribution.aggregate({
        where: { date: { gte: startDate, lte: endDate } },
        _sum: { amount: true },
      }),
    ]);

    return { year: targetYear, byType, byMonth, total: total._sum.amount || 0 };
  }
}
