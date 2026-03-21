import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MinistriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ministry.findMany({
      include: { _count: { select: { members: true } } },
    });
  }

  async findOne(id: string) {
    return this.prisma.ministry.findUnique({
      where: { id },
      include: { members: { include: { member: true } } },
    });
  }

  async create(data: any) {
    return this.prisma.ministry.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.ministry.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.ministry.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async addMember(ministryId: string, data: { memberId: string; role?: string }) {
    return this.prisma.ministryMember.create({
      data: { ministryId, memberId: data.memberId, role: data.role as any },
    });
  }

  async removeMember(ministryId: string, memberId: string) {
    return this.prisma.ministryMember.update({
      where: { memberId_ministryId: { memberId, ministryId } },
      data: { isActive: false, leftAt: new Date() },
    });
  }
}
