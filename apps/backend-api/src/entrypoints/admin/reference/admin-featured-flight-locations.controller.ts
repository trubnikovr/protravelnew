import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiArrayEnvelope } from '@core/http/swagger/api-envelope.decorator';
import { ReferenceService } from '@core/submodules/reference';
import { AdminPermission } from '@modules/admin';
import {
  FeaturedFlightLocationRequestDto,
  FeaturedFlightLocationResponseDto,
} from '@entrypoints/common/reference/featured-flight-location.dto';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@ApiTags('admin/featured-flight-locations')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller('admin/featured-flight-locations')
export class AdminFeaturedFlightLocationsController {
  constructor(private readonly reference: ReferenceService) {}

  /** @see GET /api/v1/admin/featured-flight-locations */
  @Get()
  @RequirePermissions(AdminPermission.CONTENT_READ)
  @ApiArrayEnvelope(FeaturedFlightLocationResponseDto)
  list() {
    return this.reference.listFeaturedFlightLocations(true);
  }

  /** @see PUT /api/v1/admin/featured-flight-locations */
  @Put()
  @RequirePermissions(AdminPermission.CONTENT_WRITE)
  @ApiOperation({ summary: 'Replace mobile featured flight locations' })
  @ApiBody({ type: FeaturedFlightLocationRequestDto, isArray: true })
  @ApiArrayEnvelope(FeaturedFlightLocationResponseDto)
  replace(@Body() items: FeaturedFlightLocationRequestDto[]) {
    return this.reference.replaceFeaturedFlightLocations(items.slice(0, 30));
  }
}
