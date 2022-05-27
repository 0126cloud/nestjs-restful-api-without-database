import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
import { ParseParamIdDto } from '../dto';
import { EnrollUserDto, QueryEnrollmentDto } from './dto';
import { EnrollmentsService } from './enrollments.service';
import { BearerAuthGuard } from '../auth/bearerAuth.guard';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('enrollment')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    private service: EnrollmentsService,
    private courseService: CoursesService,
    private userService: UsersService,
  ) {}

  @Get()
  async getEnrollments(@Query() query: QueryEnrollmentDto) {
    return this.service.getEnrollmentsWithQuery(query);
  }

  @ApiParam({ name: 'id', type: 'number' })
  @Get(':id')
  async getEnrollmentById(@Param() param: ParseParamIdDto) {
    return this.service.getEnrollmentById(param.id);
  }

  @ApiBearerAuth()
  @UseGuards(BearerAuthGuard)
  @Post()
  async enrollUser(@Body() body: EnrollUserDto) {
    const { userId, courseId } = body;
    this.userService.getUserById(userId);
    this.courseService.getCourseById(courseId);
    const datas = this.service.getEnrollmentsWithQuery({
      userId,
      courseId,
    });
    if (datas.length)
      throw new BadRequestException(
        'this user already joined in this course',
      );
    return this.service.enrollUser(body);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'number' })
  @UseGuards(BearerAuthGuard)
  @Delete(':id')
  async withdrawUser(@Param() param: ParseParamIdDto) {
    return this.service.withdrawUser(param.id);
  }
}
