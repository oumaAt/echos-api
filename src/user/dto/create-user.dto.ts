import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Role } from 'src/utils/enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Pseudo', example: 'johndoe' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Mot de passe',
    example: 'Password123',
    minLength: 8,
  })
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must be minimum eight characters, at least one letter and one number',
  })
  password: string;

  @ApiProperty({
    description: "Nom de l'utilisateur",
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: "Addresse de l'utilisateur", required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Commentaire',
    example: 'Nothing to add',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ description: "Role de l'utilisateur", example: 'admin' })
  @IsNotEmpty()
  @IsEnum(Role, { message: 'Role must be either admin or user' })
  role: Role;
}
