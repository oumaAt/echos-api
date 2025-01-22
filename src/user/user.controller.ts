import {
    Body,
    ConflictException,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { AuthGuard } from 'src/auth/guards/auth.guard';
  
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @UseGuards(AuthGuard)
    @Post('create')
    async create(@Body() createUserDto: CreateUserDto) {
      const user = await this.userService.findByUsername(createUserDto.username);
      if (user) throw new ConflictException('Username already taken ');
      return this.userService.create(createUserDto);
    }
  }
  