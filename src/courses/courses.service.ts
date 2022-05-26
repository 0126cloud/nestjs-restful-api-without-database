import { BadRequestException, Injectable } from '@nestjs/common';
import { Course, defaultCourses } from './course';

@Injectable()
export class CoursesService {
  private courses: Course[] = defaultCourses;

  getCourseById = (courseId: number): Course => {
    const course = this.findCourseById(courseId);
    return course;
  };

  findCourseById = (courseId: number): Course => {
    const theOne = this.courses.find(
      (course) => course.id === courseId,
    );
    if (!theOne) {
      throw new BadRequestException('course does not exist');
    }
    return { ...theOne };
  };
}
