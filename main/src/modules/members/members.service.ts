import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Gender, MaritalStatus, MembershipStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

type MaybeCurrentUser = { email?: string } | undefined;

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  private readonly memberInclude = {
    family: true,
    assembly: {
      include: {
        circuit: {
          include: {
            district: true,
          },
        },
      },
    },
    father: true,
    mother: true,
    spouse: true,
    ministryMemberships: {
      include: {
        ministry: true,
      },
      orderBy: { joinedAt: 'desc' as const },
    },
    positions: {
      include: {
        position: true,
      },
      orderBy: [{ isDefault: 'desc' as const }, { startDate: 'desc' as const }],
    },
  };

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

  private normalizeOptionalArray(value: unknown) {
    if (!Array.isArray(value)) {
      return undefined;
    }

    return [...new Set(value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0))];
  }

  private buildMemberCreateData(
    data: Record<string, unknown>,
    user?: MaybeCurrentUser,
  ): Prisma.MemberUncheckedCreateInput {
    return {
      firstName: String(data.firstName ?? '').trim(),
      lastName: String(data.lastName ?? '').trim(),
      gender: data.gender as Gender | undefined,
      maritalStatus: data.maritalStatus as MaritalStatus | undefined,
      membershipStatus: (data.membershipStatus as MembershipStatus | undefined) ?? MembershipStatus.ACTIVE,
      isHeadOfFamily: Boolean(data.isHeadOfFamily ?? false),
      isBaptized: Boolean(data.isBaptized ?? false),
      middleName: this.normalizeOptionalString(data.middleName),
      email: this.normalizeOptionalString(data.email),
      phone: this.normalizeOptionalString(data.phone),
      address: this.normalizeOptionalString(data.address),
      city: this.normalizeOptionalString(data.city),
      profileImage: this.normalizeOptionalString(data.profileImage),
      familyId: this.normalizeOptionalString(data.familyId),
      assemblyId: this.normalizeOptionalString(data.assemblyId),
      nationality: this.normalizeOptionalString(data.nationality),
      placeOfBirth: this.normalizeOptionalString(data.placeOfBirth),
      fatherName: this.normalizeOptionalString(data.fatherName),
      fatherId: this.normalizeOptionalString(data.fatherId),
      motherName: this.normalizeOptionalString(data.motherName),
      motherId: this.normalizeOptionalString(data.motherId),
      digitalAddress: this.normalizeOptionalString(data.digitalAddress),
      postalAddress: this.normalizeOptionalString(data.postalAddress),
      hometownHouseNo: this.normalizeOptionalString(data.hometownHouseNo),
      hometownPostalAddress: this.normalizeOptionalString(data.hometownPostalAddress),
      hometownTownRegion: this.normalizeOptionalString(data.hometownTownRegion),
      hometownPhone: this.normalizeOptionalString(data.hometownPhone),
      spouseName: this.normalizeOptionalString(data.spouseName),
      spouseId: this.normalizeOptionalString(data.spouseId),
      business: this.normalizeOptionalString(data.business),
      nextOfKinName: this.normalizeOptionalString(data.nextOfKinName),
      nextOfKinAddress: this.normalizeOptionalString(data.nextOfKinAddress),
      nextOfKinCityRegion: this.normalizeOptionalString(data.nextOfKinCityRegion),
      nextOfKinPhone: this.normalizeOptionalString(data.nextOfKinPhone),
      nextOfKinRelationship: this.normalizeOptionalString(data.nextOfKinRelationship),
      emergencyContact: this.normalizeOptionalString(data.emergencyContact),
      emergencyPhone: this.normalizeOptionalString(data.emergencyPhone),
      notes: this.normalizeOptionalString(data.notes),
      recordedBy: user?.email,
      numberOfChildren:
        typeof data.numberOfChildren === 'number' ? data.numberOfChildren : undefined,
      dateOfBirth: this.normalizeOptionalDate(data.dateOfBirth),
      membershipDate: this.normalizeOptionalDate(data.membershipDate),
      baptismDate: this.normalizeOptionalDate(data.baptismDate),
    };
  }

  private buildMemberUpdateData(data: Record<string, unknown>): Prisma.MemberUncheckedUpdateInput {
    return {
      ...(data.firstName !== undefined && {
        firstName: typeof data.firstName === 'string' ? data.firstName.trim() : undefined,
      }),
      ...(data.lastName !== undefined && {
        lastName: typeof data.lastName === 'string' ? data.lastName.trim() : undefined,
      }),
      ...(data.gender !== undefined && { gender: data.gender as Gender | null }),
      ...(data.maritalStatus !== undefined && {
        maritalStatus: (data.maritalStatus as MaritalStatus | undefined) ?? null,
      }),
      ...(data.membershipStatus !== undefined && {
        membershipStatus: data.membershipStatus as MembershipStatus,
      }),
      ...(data.isHeadOfFamily !== undefined && { isHeadOfFamily: Boolean(data.isHeadOfFamily) }),
      ...(data.isBaptized !== undefined && { isBaptized: Boolean(data.isBaptized) }),
      ...(data.numberOfChildren !== undefined && {
        numberOfChildren: typeof data.numberOfChildren === 'number' ? data.numberOfChildren : null,
      }),
      ...(data.middleName !== undefined && {
        middleName: this.normalizeOptionalString(data.middleName) ?? null,
      }),
      ...(data.email !== undefined && { email: this.normalizeOptionalString(data.email) ?? null }),
      ...(data.phone !== undefined && { phone: this.normalizeOptionalString(data.phone) ?? null }),
      ...(data.address !== undefined && {
        address: this.normalizeOptionalString(data.address) ?? null,
      }),
      ...(data.city !== undefined && { city: this.normalizeOptionalString(data.city) ?? null }),
      ...(data.profileImage !== undefined && {
        profileImage: this.normalizeOptionalString(data.profileImage) ?? null,
      }),
      ...(data.familyId !== undefined && {
        familyId: this.normalizeOptionalString(data.familyId) ?? null,
      }),
      ...(data.assemblyId !== undefined && {
        assemblyId: this.normalizeOptionalString(data.assemblyId) ?? null,
      }),
      ...(data.nationality !== undefined && {
        nationality: this.normalizeOptionalString(data.nationality) ?? null,
      }),
      ...(data.placeOfBirth !== undefined && {
        placeOfBirth: this.normalizeOptionalString(data.placeOfBirth) ?? null,
      }),
      ...(data.fatherName !== undefined && {
        fatherName: this.normalizeOptionalString(data.fatherName) ?? null,
      }),
      ...(data.fatherId !== undefined && {
        fatherId: this.normalizeOptionalString(data.fatherId) ?? null,
      }),
      ...(data.motherName !== undefined && {
        motherName: this.normalizeOptionalString(data.motherName) ?? null,
      }),
      ...(data.motherId !== undefined && {
        motherId: this.normalizeOptionalString(data.motherId) ?? null,
      }),
      ...(data.digitalAddress !== undefined && {
        digitalAddress: this.normalizeOptionalString(data.digitalAddress) ?? null,
      }),
      ...(data.postalAddress !== undefined && {
        postalAddress: this.normalizeOptionalString(data.postalAddress) ?? null,
      }),
      ...(data.hometownHouseNo !== undefined && {
        hometownHouseNo: this.normalizeOptionalString(data.hometownHouseNo) ?? null,
      }),
      ...(data.hometownPostalAddress !== undefined && {
        hometownPostalAddress: this.normalizeOptionalString(data.hometownPostalAddress) ?? null,
      }),
      ...(data.hometownTownRegion !== undefined && {
        hometownTownRegion: this.normalizeOptionalString(data.hometownTownRegion) ?? null,
      }),
      ...(data.hometownPhone !== undefined && {
        hometownPhone: this.normalizeOptionalString(data.hometownPhone) ?? null,
      }),
      ...(data.spouseName !== undefined && {
        spouseName: this.normalizeOptionalString(data.spouseName) ?? null,
      }),
      ...(data.spouseId !== undefined && {
        spouseId: this.normalizeOptionalString(data.spouseId) ?? null,
      }),
      ...(data.business !== undefined && {
        business: this.normalizeOptionalString(data.business) ?? null,
      }),
      ...(data.nextOfKinName !== undefined && {
        nextOfKinName: this.normalizeOptionalString(data.nextOfKinName) ?? null,
      }),
      ...(data.nextOfKinAddress !== undefined && {
        nextOfKinAddress: this.normalizeOptionalString(data.nextOfKinAddress) ?? null,
      }),
      ...(data.nextOfKinCityRegion !== undefined && {
        nextOfKinCityRegion: this.normalizeOptionalString(data.nextOfKinCityRegion) ?? null,
      }),
      ...(data.nextOfKinPhone !== undefined && {
        nextOfKinPhone: this.normalizeOptionalString(data.nextOfKinPhone) ?? null,
      }),
      ...(data.nextOfKinRelationship !== undefined && {
        nextOfKinRelationship: this.normalizeOptionalString(data.nextOfKinRelationship) ?? null,
      }),
      ...(data.emergencyContact !== undefined && {
        emergencyContact: this.normalizeOptionalString(data.emergencyContact) ?? null,
      }),
      ...(data.emergencyPhone !== undefined && {
        emergencyPhone: this.normalizeOptionalString(data.emergencyPhone) ?? null,
      }),
      ...(data.notes !== undefined && { notes: this.normalizeOptionalString(data.notes) ?? null }),
      ...(data.dateOfBirth !== undefined && {
        dateOfBirth: this.normalizeOptionalDate(data.dateOfBirth) ?? null,
      }),
      ...(data.membershipDate !== undefined && {
        membershipDate: this.normalizeOptionalDate(data.membershipDate) ?? null,
      }),
      ...(data.baptismDate !== undefined && {
        baptismDate: this.normalizeOptionalDate(data.baptismDate) ?? null,
      }),
    };
  }

  private async syncMinistryMemberships(
    tx: Prisma.TransactionClient,
    memberId: string,
    ministryIds?: string[],
  ) {
    if (!ministryIds) {
      return;
    }

    const existing = await tx.ministryMember.findMany({
      where: { memberId },
      select: { ministryId: true },
    });
    const existingIds = new Set(existing.map((item) => item.ministryId));

    await tx.ministryMember.deleteMany({
      where: {
        memberId,
        ministryId: { notIn: ministryIds.length ? ministryIds : ['__none__'] },
      },
    });

    const newIds = ministryIds.filter((id) => !existingIds.has(id));
    if (newIds.length > 0) {
      await tx.ministryMember.createMany({
        data: newIds.map((ministryId) => ({
          memberId,
          ministryId,
        })),
      });
    }
  }

  private async syncMemberPositions(
    tx: Prisma.TransactionClient,
    memberId: string,
    positionIds?: string[],
    defaultPositionId?: string,
  ) {
    if (!positionIds) {
      return;
    }

    const existing = await tx.memberPosition.findMany({
      where: { memberId },
      select: { positionId: true },
    });
    const existingIds = new Set(existing.map((item) => item.positionId));

    await tx.memberPosition.deleteMany({
      where: {
        memberId,
        positionId: { notIn: positionIds.length ? positionIds : ['__none__'] },
      },
    });

    const newIds = positionIds.filter((id) => !existingIds.has(id));
    if (newIds.length > 0) {
      await tx.memberPosition.createMany({
        data: newIds.map((positionId) => ({
          memberId,
          positionId,
          isDefault: positionId === defaultPositionId,
        })),
      });
    }

    await tx.memberPosition.updateMany({
      where: { memberId },
      data: { isDefault: false },
    });

    if (defaultPositionId && positionIds.includes(defaultPositionId)) {
      await tx.memberPosition.updateMany({
        where: { memberId, positionId: defaultPositionId },
        data: { isDefault: true },
      });
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = Array.isArray(error.meta?.target) ? error.meta.target.join(', ') : 'field';
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

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    ministryId?: string;
    assemblyId?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.MemberWhereInput = {};

    if (params.status) {
      where.membershipStatus = params.status as MembershipStatus;
    }

    if (params.assemblyId) {
      where.assemblyId = params.assemblyId;
    }

    if (params.ministryId) {
      where.ministryMemberships = {
        some: {
          ministryId: params.ministryId,
        },
      };
    }

    if (params.search) {
      where.OR = [
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { phone: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        include: this.memberInclude,
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

  async searchMembers(query?: string) {
    if (!query?.trim()) {
      return [];
    }

    return this.prisma.member.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      include: {
        assembly: {
          include: {
            circuit: {
              include: {
                district: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: this.memberInclude,
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async create(data: Record<string, unknown>, user?: MaybeCurrentUser) {
    const ministryIds = this.normalizeOptionalArray(data.ministryIds);
    const positionIds = this.normalizeOptionalArray(data.positionIds);
    const defaultPositionId = this.normalizeOptionalString(data.defaultPositionId);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const member = await tx.member.create({
          data: this.buildMemberCreateData(data, user),
        });

        await this.syncMinistryMemberships(tx, member.id, ministryIds);
        await this.syncMemberPositions(tx, member.id, positionIds, defaultPositionId);

        return tx.member.findUniqueOrThrow({
          where: { id: member.id },
          include: this.memberInclude,
        });
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async registerGuest(data: Record<string, unknown>, user?: MaybeCurrentUser) {
    return this.create(
      {
        ...data,
        membershipStatus: MembershipStatus.VISITOR,
      },
      user,
    );
  }

  async update(id: string, data: Record<string, unknown>) {
    const ministryIds = this.normalizeOptionalArray(data.ministryIds);
    const positionIds = this.normalizeOptionalArray(data.positionIds);
    const defaultPositionId = this.normalizeOptionalString(data.defaultPositionId);

    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.member.update({
          where: { id },
          data: this.buildMemberUpdateData(data),
        });

        await this.syncMinistryMemberships(tx, id, ministryIds);
        await this.syncMemberPositions(tx, id, positionIds, defaultPositionId);

        return tx.member.findUniqueOrThrow({
          where: { id },
          include: this.memberInclude,
        });
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async convertGuestToMember(id: string) {
    try {
      const member = await this.prisma.member.findUnique({ where: { id } });

      if (!member) {
        throw new NotFoundException('Member not found');
      }

      if (member.membershipStatus !== MembershipStatus.VISITOR) {
        throw new BadRequestException('Only visitors can be converted to full members');
      }

      return await this.prisma.member.update({
        where: { id },
        data: { membershipStatus: MembershipStatus.ACTIVE },
        include: this.memberInclude,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.member.update({
        where: { id },
        data: { membershipStatus: MembershipStatus.INACTIVE },
        include: this.memberInclude,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
}
