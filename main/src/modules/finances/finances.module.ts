import { Module, OnModuleInit } from '@nestjs/common';
import { FinancesController } from './finances.controller';
import { FinancesService } from './finances.service';
import { AccountingController } from './accounting.controller';
import { AccountingService } from './accounting.service';

@Module({
  controllers: [FinancesController, AccountingController],
  providers: [FinancesService, AccountingService],
  exports: [FinancesService, AccountingService],
})
export class FinancesModule implements OnModuleInit {
  constructor(private readonly accountingService: AccountingService) {}

  async onModuleInit() {
    await this.accountingService.seedDefaultAccounts();
  }
}
