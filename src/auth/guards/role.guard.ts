import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true; // No roles required for this route
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      if (!roles.includes(user?.role)) {
        throw new ForbiddenException(
          'You are not authorized to access this resource.',
        );
      }
      return true;
    }
  }
  