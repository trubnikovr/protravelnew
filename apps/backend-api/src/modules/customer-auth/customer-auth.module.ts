import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CustomerAuthCustomersBridgeModule } from '@app/integrations/customer-auth-customers/customer-auth-customers-bridge.module';
import { CustomerAuthService } from './application/customer-auth.service';
import { CustomerJwtAuthGuard } from './infrastructure/customer-jwt-auth.guard';
import { CustomerJwtStrategy } from './infrastructure/customer-jwt.strategy';
import { RequestCustomerLoginCodeUseCase } from './application/use-cases/request-customer-login-code.use-case';
import { VerifyCustomerLoginCodeUseCase } from './application/use-cases/verify-customer-login-code.use-case';
import { CUSTOMER_LOGIN_CHALLENGE_REPOSITORY } from './application/customer-login-challenge.repository';
import { CUSTOMER_SMS_SENDER } from './application/customer-sms-sender.port';
import { InMemoryCustomerLoginChallengeRepository } from './infrastructure/in-memory-customer-login-challenge.repository';
import { MockCustomerSmsSender } from './infrastructure/mock-customer-sms.sender';

@Module({
  imports: [
    CustomerAuthCustomersBridgeModule,
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    CustomerAuthService,
    CustomerJwtStrategy,
    CustomerJwtAuthGuard,
    RequestCustomerLoginCodeUseCase,
    VerifyCustomerLoginCodeUseCase,
    {
      provide: CUSTOMER_LOGIN_CHALLENGE_REPOSITORY,
      useClass: InMemoryCustomerLoginChallengeRepository,
    },
    { provide: CUSTOMER_SMS_SENDER, useClass: MockCustomerSmsSender },
  ],
  exports: [
    CustomerAuthService,
    CustomerJwtAuthGuard,
    RequestCustomerLoginCodeUseCase,
    VerifyCustomerLoginCodeUseCase,
  ],
})
export class CustomerAuthModule {}
