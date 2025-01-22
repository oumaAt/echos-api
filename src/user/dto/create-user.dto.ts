import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
  } from 'class-validator';
  import { Role } from 'src/utils/enum';
  
  export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;
  
    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message:
        'Password must be minimum eight characters, at least one letter and one number',
    })
    password: string;
  
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    address?: string;
  
    @IsOptional()
    @IsString()
    comment?: string;
  
    @IsNotEmpty()
    @IsEnum(Role, { message: 'Role must be either admin or user' })
    role: Role;
  }
  