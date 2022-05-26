import { Module } from '@nestjs/common';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, EnrollmentsModule, CoursesModule],
})
export class AppModule {}
