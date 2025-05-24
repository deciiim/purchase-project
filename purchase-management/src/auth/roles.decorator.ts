import { SetMetadata } from '@nestjs/common';
import { enumRole } from '../users/role.enum'; 

export const Roles = (...roles: enumRole[]) => SetMetadata('roles', roles);
