import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where = params.search
      ? {
          OR: [
            { firstName: { contains: params.search, mode: 'insensitive' as const } },
            { lastName: { contains: params.search, mode: 'insensitive' as const } },
            { email: { contains: params.search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastName: 'asc' },
        include: { family: true },
      }),
      this.prisma.member.count({ where }),
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

  async findOne(id: string) {
    return this.prisma.member.findUnique({
      where: { id },
      include: {
        family: { include: { members: true } },
        ministryMemberships: { include: { ministry: true } },
      },
    });
  }

  async create(data: any) {
    return this.prisma.member.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.member.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.member.update({
      where: { id },
      data: { membershipStatus: 'INACTIVE' },
    });
  }
}
