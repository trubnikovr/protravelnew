import { Module } from '@nestjs/common';
import { CustomerAuthModule } from '@modules/customer-auth';
import { CustomerAuthController } from './customer-auth.controller';

@Module({
  imports: [CustomerAuthModule],
  controllers: [CustomerAuthController],
})
export class CustomerAuthEntrypointModule {}
