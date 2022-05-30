import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('\n =====  Authentication e2e testing  ====', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('can signup a new user', () => {

    const testEmail='my14@gm.com';
    const testPassword='1234';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email:testEmail, password: testPassword})
      .expect(201)
      .then ( (res) => {
        const { id, email} = res.body;
        expect(id).toBeDefined;
        expect(email).toEqual(testEmail)
      })
  });
});
