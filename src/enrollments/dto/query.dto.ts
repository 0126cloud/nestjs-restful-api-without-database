import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Role } from '../enrollment';

export class QueryEnrollmentDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  userId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  courseId?: number;

  @ApiProperty({ required: false, enum: Role })
  @IsString()
  @IsOptional()
  role?: string;
}
