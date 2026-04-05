import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MembersModule } from './modules/members/members.module';
import { MinistriesModule } from './modules/ministries/ministries.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { EventsModule } from './modules/events/events.module';
import { FinancesModule } from './modules/finances/finances.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { FollowUpModule } from './modules/follow-up/follow-up.module';
import { ChurchStructureModule } from './modules/church-structure/church-structure.module';

// Database
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Scheduled tasks
    ScheduleModule.forRoot(),

    // Database
    DatabaseModule,

    // Feature modules
    AuthModule,
    UsersModule,
    MembersModule,
    MinistriesModule,
    AttendanceModule,
    EventsModule,
    FinancesModule,
    NotificationsModule,
    ReportsModule,
    FollowUpModule,
    ChurchStructureModule,
  ],
})
export class AppModule {}
