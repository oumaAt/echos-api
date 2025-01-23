import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { AuthGuard } from './guards/auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiOperation({
    summary: 'Enregistrer un nouvel utilisateur',
    description:
      'Crée un nouveau compte utilisateur avec les informations fournies.',
  })
  @ApiOkResponse({ description: 'Utilisateur créé avec succès' })
  @ApiBadRequestResponse({ description: "Données d'entrée invalides" })
  @ApiConflictResponse({ description: 'Le pseudonyme existe déjà' })
  signup(@Body() signupDto: SignupDto) {
    try {
      const user = this.authService.signup(signupDto);
      return user;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      Logger.error(error);
      throw new HttpException(
        'Error occured when trying to SignUp',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Connecter un utilisateur et obtenir un token JWT',
    description:
      "Authentifie l'utilisateur avec son pseudonyme et son mot de passe, et retourne un token d'accès JWT.",
  })
  @ApiOkResponse({
    description: 'Utilisateur connecté avec succès',
    schema: {
      example: {
        user: {
          username: 'Johndoe',
          name: 'John Doe',
        },
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTcwMTU1MDYyMiwiZXhwIjoxNzAxNTU0MjIyfQ.2z099rZf547rG5_30000000000000000000000000000000',
      },
    },
  })
  @ApiBadRequestResponse({ description: "Données d'entrée invalides" })
  @ApiUnauthorizedResponse({ description: 'Identifiants invalides' })
  login(@Body() loginDto: LoginDto) {
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      if (error instanceof NotFoundException || UnauthorizedException)
        throw error;
      Logger.error(error);
      throw new HttpException(
        'Error occured in Login',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Déconnecter l'utilisateur",
    description:
      "Rendre le token JWT invalide côté serveur en l'ajoutant à une liste noire dans Redis",
  })
  @ApiOkResponse({
    description: 'Déconnexion réussie.',
  })
  @UseGuards(AuthGuard)
  async logout(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await this.authService.blacklistToken(token);
    }
    return { message: 'Logout successful' };
  }
}
