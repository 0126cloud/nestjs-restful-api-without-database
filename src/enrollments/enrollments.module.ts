import { Module } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, UsersService, CoursesService],
})
export class EnrollmentsModule {}
