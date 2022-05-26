import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ParseParamIdDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;
}
