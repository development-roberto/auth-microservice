/**
 * @file Auth module definition, setting up CQRS handlers and infrastructure adapters.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../config';

// Application Layer
import { CommandHandlers } from './application/commands';
import { QueryHandlers } from './application/queries';

// Domain Layer (Ports)
import { USER_REPOSITORY_PORT, HASHER_PORT, TOKEN_PORT } from './domain';

// Infrastructure Layer (Adapters & Controller)
import { PrismaUserRepository, BcryptAdapter, JwtTokenAdapter } from './infrastructure/adapters';
import { AuthController } from './infrastructure/controllers';

/**
 * @const {Provider[]} infrastructureProviders
 * @description Defines providers mapping domain ports to their infrastructure implementations.
 */
const infrastructureProviders: Provider[] = [
  {
    provide: USER_REPOSITORY_PORT,
    useClass: PrismaUserRepository,
  },
  {
    provide: HASHER_PORT,
    useClass: BcryptAdapter,
  },
  {
      provide: TOKEN_PORT,
      useClass: JwtTokenAdapter,
  },
];

/**
 * @const {Provider[]} applicationProviders
 * @description Spreads the command and query handlers for registration with CQRS.
 */
const applicationProviders: Provider[] = [
    ...CommandHandlers,
    ...QueryHandlers,
];

/**
 * @module AuthModule
 * @description Encapsulates the authentication feature, wiring domain, application, and infrastructure layers.
 */
@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.jwtExpiresIn || '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...applicationProviders,
    ...infrastructureProviders,
  ],
})
export class AuthModule {}