import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryEnrollmentDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  id?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  userId?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  courseId?: string;

  @IsString()
  @IsOptional()
  role?: string;
}
