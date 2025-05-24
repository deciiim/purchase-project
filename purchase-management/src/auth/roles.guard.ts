import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { enumRole } from '../users/role.enum';
import { Observable } from 'rxjs';  

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
   
    const requiredRoles = this.reflector.get<enumRole[]>('roles', context.getHandler());


    if (!requiredRoles) {
      return true;
    }

   
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('User role:', user.role);  
    console.log('Required roles:', requiredRoles);  


    return requiredRoles.includes(user.role); 
  }
}
