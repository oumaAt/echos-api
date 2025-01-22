import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    NotFoundException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { SignupDto } from './dto/signup.dto';
  import { User } from 'src/user/entities/user.entity';
  import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly userService: UserService,
      private jwtService: JwtService,
    ) {}
  
    async signup(signupDto: SignupDto): Promise<User> {
      const { username, ...rest } = signupDto;
  
      // Check if the username is already taken
      const existingUser = await this.userService.findByUsername(username);
      if (existingUser) {
        throw new ConflictException('Username is already taken');
      }
  
      // Save the new user
      const user = this.userService.create(signupDto);
      return user;
    }
  
    async login(
      loginDto: LoginDto,
    ): Promise<{ user: User; accessToken: string }> {
      const { username, password } = loginDto;
  
      const user = await this.userService.findByUsername(username);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!(await user.validatePassword(password))) {
        throw new UnauthorizedException('Invalid password');
      }
  
      // Generate a JWT token
      const payload = { username: user.username, id: user.id, role: user.role };
      const accessToken = this.jwtService.sign(payload);
  
      return { user, accessToken };
    }
  }