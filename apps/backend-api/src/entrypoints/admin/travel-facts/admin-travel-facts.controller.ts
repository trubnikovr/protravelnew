import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiArrayEnvelope,
  ApiEnvelope,
  ApiOkEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import { AdminPermission } from '@modules/admin';
import { TravelFactsService } from '@modules/content';
import { TravelFactApiMapper } from '@entrypoints/common/travel-facts/travel-fact-api.mapper';
import { AdminTravelFactResponseDto } from '@entrypoints/common/travel-facts/travel-fact.response.dto';
import { AdminJwtAuthGuard } from '../auth/admin-jwt-auth.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import {
  CreateTravelFactRequestDto,
  UpdateTravelFactRequestDto,
} from './dto/travel-fact.request.dto';

@ApiTags('admin/travel-facts')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller('admin/travel-facts')
export class AdminTravelFactsController {
  constructor(private readonly facts: TravelFactsService) {}

  /** @see GET /api/v1/admin/travel-facts */
  @Get()
  @RequirePermissions(AdminPermission.CONTENT_READ)
  @ApiOperation({ summary: 'List all travel facts' })
  @ApiArrayEnvelope(AdminTravelFactResponseDto)
  async list() {
    return (await this.facts.listAll()).map((fact) =>
      TravelFactApiMapper.toAdminResponse(fact),
    );
  }

  /** @see POST /api/v1/admin/travel-facts */
  @Post()
  @RequirePermissions(AdminPermission.CONTENT_WRITE)
  @ApiOperation({ summary: 'Create a travel fact' })
  @ApiEnvelope(AdminTravelFactResponseDto, HttpStatus.CREATED)
  async create(@Body() dto: CreateTravelFactRequestDto) {
    return TravelFactApiMapper.toAdminResponse(await this.facts.create(dto));
  }

  /** @see PATCH /api/v1/admin/travel-facts/:id */
  @Patch(':id')
  @RequirePermissions(AdminPermission.CONTENT_WRITE)
  @ApiOperation({ summary: 'Update a travel fact' })
  @ApiOkEnvelope(AdminTravelFactResponseDto)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTravelFactRequestDto,
  ) {
    const fact = await this.facts.update(id, dto);
    if (!fact) this.notFound();
    return TravelFactApiMapper.toAdminResponse(fact);
  }

  /** @see DELETE /api/v1/admin/travel-facts/:id */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(AdminPermission.CONTENT_WRITE)
  @ApiOperation({ summary: 'Delete a travel fact' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    if (!(await this.facts.delete(id))) this.notFound();
  }

  private notFound(): never {
    throw new NotFoundException({
      code: 'TRAVEL_FACT_NOT_FOUND',
      message: 'Travel fact was not found',
    });
  }
}
