import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Reflector } from '@nestjs/core';
  import * as dotenv from 'dotenv';
  import { AuthService } from '../auth.service';
  dotenv.config();
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private authService: AuthService,
      private reflector: Reflector,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.get<boolean>(
        'isPublic',
        context.getHandler(),
      );
      if (isPublic) {
        return true; // Skip authentication for public routes
      }
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('Token not provided');
      }
      const isBlacklisted = await this.authService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been blacklisted');
      }
  
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET,
      });
      request['user'] = payload;
      return true;
    }
  
    private extractTokenFromHeader(request: any): string | null {
      const authorizationHeader =
        request.headers['authorization'] || request.headers['Authorization'];
      if (authorizationHeader) {
        // Authorization header is typically in the format "Bearer <token>"
        const [type, token] = authorizationHeader.split(' ');
        if (type === 'Bearer' && token) {
          return token;
        }
      }
      return null;
    }
  }
  