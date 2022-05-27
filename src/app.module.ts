import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BearerStrategy } from './auth/bearer.strategy';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, EnrollmentsModule, CoursesModule],
  controllers: [AppController],
  providers: [BearerStrategy],
})
export class AppModule {}
