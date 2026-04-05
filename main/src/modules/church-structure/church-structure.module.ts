import { Module } from '@nestjs/common';
import { ChurchStructureController } from './church-structure.controller';
import { ChurchStructureService } from './church-structure.service';

@Module({
  controllers: [ChurchStructureController],
  providers: [ChurchStructureService],
  exports: [ChurchStructureService],
})
export class ChurchStructureModule {}
