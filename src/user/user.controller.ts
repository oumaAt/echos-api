import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @ApiOperation({
    summary: 'Créer un nouvel utilisateur',
    description:
      'Crée un nouveau compte utilisateur avec les informations fournies.',
  })
  @ApiOkResponse({ description: 'Utilisateur créé avec succès' })
  @ApiBadRequestResponse({ description: "Données d'entrée invalides" })
  @ApiConflictResponse({ description: 'Le pseudonyme existe déjà' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.findByUsername(
        createUserDto.username,
      );
      if (user) throw new ConflictException('Username already taken ');
      return this.userService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      Logger.error(error);
      throw new HttpException(
        "Erreur lors de l'ajout d'un nouveau de mon profile",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Récuperer des informations de l'utilisateur courant",
    description: "Récuperation des informations de l\'utilisateur courant",
  })
  @ApiOkResponse({
    description: 'Les données récupérées avec succès',
    schema: {
      example: {
        user: {
          username: 'Johndoe',
          name: 'John Doe',
          role: 'user',
          address: 'Paris,France',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Vous devez vous connecter',
  })
  @ApiInternalServerErrorResponse({
    description:
      "Erreur survenue lors de la récuperation des données de l'utilisateur courant",
  })
  async getCurrentUser(@Req() req: any) {
    try {
      const user = await this.userService.findById(req.user.id);
      return { data: user };
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        'Erreur lors de la récuperation des informations de mon profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Modifier les informations de l'utilisateur courant",
    description: "Modifier des informations de l\'utilisateur courant",
  })
  @ApiOkResponse({
    description: 'Profile mis à jour avec succès',
    schema: {
      example: {
        user: {
          username: 'Johndoe',
          name: 'John Doe',
          role: 'user',
          address: 'Paris,France',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Vous devez vous connecter',
  })
  @ApiInternalServerErrorResponse({
    description:
      "Erreur survenue lors de la modification des données de l'utilisateur courant",
  })
  async updateCurrentUser(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(req.user);
    try {
      return {
        user: await this.userService.update(req.user.id, updateUserDto),
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        'Erreur lors de l update de mon profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Modifier les informations d'un utilisateur par son id ",
    description:
      "Seuls les admins sont autorisés à modifier les données d'un utilisateur par son id",
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Identifiant unique de l\'utilisateur à modifier',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Utilisateur mis à jour avec succès',
    schema: {
      example: {
        user: {
          username: 'Johndoe',
          name: 'John Doe',
          role: 'user',
          address: 'Nantes,France',
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: "Vous n'etes pas autorisé à effectuer cette action",
  })
  @ApiUnauthorizedResponse({
    description: 'Vous devez vous connecter',
  })
  @ApiNotFoundResponse({
    description: 'Cet id ne correspond à aucun utilisateur',
  })
  @ApiInternalServerErrorResponse({
    description:
      "Erreur survenue lors de la modification des données de l'utilisateur",
  })
  async update(@Param() params: ByIdDto, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.update(params.id, updateUserDto);
      return { data: user };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      Logger.error(error);
      throw new HttpException(
        "Erreur lors de l update de l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Supprimer un utilisateur par son id ',
    description:
      'Seuls les admins sont autorisés à supprimer un utilisateur par son id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Identifiant unique de l\'utilisateur à supprimer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Utilisateur supprimé avec succès',
  })
  @ApiForbiddenResponse({
    description: "Vous n'etes pas autorisé à effectuer cette action",
  })
  @ApiUnauthorizedResponse({
    description: 'Vous devez vous connecter',
  })
  @ApiNotFoundResponse({
    description: 'Cet id ne correspond à aucun utilisateur',
  })
  @ApiInternalServerErrorResponse({
    description: "Erreur survenue lors de la suppression d'un utilisateur",
  })
  async delete(@Param() params: ByIdDto) {
    try {
      await this.userService.delete(params.id);
      return { message: 'Deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      Logger.error(error);
      throw new HttpException(
        "Erreur lors de la suppression de l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Post('')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Récuperer la liste des utilisateurs',
    description:
      'Seuls les admins sont autorisés à récuperer la liste des utilisateurs avec options de tri et filtrage par tous les champs',
  })
  @ApiBody({
    description: 'Filtres et options de tri',
    schema: {
      type: 'object',
      properties: {
        filters: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
          example: { name: 'John Doe', role: 'admin' },
          description: 'Filtres à appliquer aux utilisateurs',
        },
        sort: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              example: 'name',
              description: 'Champ pour le tri',
            },
            order: {
              type: 'string',
              enum: ['asc', 'desc'],
              example: 'asc',
              description: 'Ordre du tri',
            },
          },
          description: 'Options de tri pour les utilisateurs',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Utilisateurs récupéres avec succès',
    schema: {
      example: {
        users: [
          {
            username: 'Johndoe',
            name: 'John Doe',
            role: 'user',
            address: 'Nantes,France',
          },
          {
            username: 'Janedoe',
            name: 'Jane Doe',
            role: 'user',
            address: 'Paris,France',
          },
        ],
      },
    },
  })
  @ApiForbiddenResponse({
    description: "Vous n'etes pas autorisé à effectuer cette action",
  })
  @ApiUnauthorizedResponse({
    description: 'Vous devez vous connecter',
  })
  @ApiInternalServerErrorResponse({
    description:
      "Erreur survenue lors de la suppression des données de l'utilisateur",
  })
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
      Logger.error(error);
      throw new HttpException(
        "Erreur lors de la suppression de l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
