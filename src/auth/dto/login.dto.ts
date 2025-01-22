import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Pseudo', example: 'johndoe' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Mot de passe',
    example: 'Password123',
    minLength: 8,
  })
  @IsNotEmpty()
  password: string;
}
