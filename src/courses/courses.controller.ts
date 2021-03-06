import { Controller, Get, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ParseParamIdDto } from '../dto';
import { UsersService } from '../users/users.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('course')
@Controller('courses')
export class CoursesController {
  constructor(
    private service: CoursesService,
    private userService: UsersService,
    private enrollmentService: EnrollmentsService,
  ) {}

  @Get()
  async getCourses() {
    return this.service.getCourses();
  }

  @ApiParam({ name: 'id', type: 'number' })
  @Get(':id')
  async getCourseById(@Param() param: ParseParamIdDto) {
    return this.service.getCourseById(param.id);
  }

  @ApiParam({ name: 'id', type: 'number' })
  @Get(':id/users')
  async getUsersByCourseId(@Param() param: ParseParamIdDto) {
    this.service.getCourseById(param.id);
    const datas = this.enrollmentService.getEnrollmentsWithQuery({
      courseId: param.id,
    });
    const ids = datas.map((data) => data.userId);
    return this.userService.getUsersByIds(ids);
  }
}
