import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryCourseDto } from './dto';
import { CoursesService } from './courses.service';
import { ParseParamIdDto } from '../dto';

@Controller('courses')
export class CoursesController {
  constructor(private service: CoursesService) {}

  @Get()
  async getCourses(@Query() query: QueryCourseDto) {
    return;
  }

  @Get(':id')
  async getCourseById(@Param() param: ParseParamIdDto) {
    return this.service.getCourseById(param.id);
  }
}
