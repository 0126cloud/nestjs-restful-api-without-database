import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryEnrollmentDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  userId?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  courseId?: number;

  @IsString()
  @IsOptional()
  role?: string;
}
