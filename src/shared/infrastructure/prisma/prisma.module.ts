/**
 * @file Module for providing the PrismaService globally.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * @module PrismaModule
 * @description Provides and exports the PrismaService for global use.
 * Marking it as @Global() makes PrismaService available in all modules without importing PrismaModule.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}