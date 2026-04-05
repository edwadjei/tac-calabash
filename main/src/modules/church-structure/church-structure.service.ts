import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateAssemblyDto,
  CreateCircuitDto,
  CreateDistrictDto,
  CreatePositionDto,
  UpdateAssemblyDto,
  UpdateCircuitDto,
  UpdateDistrictDto,
  UpdatePositionDto,
} from './dto';

@Injectable()
export class ChurchStructureService {
  constructor(private prisma: PrismaService) {}

  private readonly districtInclude = {
    headquarterAssembly: true,
    circuits: {
      include: {
        headquarterAssembly: true,
        assemblies: true,
      },
      orderBy: { name: 'asc' as const },
    },
  };

  private readonly assemblyInclude = {
    circuit: {
      include: {
        district: true,
      },
    },
  };

  private normalizeOptionalString(value: unknown) {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('A record with this value already exists');
      }

      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid related record reference');
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('Church structure record not found');
      }
    }

    throw error;
  }

  async getDistricts() {
    return this.prisma.district.findMany({
      include: this.districtInclude,
      orderBy: { name: 'asc' },
    });
  }

  async createDistrict(dto: CreateDistrictDto) {
    try {
      return await this.prisma.district.create({
        data: {
          name: dto.name.trim(),
          headquarterAssemblyId: this.normalizeOptionalString(dto.headquarterAssemblyId),
        },
        include: this.districtInclude,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateDistrict(id: string, dto: UpdateDistrictDto) {
    try {
      return await this.prisma.district.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name.trim() }),
          ...(dto.headquarterAssemblyId !== undefined && {
            headquarterAssemblyId: this.normalizeOptionalString(dto.headquarterAssemblyId) ?? null,
          }),
        },
        include: this.districtInclude,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteDistrict(id: string) {
    try {
      return await this.prisma.district.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getCircuits(districtId?: string) {
    return this.prisma.circuit.findMany({
      where: districtId ? { districtId } : undefined,
      include: {
        district: true,
        headquarterAssembly: true,
        assemblies: true,
      },
      orderBy: [{ district: { name: 'asc' } }, { name: 'asc' }],
    });
  }

  async createCircuit(dto: CreateCircuitDto) {
    try {
      return await this.prisma.circuit.create({
        data: {
          name: dto.name.trim(),
          districtId: dto.districtId,
          headquarterAssemblyId: this.normalizeOptionalString(dto.headquarterAssemblyId),
        },
        include: {
          district: true,
          headquarterAssembly: true,
          assemblies: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateCircuit(id: string, dto: UpdateCircuitDto) {
    try {
      return await this.prisma.circuit.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name.trim() }),
          ...(dto.districtId !== undefined && { districtId: dto.districtId }),
          ...(dto.headquarterAssemblyId !== undefined && {
            headquarterAssemblyId: this.normalizeOptionalString(dto.headquarterAssemblyId) ?? null,
          }),
        },
        include: {
          district: true,
          headquarterAssembly: true,
          assemblies: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteCircuit(id: string) {
    try {
      return await this.prisma.circuit.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getAssemblies(circuitId?: string) {
    return this.prisma.assembly.findMany({
      where: circuitId ? { circuitId } : undefined,
      include: this.assemblyInclude,
      orderBy: [{ circuit: { district: { name: 'asc' } } }, { circuit: { name: 'asc' } }, { name: 'asc' }],
    });
  }

  async createAssembly(dto: CreateAssemblyDto) {
    try {
      return await this.prisma.assembly.create({
        data: {
          name: dto.name.trim(),
          circuitId: dto.circuitId,
        },
        include: this.assemblyInclude,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateAssembly(id: string, dto: UpdateAssemblyDto) {
    try {
      return await this.prisma.assembly.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name.trim() }),
          ...(dto.circuitId !== undefined && { circuitId: dto.circuitId }),
        },
        include: this.assemblyInclude,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteAssembly(id: string) {
    const [districtCount, circuitCount] = await Promise.all([
      this.prisma.district.count({ where: { headquarterAssemblyId: id } }),
      this.prisma.circuit.count({ where: { headquarterAssemblyId: id } }),
    ]);

    if (districtCount > 0 || circuitCount > 0) {
      throw new BadRequestException(
        'This assembly is currently assigned as a headquarters. Reassign the headquarters first.',
      );
    }

    try {
      return await this.prisma.assembly.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getPositions() {
    return this.prisma.position.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createPosition(dto: CreatePositionDto) {
    try {
      return await this.prisma.position.create({
        data: {
          name: dto.name.trim(),
          description: this.normalizeOptionalString(dto.description),
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updatePosition(id: string, dto: UpdatePositionDto) {
    try {
      return await this.prisma.position.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name.trim() }),
          ...(dto.description !== undefined && {
            description: this.normalizeOptionalString(dto.description) ?? null,
          }),
          ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deletePosition(id: string) {
    try {
      return await this.prisma.position.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
}
