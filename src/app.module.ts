/**
 * @file Root application module.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './shared/infrastructure/prisma';

/**
 * @module AppModule
 * @description The root module of the application, importing feature modules and shared infrastructure modules.
 */
@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
