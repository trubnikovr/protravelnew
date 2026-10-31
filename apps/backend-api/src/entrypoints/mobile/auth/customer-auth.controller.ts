import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import {
  CustomerAuthService,
  RequestCustomerLoginCodeUseCase,
  VerifyCustomerLoginCodeUseCase,
} from '@modules/customer-auth';
import {
  ApiEnvelope,
  ApiOkEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import { CustomerLoginRequestDto } from './dto/request/customer-login.request.dto';
import { RefreshCustomerTokenRequestDto } from './dto/request/refresh-customer-token.request.dto';
import { VerifyCustomerLoginRequestDto } from './dto/request/verify-customer-login.request.dto';
import {
  CustomerAuthSessionResponseDto,
  CustomerLoginChallengeResponseDto,
} from './dto/response/customer-auth.response.dto';

@ApiTags('customer/auth')
@Controller('auth')
export class CustomerAuthController {
  constructor(
    private readonly requestCode: RequestCustomerLoginCodeUseCase,
    private readonly verifyCode: VerifyCustomerLoginCodeUseCase,
    private readonly auth: CustomerAuthService,
  ) {}

  /** @see POST /api/v1/auth/login */
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Request a customer login SMS code' })
  @ApiEnvelope(CustomerLoginChallengeResponseDto, HttpStatus.ACCEPTED)
  login(@Body() dto: CustomerLoginRequestDto) {
    return this.requestCode.execute(dto.phone);
  }

  /** @see POST /api/v1/auth/verify */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Verify customer login code and create a session' })
  @ApiOkEnvelope(CustomerAuthSessionResponseDto)
  verify(@Body() dto: VerifyCustomerLoginRequestDto) {
    return this.verifyCode.execute(dto.verificationId, dto.code);
  }

  /** @see POST /api/v1/auth/refresh */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate customer access and refresh tokens' })
  @ApiOkEnvelope(CustomerAuthSessionResponseDto)
  refresh(@Body() dto: RefreshCustomerTokenRequestDto) {
    return this.auth.refresh(dto.refreshToken);
  }
}
