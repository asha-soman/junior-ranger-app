import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Array<'admin' | 'ranger' | 'junior_ranger'>) =>
  SetMetadata(ROLES_KEY, roles);