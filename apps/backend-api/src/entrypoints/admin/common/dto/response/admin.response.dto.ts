import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminPermission, AdminRole, AdminStatus } from '@modules/admin';
import { EntityResponseDto } from '@entrypoints/common/dto/response/entity.response.dto';

export class AdminResponseDto extends EntityResponseDto {
  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty({ example: 'admin' })
  login!: string;

  @ApiProperty()
  firstName!: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  lastName!: string | null;

  @ApiProperty({ enum: AdminRole })
  role!: AdminRole;

  @ApiProperty({
    description: 'Whether this is the single unrestricted administrator',
  })
  isSuperAdmin!: boolean;

  @ApiProperty({ enum: AdminPermission, isArray: true })
  permissions!: AdminPermission[];

  @ApiProperty({ enum: AdminStatus })
  status!: AdminStatus;
}
