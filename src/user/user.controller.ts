import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/utils/enum';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { ByIdDto } from './dto/by-id.dto';

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
    console.log(req.user);
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

  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(@Param() params: ByIdDto, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.update(params.id, updateUserDto);
      return { data: user };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new HttpException(
        "Erreur lors de l update de l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param() params: ByIdDto) {
    try {
      await this.userService.delete(params.id);
      return { message: 'Deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new HttpException(
        "Erreur lors de la suppression de l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Post('')
  @Roles(Role.ADMIN)
  async getFilteredUsers(
    @Body('filters') filters: Record<string, any>,
    @Body('sort')
    sort: { field: string; order: 'asc' | 'desc' },
  ) {
    try {
      const parsedFilters = filters || {};
      const parsedSort = sort || { field: 'id', order: 'asc' };
      const users = await this.userService.findAll(parsedFilters, parsedSort);
      return { data: users };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Erreur lors de la suppression de l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
