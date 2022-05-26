import { BadRequestException, Injectable } from '@nestjs/common';
import { EnrollDto, QueryEnrollmentDto } from './dto';
import { Enrollment } from './enrollment';

@Injectable()
export class EnrollmentsService {
  private enrollments: Enrollment[] = [];

  enrollUser(body: EnrollDto): Enrollment {
    const { userId, courseId, role } = body;
    const lastItem = this.enrollments[
      this.enrollments.length - 1
    ] || { id: 0 };
    const id = lastItem.id + 1;
    const newItem = new Enrollment(id, userId, courseId, role);
    this.enrollments.push(newItem);
    return newItem;
  }

  getEnrollmentsWithQuery(query: QueryEnrollmentDto): Enrollment[] {
    let newItems: Enrollment[] = [...this.enrollments];
    if (!Object.keys(query).length) return newItems;

    Object.entries(query).forEach(([key, value]) => {
      newItems = newItems.filter((user) => user[key] === value);
    });
    return newItems;
  }

  getEnrollmentById(id: number): Enrollment {
    const { enrollments } = this.findEnrollAndIndex(id);
    return { ...enrollments };
  }

  withdrawUser(id: number): { id: number; deleted: boolean } {
    const { index } = this.findEnrollAndIndex(id);
    this.enrollments.splice(index, 1);
    return { id, deleted: true };
  }

  private findEnrollAndIndex = (
    enrollId: number,
  ): { enrollments: Enrollment; index: number } => {
    const index = this.enrollments.findIndex(
      (enroll) => enroll.id === enrollId,
    );
    if (index === -1) {
      throw new BadRequestException('user does not exist');
    }
    return { enrollments: this.enrollments[index], index };
  };
}
