import type { Admin } from '@modules/admin';
import type { AdminResponseDto } from '../dto/response/admin.response.dto';

export class AdminApiMapper {
  static toResponse(admin: Admin): AdminResponseDto {
    return {
      id: admin.id.toString(),
      login: admin.login.toString(),
      email: admin.email.toString(),
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      isSuperAdmin: admin.isSuperAdmin,
      permissions: [...admin.permissions],
      status: admin.status,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
    };
  }
}
