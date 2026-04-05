import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateFinAccountDto,
  UpdateFinAccountDto,
  FinAccountQueryDto,
  CreateFinJournalEntryDto,
  UpdateFinJournalEntryDto,
  FinJournalEntryQueryDto,
  CreateFinJournalEntryLineDto,
} from './dto';

const CODE_PREFIX: Record<string, number> = {
  ASSET: 1000,
  LIABILITY: 2000,
  EQUITY: 3000,
  INCOME: 4000,
  EXPENSE: 5000,
};

const DEFAULT_ACCOUNTS = [
  { code: '1001', name: 'Cash', accountType: 'ASSET' },
  { code: '1002', name: 'Bank', accountType: 'ASSET' },
  { code: '1003', name: 'Mobile Money', accountType: 'ASSET' },
  { code: '1004', name: 'Cheque', accountType: 'ASSET' },
  { code: '1005', name: 'Card', accountType: 'ASSET' },
  { code: '4001', name: 'Tithe Income', accountType: 'INCOME' },
  { code: '4002', name: 'Offering Income', accountType: 'INCOME' },
  { code: '4003', name: 'Special Offering Income', accountType: 'INCOME' },
  { code: '4004', name: 'Donation Income', accountType: 'INCOME' },
  { code: '4005', name: 'Pledge Payment Income', accountType: 'INCOME' },
] as const;

@Injectable()
export class AccountingService {
  constructor(private prisma: PrismaService) {}

  async seedDefaultAccounts() {
    await Promise.all(
      DEFAULT_ACCOUNTS.map((account) =>
        this.prisma.finAccount.upsert({
          where: { code: account.code },
          update: {
            name: account.name,
            accountType: account.accountType,
            isGroup: false,
            isContra: false,
          },
          create: {
            code: account.code,
            name: account.name,
            accountType: account.accountType,
            isGroup: false,
            isContra: false,
          },
        }),
      ),
    );
  }

  async getAccountByCode(code: string) {
    const account = await this.prisma.finAccount.findUnique({
      where: { code },
    });

    if (!account) {
      throw new NotFoundException(`Account with code ${code} not found`);
    }

    if (account.isGroup) {
      throw new BadRequestException(`Account ${account.code} cannot be used for postings`);
    }

    return account;
  }

  private async generateFinAccountCode(accountType: string): Promise<string> {
    const prefix = CODE_PREFIX[accountType];
    const lastAccount = await this.prisma.finAccount.findFirst({
      where: { accountType: accountType as never },
      orderBy: { code: 'desc' },
    });
    if (!lastAccount) return String(prefix + 1);
    return String(Number(lastAccount.code) + 1);
  }

  async createFinAccount(dto: CreateFinAccountDto) {
    if (dto.isGroup && dto.parentAccountId) {
      throw new BadRequestException('Group accounts cannot have a parent account');
    }

    if (dto.parentAccountId) {
      const parent = await this.prisma.finAccount.findUnique({
        where: { id: dto.parentAccountId },
      });
      if (!parent) {
        throw new NotFoundException('Parent account not found');
      }
      if (!parent.isGroup) {
        throw new BadRequestException('Parent account must be a group account');
      }
    }

    const code = await this.generateFinAccountCode(dto.accountType);

    return this.prisma.finAccount.create({
      data: {
        code,
        name: dto.name,
        description: dto.description,
        accountType: dto.accountType,
        isGroup: dto.isGroup ?? false,
        isContra: dto.isContra ?? false,
        parentAccountId: dto.parentAccountId,
      },
      include: { parentAccount: true, childAccounts: true },
    });
  }

  async getFinAccounts(query: FinAccountQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.accountType) where.accountType = query.accountType;
    if (query.isGroup !== undefined) where.isGroup = query.isGroup;
    if (query.isContra !== undefined) where.isContra = query.isContra;
    if (query.parentAccountId) where.parentAccountId = query.parentAccountId;

