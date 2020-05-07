import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { DatabaseConfig } from './database-config.interface';
import { EnvConfig } from './env-config.interface';

import bunyan = require('bunyan');

// import { Users } from '../api/users/users.entity';
// import { User } from '../api/auth/user.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { LoggingBunyan } = require('@google-cloud/logging-bunyan');
const loggingBunyan = new LoggingBunyan();
let logger: bunyan;

if (process.env.NODE_ENV === 'production') {
  logger = bunyan.createLogger({
    // The JSON payload of the log as it appears in Stackdriver Logging
    // will contain "name": "my-service"
    name: 'config.service',
    streams: [
      // Log to the console at 'info' and above
      { stream: process.stdout, level: 'info' },
      // And log to Stackdriver Logging, logging at 'info' and above
      loggingBunyan.stream('info'),
    ],
  });
} else {
  logger = bunyan.createLogger({
    name: 'config.service',
  });
}

export class ConfigService {
  private readonly envConfig: EnvConfig;
  private dbConfig: DatabaseConfig;
  private econfig: dotenv.DotenvParseOutput;

  constructor(filePath: string) {
    try {
      this.econfig = dotenv.parse(fs.readFileSync(filePath));
      console.log(this.econfig);
    } catch (error) {
      logger.info('dotenv.parse(fs.readFileSync(filePath))');
      logger.error('error');
    }

    this.envConfig = this.validateInput(this.econfig);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'provision', 'ci'])
        .default('development'),
      PORT: Joi.number().default(3001),
      URL_PREFIX: Joi.string().default('v1/api'),
      DATABASE_TYPE: Joi.string()
        .valid(['postgres'])
        .default('postgres'),
      DATABASE_HOST: Joi.string().default('localhost'),
      DATABASE_PORT: Joi.number().default(5432),
      DATABASE_USER: Joi.string().default('postgres'),
      DATABASE_PASSWORD: Joi.string()
        .allow('')
        .allow(null),
      DATABASE_DBNAME: Joi.string().default('postgres'),
      SYNCHRONIZE: Joi.string().default('false'),
      JWT_SECRET: Joi.string().default('area51'),
      JWT_EXPIRES_IN: Joi.number().default(3600),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(envConfig, envVarsSchema);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  // Set synchronize to true on very first run to add all tables to db, then use migrations after for prod.
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres' as 'postgres',
      host: this.get('DATABASE_HOST'),
      port: parseInt(this.get('DATABASE_PORT'), 10),
      username: this.get('DATABASE_USER'),
      password: this.get('DATABASE_PASSWORD'),
      database: this.get('DATABASE_DBNAME'),
      autoLoadEntities: true,
      synchronize: (this.get('SYNCHRONIZE') === 'true'),
      migrationsRun: true,
      migrations: [__dirname + '/../migration/*{.ts,.js}'],
      cli: {
        migrationsDir: 'migration',
      },
      // entities: [__dirname + '/../**/*.entity.{js,ts}'], //local
      // entities: [User, Users], //local
      // extra: {
      //   ssl: this.get('NODE_ENV') === 'production'
      //     ? true
      //     : false,
      // },
    };
  }
}
