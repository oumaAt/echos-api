import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisModule.forRoot({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    }),
  ],
  providers: [UserService, AuthService],
  controllers: [UserController],
})
export class UserModule {}
