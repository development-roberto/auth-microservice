/**
 * @file JWT adapter implementing the TokenPort using @nestjs/jwt.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { envs } from '../../../config';
import { TokenPort, JwtPayload } from '../../domain/ports/token.port';

/**
 * @class JwtTokenAdapter
 * @implements TokenPort
 * @description Provides JWT generation and verification using NestJS JwtService.
 */
@Injectable()
export class JwtTokenAdapter implements TokenPort {
  /**
   * @constructor
   * @param {JwtService} jwtService - Injected NestJS JwtService.
   */
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates a JWT for the given payload.
   * Uses configuration from envs.
   * @async
   * @param {JwtPayload} payload - The data to include in the token.
   * @returns {Promise<string>} A promise that resolves with the generated JWT string.
   */
  async generateToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  /**
   * Verifies a JWT string and returns its payload.
   * @async
   * @param {string} token - The JWT string to verify.
   * @returns {Promise<JwtPayload>} A promise that resolves with the verified payload.
   * @throws {Error} Rethrows errors from jwtService.verify, typically JsonWebTokenError or TokenExpiredError.
   */
  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      // The verify method already extracts the payload without 'sub', 'iat', 'exp' by default if needed
      const decoded = this.jwtService.verify<JwtPayload & { iat: number; exp: number }>(
        token,
        { secret: envs.jwtSecret }, // Explicitly pass secret if not global or using default
      );

      // Extract the core payload fields defined in JwtPayload interface
      const { id, email, name } = decoded;
      return { id, email, name };

    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      throw new RpcException({
        status: 401, // Unauthorized
        message: error.message ?? 'Invalid token.',
      });
    }
  }
}