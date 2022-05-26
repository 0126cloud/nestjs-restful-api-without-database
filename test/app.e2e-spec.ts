import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

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

  describe('User', () => {
    const dto: CreateUserDto = {
      email: 'test@gmail.com',
      name: 'test',
    };

    // create user
    describe('1. everyone can create a user by name and email', () => {
      it('a. should get empty users', () => {
        return pactum
          .spec()
          .get('/users')
          .expectStatus(200)
          .expectBody([]);
      });
      it('b. if email format does not match /^\\S\\S$/, return Bad Request', () => {
        return pactum
          .spec()
          .post('/users')
          .withBody({
            email: 'test-email',
            name: dto.name,
          })
          .expectStatus(400)
          .expectBodyContains('Bad Request');
      });
      it('c. if email or name is empty, return Bad Request', () => {
        return pactum
          .spec()
          .post('/users')
          .withBody({
            email: dto.email,
            name: '',
          })
          .expectStatus(400)
          .expectBodyContains('Bad Request');
      });
      it('d. should return status code 201, and return data with id when success', () => {
        return pactum
          .spec()
          .post('/users')
          .withBody({ ...dto })
          .expectStatus(201)
          .stores('newUserId', 'id')
          .expectBodyContains('$S{newUserId}');
      });
      it('e. should have one user in user list', () => {
        return pactum
          .spec()
          .get('/users')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    // get single user by id
    describe('2. everyone can get a user by user id', () => {
      it('a. if the user does not exist, return Bad Request', () => {
        return pactum
          .spec()
          .get('/users/5555')
          .expectStatus(400)
          .expectBodyContains('Bad Request');
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
          .expectStatus(400)
          .expectBodyContains('Bad Request');
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
          .expectStatus(400)
          .expectBodyContains('Bad Request');
      });
      it('b. if email format does not match `/^\\S@\\S$/`, return Bad Request', () => {
        return pactum
          .spec()
          .patch('/users/$S{newUserId}')
          .withBody({
            email: 'test-email',
            name: editedDto.name,
          })
          .expectStatus(400)
          .expectBodyContains('Bad Request');
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
        return pactum
          .spec()
          .delete(`/users/5555`)
          .expectStatus(400)
          .expectBodyContains('Bad Request');
      });
      it('b. should return status code 200 when success', () => {
        return pactum
          .spec()
          .delete(`/users/$S{newUserId}`)
          .expectStatus(200);
      });
      it('c. should get empty users', () => {
        return pactum
          .spec()
          .get('/users')
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });
});
