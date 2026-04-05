import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChurchStructureService } from './church-structure.service';
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

@ApiTags('Church Structure')
@ApiBearerAuth('access-token')
@Controller('church-structure')
export class ChurchStructureController {
  constructor(private readonly churchStructureService: ChurchStructureService) {}

  @Get('districts')
  @ApiOperation({ summary: 'List districts with nested circuits and assemblies' })
  getDistricts() {
    return this.churchStructureService.getDistricts();
  }

  @Post('districts')
  createDistrict(@Body() dto: CreateDistrictDto) {
    return this.churchStructureService.createDistrict(dto);
  }

  @Patch('districts/:id')
  updateDistrict(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDistrictDto,
  ) {
    return this.churchStructureService.updateDistrict(id, dto);
  }

  @Delete('districts/:id')
  deleteDistrict(@Param('id', ParseUUIDPipe) id: string) {
    return this.churchStructureService.deleteDistrict(id);
  }

  @Get('circuits')
  @ApiQuery({ name: 'districtId', required: false })
  getCircuits(@Query('districtId') districtId?: string) {
    return this.churchStructureService.getCircuits(districtId);
  }

  @Post('circuits')
  createCircuit(@Body() dto: CreateCircuitDto) {
    return this.churchStructureService.createCircuit(dto);
  }

  @Patch('circuits/:id')
  updateCircuit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCircuitDto,
  ) {
    return this.churchStructureService.updateCircuit(id, dto);
  }

  @Delete('circuits/:id')
  deleteCircuit(@Param('id', ParseUUIDPipe) id: string) {
    return this.churchStructureService.deleteCircuit(id);
  }

  @Get('assemblies')
  @ApiQuery({ name: 'circuitId', required: false })
  getAssemblies(@Query('circuitId') circuitId?: string) {
    return this.churchStructureService.getAssemblies(circuitId);
  }

  @Post('assemblies')
  createAssembly(@Body() dto: CreateAssemblyDto) {
    return this.churchStructureService.createAssembly(dto);
  }

  @Patch('assemblies/:id')
  updateAssembly(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAssemblyDto,
  ) {
    return this.churchStructureService.updateAssembly(id, dto);
  }

  @Delete('assemblies/:id')
  deleteAssembly(@Param('id', ParseUUIDPipe) id: string) {
    return this.churchStructureService.deleteAssembly(id);
  }

  @Get('positions')
  getPositions() {
    return this.churchStructureService.getPositions();
  }

  @Post('positions')
  createPosition(@Body() dto: CreatePositionDto) {
    return this.churchStructureService.createPosition(dto);
  }

  @Patch('positions/:id')
  updatePosition(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePositionDto,
  ) {
    return this.churchStructureService.updatePosition(id, dto);
  }

  @Delete('positions/:id')
  deletePosition(@Param('id', ParseUUIDPipe) id: string) {
    return this.churchStructureService.deletePosition(id);
  }
}
