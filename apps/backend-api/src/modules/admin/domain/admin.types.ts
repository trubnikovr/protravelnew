export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  CONTENT_MANAGER = 'content_manager',
  SUPPORT_MANAGER = 'support_manager',
  FINANCE_MANAGER = 'finance_manager',
}

export enum AdminStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

export enum AdminPermission {
  ADMINS_READ = 'admins.read',
  ADMINS_WRITE = 'admins.write',
  USERS_READ = 'users.read',
  USERS_WRITE = 'users.write',
  CONTENT_READ = 'content.read',
  CONTENT_WRITE = 'content.write',
  ORDERS_READ = 'orders.read',
  ORDERS_WRITE = 'orders.write',
  PAYMENTS_READ = 'payments.read',
  PAYMENTS_REFUND = 'payments.refund',
  SUPPORT_READ = 'support.read',
  SUPPORT_WRITE = 'support.write',
  TOURS_READ = 'tours.read',
  TOURS_WRITE = 'tours.write',
}
