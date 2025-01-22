import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    try {
      const user = await this.userService.findById(req.user.id);
      return { data: user };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erreur lors de la récuperation des informations de mon profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    console.log(req.user)
    try {
      return {
        data: await this.userService.update(req.user.id, updateUserDto),
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erreur lors de l update de mon profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
