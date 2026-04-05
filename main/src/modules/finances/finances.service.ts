import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AccountingService } from './accounting.service';

const PAYMENT_METHOD_ACCOUNT_MAP: Record<string, string> = {
  CASH: '1001',
  BANK_TRANSFER: '1002',
  MOBILE_MONEY: '1003',
  CHECK: '1004',
  CARD: '1005',
};

const CONTRIBUTION_TYPE_ACCOUNT_MAP: Record<string, string> = {
  TITHE: '4001',
  OFFERING: '4002',
  SPECIAL_OFFERING: '4003',
  DONATION: '4004',
  PLEDGE_PAYMENT: '4005',
};

@Injectable()
export class FinancesService {
  constructor(
    private prisma: PrismaService,
    private accountingService: AccountingService,
  ) {}

  async getContributions(params: {
    memberId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.memberId) where.memberId = params.memberId;
    if (params.type) where.type = params.type;
    if (params.startDate || params.endDate) {
      where.date = {};
      if (params.startDate) where.date.gte = new Date(params.startDate);
      if (params.endDate) where.date.lte = new Date(params.endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.contribution.findMany({
        where,
        skip,
        take: limit,
        include: { member: true },
        orderBy: { date: 'desc' },
      }),
      this.prisma.contribution.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async recordContribution(data: any) {
    const assetAccount = await this.accountingService.getAccountByCode(
      PAYMENT_METHOD_ACCOUNT_MAP[data.method ?? 'CASH'],
    );
    const incomeAccount = await this.accountingService.getAccountByCode(
      CONTRIBUTION_TYPE_ACCOUNT_MAP[data.type],
    );

    return this.prisma.$transaction(async (tx) => {
      const transactionDate = new Date(data.date);
      const journalEntry = await tx.finJournalEntry.create({
        data: {
          status: 'POSTED',
          postedAt: new Date(),
          reference: data.reference || `CONTRIB-${Date.now()}`,
          transactionDate,
          metadata: {
            source: 'contribution',
            contributionType: data.type,
            paymentMethod: data.method ?? 'CASH',
          },
          lines: {
            create: [
              { accountId: assetAccount.id, debit: data.amount, credit: 0 },
              { accountId: incomeAccount.id, debit: 0, credit: data.amount },
            ],
          },
        },
      });

      return tx.contribution.create({
        data: {
          ...data,
          method: data.method ?? 'CASH',
          date: transactionDate,
          journalEntryId: journalEntry.id,
        },
        include: {
          member: true,
          journalEntry: { include: { lines: { include: { account: true } } } },
        },
      });
    });
  }

  async getPledges(params?: { memberId?: string; status?: string }) {
    const where: any = {};
    if (params?.memberId) where.memberId = params.memberId;
    if (params?.status) where.status = params.status;

    return this.prisma.pledge.findMany({
      where,
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
    const targetYear = Number(year) || new Date().getFullYear();
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
        acc.total += c.amount;
        acc.byType[c.type] = (acc.byType[c.type] || 0) + c.amount;
        return acc;
      },
      { total: 0, byType: {} as Record<string, number> },
    );

    return { member, year: targetYear, contributions, summary };
  }
}
