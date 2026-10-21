import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ApiOkEnvelope } from '@core/http/swagger/api-envelope.decorator';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginRequestDto } from './dto/request/admin-login.request.dto';
import { AdminAuthResponseDto } from './dto/response/admin-auth.response.dto';
import { AdminJwtAuthGuard } from './admin-jwt-auth.guard';
import { CurrentAdmin } from '@entrypoints/admin/common/decorators/current-admin.decorator';
import type { AuthenticatedAdmin } from './admin-auth.types';
import { AdminSessionsRevokedResponseDto } from './dto/response/admin-sessions-revoked.response.dto';

@ApiTags('admin/auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly auth: AdminAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Sign in to the administrative API' })
  @ApiOkEnvelope(AdminAuthResponseDto)
  login(@Body() dto: AdminLoginRequestDto) {
    return this.auth.login(dto);
  }

  @Post('revoke-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({
    summary: 'Revoke all access tokens of the current administrator',
  })
  @ApiOkEnvelope(AdminSessionsRevokedResponseDto)
  revokeAll(@CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.auth.revokeAllSessions(admin.id);
  }
}
