import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import bunyan = require('bunyan');

// Imports the Google Cloud client library for Bunyan
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { LoggingBunyan } = require('@google-cloud/logging-bunyan');

// Creates a Bunyan Stackdriver Logging client
const loggingBunyan = new LoggingBunyan();

const logger = bunyan.createLogger({
  // The JSON payload of the log as it appears in Stackdriver Logging
  // will contain "name": "my-service"
  name: 'app-controller',
  streams: [
    // Log to the console at 'info' and above
    { stream: process.stdout, level: 'info' },
    // And log to Stackdriver Logging, logging at 'info' and above
    loggingBunyan.stream('info'),
  ],
});



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    logger.error('warp nacelles offline');
    logger.info('shields at 99%');
  }

  @Get()
  getHello(): string {
    logger.error('hello');
    return this.appService.getHello();
  }
}
