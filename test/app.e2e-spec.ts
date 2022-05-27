import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  defaultCourses,
  mockEnrollments,
  mockUsers,
} from '../dataset';
import * as pactum from 'pactum';
import { EnrollDto } from '../src/enrollments/dto';
import { Role } from '../src/enrollments/enrollment';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create.dto';

describe('App e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
    await app.listen(3777);

    pactum.request.setBaseUrl('http://localhost:3777');
  });

  afterAll(() => {
    app.close();
  });

  describe('Basic requirements', () => {
    const dto: CreateUserDto = {
      email: 'e2etest@test.com',
      name: 'e2etest',
    };

    // create user
    describe('1. everyone can create a user by name and email', () => {
      it('a. if email format does not match /^\\S\\S$/, return Bad Request', () => {
        return pactum
          .spec()
          .post('/users')
          .withBody({
            email: 'test-email',
            name: dto.name,
          })
          .expectStatus(400);
      });
      it('b. if email or name is empty, return Bad Request', () => {
        return pactum
          .spec()
          .post('/users')
          .withBody({
            email: dto.email,
            name: '',
          })
          .expectStatus(400);
      });
      it('c. should return status code 201, and return data with id when success', () => {
        return pactum
          .spec()
          .post('/users')
          .withBody({ ...dto })
          .expectStatus(201)
          .stores('newUserId', 'id')
          .expectBodyContains('$S{newUserId}');
      });
    });

    // get single user by id
    describe('2. everyone can get a user by user id', () => {
      it('a. if the user does not exist, return Bad Request', () => {
        return pactum.spec().get('/users/5555').expectStatus(400);
      });
      it('b. should return status code 200, and return user data when success', () => {
        return pactum
          .spec()
          .get('/users/$S{newUserId}')
          .expectStatus(200)
          .expectBody({ ...dto, id: '$S{newUserId}' });
      });
    });

    // get user(s) by query
    describe('3. everyone can query a user by name or email', () => {
      it('a. use query string to specify email', () => {
        return pactum
          .spec()
          .get(`/users`)
          .withQueryParams('email', dto.email)
          .expectStatus(200)
          .expectBody([{ ...dto, id: '$S{newUserId}' }]);
      });
      it('b. use query string to specify name', () => {
        return pactum
          .spec()
          .get(`/users`)
          .withQueryParams('name', dto.name)
          .expectStatus(200)
          .expectBody([{ ...dto, id: '$S{newUserId}' }]);
      });
      it('c. if email format does not match `/^\\S@\\S$/`, return Bad Request', () => {
        return pactum
          .spec()
          .get('/users')
          .withQueryParams('email', 'test-email')
          .expectStatus(400);
      });
    });

    // edit single user
    describe("4. everyone can edit user's name and user's email by user id", () => {
      const editedDto: CreateUserDto = {
        email: 'test-edit@email.com',
        name: 'test-edit',
      };
      it('a. if the user does not exist, return Bad Request', () => {
        return pactum
          .spec()
          .patch(`/users/5555`)
          .withBody({ ...editedDto })
          .expectStatus(400);
      });
      it('b. if email format does not match `/^\\S@\\S$/`, return Bad Request', () => {
        return pactum
          .spec()
          .patch('/users/$S{newUserId}')
          .withBody({
            email: 'test-email',
            name: editedDto.name,
          })
          .expectStatus(400);
      });
      it('c. should return status code 200, and return new user data when success', () => {
        return pactum
          .spec()
          .patch(`/users/$S{newUserId}`)
          .withBody({ ...editedDto })
          .expectStatus(200)
          .expectBody({ ...editedDto, id: '$S{newUserId}' });
      });
    });

    // delete single user
    describe('5. everyone can delete a user by user id', () => {
      it('a. if the user does not exist, return Bad Request', () => {
        return pactum.spec().delete(`/users/5555`).expectStatus(400);
      });
      it('b. should return status code 200 when success', () => {
        return pactum
          .spec()
          .delete(`/users/$S{newUserId}`)
          .expectStatus(200);
      });
      it('c. should get Bad Request when query the same user id', () => {
        return pactum
          .spec()
          .get('/users/$S{newUserId}')
          .expectStatus(400);
      });
    });
  });

  describe('Bonus requirements', () => {
    const enrollDto: EnrollDto = {
      userId: 4,
      courseId: 5,
      role: Role.STUDENT,
    };

    // get users who join the same course
    describe('6. everyone can query users by course id', () => {
      it('a. check if enrollment data exists', () => {
        return pactum
          .spec()
          .get('/enrollments')
          .expectStatus(200)
          .expectJsonLike(mockEnrollments);
      });
      it('b. if the course does not exist, return Bad Request', () => {
        return pactum
          .spec()
          .get('/courses/5555/users')
          .expectStatus(400);
      });
      it('c. should return status code 200, and only return users who join the course', () => {
        const { courseId } = mockEnrollments[0];
        const userIds = mockEnrollments
          .filter((item) => item.courseId === courseId)
          .map((item) => item.userId);
        const res = mockUsers.filter((item) =>
          userIds.includes(item.id),
        );
        return pactum
          .spec()
          .get(`/courses/${courseId}/users`)
          .expectStatus(200)
          .expectJsonLike(res);
      });
    });

    // create single enrollment
    describe('7. everyone can enroll a user to a course by user id, course id and role', () => {
      it('a. if the user does not exist, return Bad Request', () => {
        return pactum
          .spec()
          .post('/enrollments')
          .withBody({ ...enrollDto, userId: 5555 })
          .expectStatus(400);
      });
      it('b. if the course does not exist, return Bad Request', () => {
        return pactum
          .spec()
          .post('/enrollments')
          .withBody({ ...enrollDto, courseId: 5555 })
          .expectStatus(400);
      });
      it('c. if the role does not exist, return Bad Request', () => {
        return pactum
          .spec()
          .post('/enrollments')
          .withBody({ ...enrollDto, role: 'stranger' })
          .expectStatus(400);
      });
      it('b. should return status code 201, and return user data when success', () => {
        return pactum
          .spec()
          .post('/enrollments')
          .withBody({ ...enrollDto })
          .expectStatus(201)
          .stores('newEnrollmentId', 'id')
          .expectJsonLike({
            ...enrollDto,
            id: '$S{newEnrollmentId}',
          });
      });
    });

    // delete single enrollment by id
    describe('8. everyone can withdraw a user by enrollment id', () => {
      it('c. if the enrollment does not exist, return Bad Request', () => {
        return pactum
          .spec()
          .delete('/enrollments/5555')
          .expectStatus(400);
      });
      it('c. should return status code 200 when success', () => {
        return pactum
          .spec()
          .delete('/enrollments/$S{newEnrollmentId}')
          .expectStatus(200);
      });
    });

    // get single enrollment
    describe('9. everyone can get an enrollment by enrollment id', () => {
      it('a. if the enrollment does not exist, return Bad Request', () => {
        return pactum
          .spec()
          .get('/enrollments/5555')
          .expectStatus(400);
      });
      it("b. should return status code 200, and return the enrollment's data when success", () => {
        return pactum.spec().get('/enrollments/1').expectStatus(200);
      });
    });

    // get enrollment(s) by query
    describe('10. everyone can query enrollments by user id, course id or role', () => {
      it('a. use query string to specify course id', () => {
        const { courseId } = mockEnrollments[0];
        const res = mockEnrollments.filter(
          (item) => item.courseId === courseId,
        );
        return pactum
          .spec()
          .get(`/enrollments`)
          .withQueryParams('courseId', courseId)
          .expectStatus(200)
          .expectJsonLike(res);
      });
      it('b. use query string to specify user id, course id and role', () => {
        const { courseId, userId, role } = mockEnrollments[0];
        return pactum
          .spec()
          .get(`/enrollments`)
          .withQueryParams('courseId', courseId)
          .withQueryParams('userId', userId)
          .withQueryParams('role', role)
          .expectStatus(200)
          .expectJsonLike([mockEnrollments[0]]);
      });
    });

    // get single course by id
    describe('11. everyone can get a course by course id', () => {
      it('a. if the course does not exist, return Bad Request', () => {
        return pactum.spec().get(`/courses/5555`).expectStatus(400);
      });
      it("b. should return status code 200, and return the course's data when success", () => {
        return pactum
          .spec()
          .get(`/courses/${defaultCourses[0].id}`)
          .expectStatus(200)
          .expectJsonLike(defaultCourses[0]);
      });
    });

    // get courses by user id
    describe('12. everyone can query courses by user id', () => {
      it('a. if the user does not exist, return Bad Request', () => {
        return pactum
          .spec()
          .get(`/users/5555/courses`)
          .expectStatus(400);
      });
      it("b. should return status code 200, and return the course's data when success", () => {
        const { userId } = mockEnrollments[0];
        const courseIds = mockEnrollments
          .filter((item) => item.userId === userId)
          .map((item) => item.courseId);
        const res = defaultCourses.filter((item) =>
          courseIds.includes(item.id),
        );
        return pactum
          .spec()
          .get(`/users/${userId}/courses`)
          .expectStatus(200)
          .expectJsonLike(res);
      });
    });
  });
});
