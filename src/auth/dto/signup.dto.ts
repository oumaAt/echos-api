import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class SignupDto {
  @ApiProperty({ description: "Pseudo de l'utilisateur", example: 'johndoe' })
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
  @IsString()
  @IsOptional()
  name?: string;
}
