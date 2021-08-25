import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Role } from 'src/auth/interfaces/role';

export const ROLE_KEY = 'role';
export const Roles = (role: Role): CustomDecorator<string> => SetMetadata(ROLE_KEY, role);
