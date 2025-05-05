/**
 * @file Query handler for verifying a JWT.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TokenPort, TOKEN_PORT, JwtPayload } from '../../../domain';
import { VerifyTokenQuery } from '../impl';
import { VerifyTokenResponseDto } from '../../dto';


/**
 * @class VerifyTokenHandler
 * @description Handles the execution of the VerifyTokenQuery.
 * Implements the IQueryHandler interface from @nestjs/cqrs.
 */
@QueryHandler(VerifyTokenQuery)
export class VerifyTokenHandler implements IQueryHandler<VerifyTokenQuery, VerifyTokenResponseDto> {
  /**
   * @constructor
   * @param {TokenPort} tokenService - Injected token port implementation.
   */
  constructor(
    @Inject(TOKEN_PORT)
    private readonly tokenService: TokenPort,
  ) {}

  /**
   * Executes the verify token query.
   * @async
   * @param {VerifyTokenQuery} query - The query object containing the token.
   * @returns {Promise<VerifyTokenResponseDto>} A promise resolving with the user payload and a potentially refreshed token.
   * @throws {RpcException} If the token is invalid or expired.
   */
  async execute(query: VerifyTokenQuery): Promise<VerifyTokenResponseDto> {
    const { token } = query;
    try {
      const userPayload: JwtPayload = await this.tokenService.verifyToken(token);

      const newToken = await this.tokenService.generateToken(userPayload);

      return new VerifyTokenResponseDto(userPayload, newToken);

    } catch (error) {
        console.error("Token verification failed:", error);
        throw new RpcException({
          status: 401,
          message: 'Invalid token',
        });
    }
  }
}