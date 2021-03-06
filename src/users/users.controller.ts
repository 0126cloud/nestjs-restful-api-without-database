import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { ParseParamIdDto } from '../dto';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { BearerAuthGuard } from '../auth/bearerAuth.guard';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('users')
export class UsersController {
  constructor(
    private service: UsersService,
    private enrollmentService: EnrollmentsService,
    private courseService: CoursesService,
  ) {}

  @Get()
  async getUsers(@Query() query: QueryUserDto) {
    return this.service.getUsersWithQuery(query);
  }

  @ApiParam({ name: 'id', type: 'number' })
  @Get(':id')
  async getUserById(@Param() param: ParseParamIdDto) {
    return this.service.getUserById(param.id);
  }

  @ApiParam({ name: 'id', type: 'number' })
  @Get(':id/courses')
  async getCoursesByUserId(@Param() param: ParseParamIdDto) {
    this.service.getUserById(param.id);
    const datas = this.enrollmentService.getEnrollmentsWithQuery({
      userId: param.id,
    });
    const ids = datas.map((data) => data.courseId);
    return this.courseService.getCoursesByIds(ids);
  }

  @ApiBearerAuth()
  @UseGuards(BearerAuthGuard)
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.service.createUser(body);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'number' })
  @UseGuards(BearerAuthGuard)
  @Patch(':id')
  async updateUserById(
    @Param() param: ParseParamIdDto,
    @Body() dto: UpdateUserDto,
  ) {
    return this.service.updateUserById(param.id, dto);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'number' })
  @UseGuards(BearerAuthGuard)
  @Delete(':id')
  async deleteUserById(@Param() param: ParseParamIdDto) {
    return this.service.deleteUserById(param.id);
  }
}
