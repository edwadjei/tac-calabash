import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Gender, MembershipStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  private normalizeOptionalString(value: unknown) {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private normalizeOptionalDate(value: unknown) {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? new Date(trimmed) : undefined;
  }

  private normalizeMemberCreateInput(
    data: Record<string, unknown>,
  ): Prisma.MemberUncheckedCreateInput {
    return {
      firstName: String(data.firstName ?? '').trim(),
      lastName: String(data.lastName ?? '').trim(),
      gender: data.gender as Gender | undefined,
      isHeadOfFamily: Boolean(data.isHeadOfFamily ?? false),
      middleName: this.normalizeOptionalString(data.middleName),
      email: this.normalizeOptionalString(data.email),
      phone: this.normalizeOptionalString(data.phone),
      address: this.normalizeOptionalString(data.address),
      city: this.normalizeOptionalString(data.city),
      familyId: this.normalizeOptionalString(data.familyId),
      emergencyContact: this.normalizeOptionalString(data.emergencyContact),
      emergencyPhone: this.normalizeOptionalString(data.emergencyPhone),
      notes: this.normalizeOptionalString(data.notes),
      dateOfBirth: this.normalizeOptionalDate(data.dateOfBirth),
      membershipDate: this.normalizeOptionalDate(data.membershipDate),
      baptismDate: this.normalizeOptionalDate(data.baptismDate),
    };
  }

  private normalizeMemberUpdateInput(
    data: Record<string, unknown>,
  ): Prisma.MemberUncheckedUpdateInput {
    return {
      ...(data.firstName !== undefined && {
        firstName: typeof data.firstName === 'string' ? data.firstName.trim() : undefined,
      }),
      ...(data.lastName !== undefined && {
        lastName: typeof data.lastName === 'string' ? data.lastName.trim() : undefined,
      }),
      ...(data.gender !== undefined && { gender: data.gender as Gender }),
      ...(data.isHeadOfFamily !== undefined && { isHeadOfFamily: Boolean(data.isHeadOfFamily) }),
      middleName: this.normalizeOptionalString(data.middleName),
      email: this.normalizeOptionalString(data.email),
      phone: this.normalizeOptionalString(data.phone),
      address: this.normalizeOptionalString(data.address),
      city: this.normalizeOptionalString(data.city),
      familyId: this.normalizeOptionalString(data.familyId),
      emergencyContact: this.normalizeOptionalString(data.emergencyContact),
      emergencyPhone: this.normalizeOptionalString(data.emergencyPhone),
      notes: this.normalizeOptionalString(data.notes),
      dateOfBirth: this.normalizeOptionalDate(data.dateOfBirth),
      membershipDate: this.normalizeOptionalDate(data.membershipDate),
      baptismDate: this.normalizeOptionalDate(data.baptismDate),
      ...(data.membershipStatus !== undefined && {
        membershipStatus: data.membershipStatus as MembershipStatus,
      }),
      ...(data.isBaptized !== undefined && { isBaptized: Boolean(data.isBaptized) }),
    };
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = Array.isArray(error.meta?.target) ? error.meta?.target.join(', ') : 'field';
        throw new ConflictException(`A record with this ${target} already exists`);
      }

      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid related record reference');
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('Member not found');
      }
    }

    throw error;
  }

  async findAll(params: { page?: number; limit?: number; search?: string; status?: string }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) {
      where.membershipStatus = params.status;
    }
    if (params.search) {
      where.OR = [
        { firstName: { contains: params.search, mode: 'insensitive' as const } },
        { lastName: { contains: params.search, mode: 'insensitive' as const } },
        { email: { contains: params.search, mode: 'insensitive' as const } },
      ];
    }

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
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        family: { include: { members: true } },
        ministryMemberships: { include: { ministry: true } },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async create(data: any) {
    try {
      return await this.prisma.member.create({
        data: this.normalizeMemberCreateInput(data),
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(id: string, data: any) {
    try {
      return await this.prisma.member.update({
        where: { id },
        data: this.normalizeMemberUpdateInput(data),
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.member.update({
        where: { id },
        data: { membershipStatus: 'INACTIVE' },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
}
