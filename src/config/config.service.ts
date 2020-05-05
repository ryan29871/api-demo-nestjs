import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as config from 'config';

import { DatabaseConfig } from './database-config.interface';
import { EnvConfig } from './env-config.interface';

import bunyan = require('bunyan');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { LoggingBunyan } = require('@google-cloud/logging-bunyan');

const loggingBunyan = new LoggingBunyan();

const logger = bunyan.createLogger({

  name: 'config-service',
  streams: [
    { stream: process.stdout, level: 'info' },
    loggingBunyan.stream('info'),
  ],
});

export class ConfigService {
  private readonly envConfig: EnvConfig;
  private dbConfig: DatabaseConfig;
  private econfig: dotenv.DotenvParseOutput;

  constructor(filePath: string) {

    try {
      this.dbConfig = config.get('db');
    } catch (error) {
      logger.info('config.get("db")')
      logger.error('error');
    }

    try {
      this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    } catch (error) {
      logger.info('dotenv.parse(fs.readFileSync(filePath))')
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
      NODE_ENV: Joi
        .string()
        .valid(['development', 'production', 'test', 'provision', 'ci'])
        .default('development'),
      PORT: Joi
        .number()
        .default(3001),
      URL_PREFIX: Joi
        .string()
        .default('v1/api'),
      DATABASE_TYPE: Joi
        .string()
        .valid(['postgres'])
        .default('postgres'),
      DATABASE_HOST: Joi
        .string()
        .default('localhost'),
      DATABASE_PORT: Joi
        .number()
        .default(5432),
      DATABASE_USER: Joi
        .string()
        .default('postgres'),
      DATABASE_PASSWORD: Joi
        .string()
        .allow('')
        .allow(null),
      DATABASE_DBNAME: Joi
        .string()
        .default('postgres'),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  createTypeOrmOptions() {
    return {
      type: 'postgres' as 'postgres',
      host: this.get('DATABASE_HOST'),
      port: parseInt(this.get('DATABASE_PORT'), 10),
      username: this.get('DATABASE_USER'),
      password: this.get('DATABASE_PASSWORD'),
      database: this.get('DATABASE_DBNAME'),
      entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
      synchronize: false,
      migrationsRun: true,
      migrations: [__dirname + '/../migration/*{.ts,.js}'],
      cli: {
        migrationsDir: 'migration',
      },
      extra: {
        ssl: this.get('NODE_ENV') === 'production'
          ? true
          : false,
      },
    };
  }

}

// export const typeOrmConfig: TypeOrmModuleOptions = {
//   type: dbConfig.type,
//   host: process.env.RDS_HOSTNAME || dbConfig.host,
//   port: Number(process.env.RDS_PORT) || dbConfig.port,
//   username: process.env.RDS_USERNAME || dbConfig.username,
//   password: process.env.RDS_PASSWORD || dbConfig.password,
//   database: process.env.RDS_DB_NAME || dbConfig.database,
//   entities: [__dirname + '/../**/*.entity.{js,ts}'],
//   synchronize: process.env.TYPEORM_SYNC === 'true' || dbConfig.synchronize,
// }

