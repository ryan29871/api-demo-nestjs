import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
// import * as config from 'config';
// import { ServerConfig } from './config/server-config.interface';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  // const serverConfig: ServerConfig = config.get('server');
  const logger = new Logger('bootstrap');

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors();
  }
  //else {
  //   app.enableCors({ origin: serverConfig.origin });
  //   logger.log(`Accepting requests from origin "${serverConfig.origin}"`);
  // }

  app.setGlobalPrefix(configService.get('URL_PREFIX'));

  await app.listen(configService.get('PORT'));
  logger.log(`Application listening on port ${configService.get('PORT')}`);
}
bootstrap();