    return this.prisma.finAccount.findMany({
      where,
      include: { parentAccount: true, childAccounts: true },
      orderBy: { code: 'asc' },
    });
  }

  async getFinAccount(id: string) {
    const account = await this.prisma.finAccount.findUnique({
      where: { id },
      include: { parentAccount: true, childAccounts: true },
    });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async updateFinAccount(id: string, dto: UpdateFinAccountDto) {
    const account = await this.prisma.finAccount.findUnique({ where: { id } });
    if (!account) throw new NotFoundException('Account not found');

    return this.prisma.finAccount.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
      include: { parentAccount: true, childAccounts: true },
    });
  }

  async deleteFinAccount(id: string) {
    const account = await this.prisma.finAccount.findUnique({
      where: { id },
      include: { childAccounts: { take: 1 }, journalLines: { take: 1 } },
    });
    if (!account) throw new NotFoundException('Account not found');

    if (account.childAccounts.length > 0) {
      throw new BadRequestException('Cannot delete a group account that has child accounts');
    }
    if (account.journalLines.length > 0) {
      throw new BadRequestException('Cannot delete an account that has journal entry lines');
    }

    await this.prisma.finAccount.delete({ where: { id } });
    return { message: 'Account deleted successfully' };
  }

  private validateLineBalance(lines: CreateFinJournalEntryLineDto[]) {
    const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0);
    if (totalDebit !== totalCredit) {
      throw new BadRequestException(
        `Debit and credit totals must be equal. Debits: ${totalDebit}, Credits: ${totalCredit}`,
      );
    }
  }

  private async validateLineAccounts(lines: CreateFinJournalEntryLineDto[]) {
    const accountIds = [...new Set(lines.map((line) => line.accountId))];
    const accounts = await this.prisma.finAccount.findMany({
      where: { id: { in: accountIds } },
    });

    if (accounts.length !== accountIds.length) {
      const found = new Set(accounts.map((account) => account.id));
      const missing = accountIds.filter((id) => !found.has(id));
      throw new BadRequestException(`Accounts not found: ${missing.join(', ')}`);
    }

    const groupAccounts = accounts.filter((account) => account.isGroup);
    if (groupAccounts.length > 0) {
      throw new BadRequestException(
        `Cannot post to group accounts: ${groupAccounts.map((account) => account.name).join(', ')}`,
      );
    }
  }

  async createFinJournalEntry(dto: CreateFinJournalEntryDto) {
    this.validateLineBalance(dto.lines);
    await this.validateLineAccounts(dto.lines);

    return this.prisma.finJournalEntry.create({
      data: {
        status: 'DRAFT',
        reference: dto.reference,
        transactionDate: new Date(dto.transactionDate),
        metadata: (dto.metadata as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        lines: {
          create: dto.lines.map((line) => ({
            accountId: line.accountId,
            debit: line.debit,
            credit: line.credit,
            notes: line.notes,
          })),
        },
      },
      include: { lines: { include: { account: true } } },
    });
  }

  async getFinJournalEntries(query: FinJournalEntryQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.startDate || query.endDate) {
      where.transactionDate = {};
      if (query.startDate) {
        (where.transactionDate as Record<string, Date>).gte = new Date(query.startDate);
      }
      if (query.endDate) {
        (where.transactionDate as Record<string, Date>).lte = new Date(query.endDate);
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.finJournalEntry.findMany({
        where,
        skip,
        take: limit,
        include: { lines: { include: { account: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.finJournalEntry.count({ where }),
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

  async getFinJournalEntry(id: string) {
    const entry = await this.prisma.finJournalEntry.findUnique({
      where: { id },
      include: { lines: { include: { account: true } } },
    });
    if (!entry) throw new NotFoundException('Journal entry not found');
    return entry;
  }

  async updateFinJournalEntry(id: string, dto: UpdateFinJournalEntryDto) {
    const entry = await this.prisma.finJournalEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Journal entry not found');
    if (entry.status === 'POSTED') {
      throw new BadRequestException('Cannot update a posted journal entry');
    }

    if (dto.lines) {
      this.validateLineBalance(dto.lines);
      await this.validateLineAccounts(dto.lines);
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.lines) {
        await tx.finJournalEntryLine.deleteMany({ where: { journalEntryId: id } });
        await tx.finJournalEntryLine.createMany({
          data: dto.lines.map((line) => ({
            journalEntryId: id,
            accountId: line.accountId,
            debit: line.debit,
            credit: line.credit,
            notes: line.notes,
          })),
        });
      }

      return tx.finJournalEntry.update({
        where: { id },
        data: {
          ...(dto.reference !== undefined && { reference: dto.reference }),
          ...(dto.transactionDate && { transactionDate: new Date(dto.transactionDate) }),
          ...(dto.metadata !== undefined && { metadata: dto.metadata as Prisma.InputJsonValue }),
        },
        include: { lines: { include: { account: true } } },
      });
    });
  }

  async postFinJournalEntry(id: string) {
    const entry = await this.prisma.finJournalEntry.findUnique({
      where: { id },
      include: { lines: true },
    });
    if (!entry) throw new NotFoundException('Journal entry not found');
    if (entry.status === 'POSTED') {
      throw new BadRequestException('Journal entry is already posted');
    }

    const totalDebit = entry.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = entry.lines.reduce((sum, line) => sum + line.credit, 0);
    if (totalDebit !== totalCredit) {
      throw new BadRequestException('Cannot post: debit and credit totals are not equal');
    }

    return this.prisma.finJournalEntry.update({
      where: { id },
      data: { status: 'POSTED', postedAt: new Date() },
      include: { lines: { include: { account: true } } },
    });
  }

  async deleteFinJournalEntry(id: string) {
    const entry = await this.prisma.finJournalEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Journal entry not found');
    if (entry.status === 'POSTED') {
      throw new BadRequestException('Cannot delete a posted journal entry');
    }

    await this.prisma.finJournalEntry.delete({ where: { id } });
    return { message: 'Journal entry deleted successfully' };
  }
}
