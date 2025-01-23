import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
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
}
