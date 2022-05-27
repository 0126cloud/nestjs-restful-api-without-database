import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Role } from '../enrollment';

export class EnrollUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  courseId: number;

  @ApiProperty({ enum: Role })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
