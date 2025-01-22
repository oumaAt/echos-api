import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    const user = this.authService.signup(signupDto);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await this.authService.blacklistToken(token);
    }
    return { message: 'Logout successful' };
  }
}
