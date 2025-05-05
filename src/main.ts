/**
 * @file Application entry point. Bootstraps the NestJS microservice.
 * @author Roberto Morales
 * @version 1.1.0
 * @date 2025-05-01
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/infrastructure/filters';
import { ResponseSanitizerInterceptor } from './shared/infrastructure/interceptors';

/**
 * @function bootstrap
 * @description Initializes and starts the NestJS microservice application.
 * Configures NATS transport, global validation pipes, global filters,
 * global interceptors, and listens for incoming messages.
 * @async
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      },
    },
  );

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
          enableImplicitConversion: true,
      },
    }),
  );

  // Apply Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());
  logger.log('Applied global RPC exception filter.');

  // Apply Global Interceptor
  app.useGlobalInterceptors(new ResponseSanitizerInterceptor());
  logger.log('Applied global response sanitizer interceptor.');


  await app.listen();
  logger.log(`Auth Microservice is listening on NATS servers: ${envs.natsServers.join(', ')}`);
}
bootstrap();