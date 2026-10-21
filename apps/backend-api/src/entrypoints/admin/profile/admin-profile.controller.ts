import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkEnvelope } from '@core/http/swagger/api-envelope.decorator';
import { AdminService } from '@modules/admin';
import { AdminJwtAuthGuard } from '@entrypoints/admin/auth/admin-jwt-auth.guard';
import type { AuthenticatedAdmin } from '../auth/admin-auth.types';
import { CurrentAdmin } from '@entrypoints/admin/common/decorators/current-admin.decorator';
import { AdminResponseDto } from '@entrypoints/admin/common/dto/response/admin.response.dto';
import { AdminApiMapper } from '@entrypoints/admin/common/mappers/admin-api.mapper';

@ApiTags('admin/profile')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard)
@Controller('admin/me')
export class AdminProfileController {
  constructor(private readonly admins: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Get current administrator profile' })
  @ApiOkEnvelope(AdminResponseDto)
  async me(
    @CurrentAdmin() current: AuthenticatedAdmin,
  ): Promise<AdminResponseDto> {
    const admin = await this.admins.findById(current.id);
    if (!admin) {
      throw new NotFoundException({
        code: 'ADMIN_NOT_FOUND',
        message: 'Administrator not found',
      });
    }
    return AdminApiMapper.toResponse(admin);
  }
}
