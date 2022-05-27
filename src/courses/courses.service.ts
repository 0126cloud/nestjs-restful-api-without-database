import { BadRequestException, Injectable } from '@nestjs/common';
import { defaultCourses } from '../../dataset';
import { Course } from './course';

@Injectable()
export class CoursesService {
  private readonly courses: Course[] = defaultCourses;

  getCourses = (): Course[] => {
    return [...this.courses];
  };

  getCourseById = (courseId: number): Course => {
    const course = this.findCourseById(courseId);
    return course;
  };

  getCoursesByIds = (ids: number[]): Course[] => {
    if (!ids.length) return [];
    let courses = [...this.courses];
    courses = courses.filter((course) => ids.includes(course.id));
    return courses;
  };

  private findCourseById = (courseId: number): Course => {
    const theOne = this.courses.find(
      (course) => course.id === courseId,
    );
    if (!theOne) {
      throw new BadRequestException('course does not exist');
    }
    return { ...theOne };
  };
}
