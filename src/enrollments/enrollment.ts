export enum Role {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export class Enrollment {
  constructor(
    public id: number,
    public userId: number,
    public courseId: number,
    public role: Role,
  ) {}
}
