import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { ParseParamIdDto } from '../dto';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private service: UsersService,
    private enrollmentService: EnrollmentsService,
    private courseService: CoursesService,
  ) {}
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.service.createUser(body);
  }

  @Get()
  async getUsers(@Query() query: QueryUserDto) {
    return this.service.getUsersWithQuery(query);
  }

  @Get(':id')
  async getUserById(@Param() param: ParseParamIdDto) {
    return this.service.getUserById(param.id);
  }

  @Get(':id/courses')
  async getCoursesByUserId(@Param() param: ParseParamIdDto) {
    this.service.getUserById(param.id);
    const datas = this.enrollmentService.getEnrollmentsWithQuery({
      userId: param.id,
    });
    const ids = datas.map((data) => data.courseId);
    return this.courseService.getCoursesByIds(ids);
  }

  @Patch(':id')
  async updateUserById(
    @Param() param: ParseParamIdDto,
    @Body() dto: UpdateUserDto,
  ) {
    return this.service.updateUserById(param.id, dto);
  }

  @Delete(':id')
  async deleteUserById(@Param() param: ParseParamIdDto) {
    return this.service.deleteUserById(param.id);
  }
}
