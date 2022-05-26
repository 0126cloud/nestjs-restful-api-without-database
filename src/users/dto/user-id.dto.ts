import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserIdDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;
}
