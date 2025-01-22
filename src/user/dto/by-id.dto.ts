import { Transform } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class ByIdDto {
  @Transform(({ value }) => Number(value)) 
  @IsInt()
  @IsPositive()
  id: number;
}
