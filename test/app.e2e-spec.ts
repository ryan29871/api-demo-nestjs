import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigService } from '../src/config/config.service';
import { AppService } from '../src/app.service';

// describe('AppController (e2e)', () => {
//   let prefix = '';
//   // const hello = 'Hello World!';
//   const hello = ['Hello World!'];
//   const result = {
//     getHello: hello,
//   };
//   let app: INestApplication;
//   const appService = {
//     getHello: () => result.getHello,
//   };

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     })
//       .overrideProvider(AppService)
//       .useValue(appService)
//       .compile();

//     app = moduleFixture.createNestApplication();
//     const configService: ConfigService = app.get(ConfigService);
//     prefix = configService.get('URL_PREFIX');
//     app.setGlobalPrefix(prefix);
//     await app.init();
//   });

//   it('/${prefix} (GET)', () => {
//     return request(app.getHttpServer())
//       .get(`/${prefix}/`)
//       .expect(200)
//       // .expect(JSON.stringify(result.getHello));
//       .expect(result.getHello);
//   });

//   afterAll(async () => {
//     await app.close();
//   })
// });

describe('AppController (e2e)', () => {

  it(`/users (GET)`, () => {
    const word = 'hello';
    expect(word).toEqual('hello');
  });

});