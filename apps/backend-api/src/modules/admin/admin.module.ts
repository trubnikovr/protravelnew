import { Module } from '@nestjs/common';
import { AdminService } from './application/admin.service';
import { ADMIN_REPOSITORY } from './application/admin.repository';
import { DrizzleAdminRepository } from './infrastructure/persistence/drizzle-admin.repository';

@Module({
  providers: [
    AdminService,
    { provide: ADMIN_REPOSITORY, useClass: DrizzleAdminRepository },
  ],
  exports: [AdminService],
})
export class AdminModule {}
