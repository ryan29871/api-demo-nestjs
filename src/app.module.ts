import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
// import { typeOrmConfig } from './config/config.service';

import { ApiModule } from './api/api.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '10.103.80.3',
      port: 5432,
      username: 'demouser',
      password: '123456',
      database: 'demo',
      // entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: true,
      autoLoadEntities: true,
      // migrationsRun: true,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'demo',
    //   // entities: [__dirname + '/**/*.entity.{js,ts}'],
    //   synchronize: true,
    //   autoLoadEntities: true,
    // }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useExisting: ConfigService,
    // }),
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
