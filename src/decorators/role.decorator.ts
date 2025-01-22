import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/utils/enum';

export const Roles_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(Roles_KEY, roles);
