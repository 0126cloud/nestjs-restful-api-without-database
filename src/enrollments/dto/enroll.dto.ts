import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Role } from '../enrollment';

export class EnrollDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  courseId: number;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
