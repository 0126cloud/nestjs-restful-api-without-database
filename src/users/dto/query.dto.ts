import { IsEmail, IsOptional, IsString } from 'class-validator';

export class QueryUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
