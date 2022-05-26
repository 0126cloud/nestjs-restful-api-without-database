import { IsEmail, IsOptional, IsString } from 'class-validator';

export class QueryCourseDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
