import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ParseParamIdDto } from '../dto';
import { EnrollDto, QueryEnrollmentDto } from './dto';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private service: EnrollmentsService) {}
  @Post()
  async enrollUser(@Body() body: EnrollDto) {
    return this.service.enrollUser(body);
  }

  @Get()
  async getEnrollments(@Query() query: QueryEnrollmentDto) {
    return this.service.getEnrollmentsWithQuery(query);
  }

  @Get(':id')
  async getEnrollmentById(@Param() param: ParseParamIdDto) {
    return this.service.getEnrollmentById(param.id);
  }

  @Delete(':id')
  async withdrawUser(@Param() param: ParseParamIdDto) {
    return this.service.withdrawUser(param.id);
  }
}
