import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import Redis from 'ioredis';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        });
      },
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
