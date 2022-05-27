import { from } from 'rxjs';
import { groupBy } from 'rxjs/operators';
import { Enrollment, Role } from '../src/enrollments/enrollment';

export const mockEnrollments: Enrollment[] = [
  new Enrollment(1, 1, 1, Role.TEACHER),
  new Enrollment(2, 1, 2, Role.STUDENT),
  new Enrollment(3, 2, 1, Role.STUDENT),
  new Enrollment(4, 2, 2, Role.STUDENT),
  new Enrollment(5, 3, 1, Role.STUDENT),
];

export const enrollmentsGroupByUser = from(mockEnrollments).pipe(
  groupBy((item) => item.userId),
);

export const enrollmentsGroupByCourse = from(mockEnrollments).pipe(
  groupBy((item) => item.courseId),
);
