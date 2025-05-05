/**
 * @file NATS controller for handling authentication requests.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { Controller, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { RegisterUserDto, LoginUserDto, AuthResponseDto, VerifyTokenResponseDto } from '../../application/dto';
import { RegisterUserCommand, LoginUserCommand } from '../../application/commands/impl';
import { VerifyTokenQuery } from '../../application/queries/impl';

/**
 * @class AuthController
 * @description Handles incoming NATS messages for authentication-related operations.
 * Uses CommandBus and QueryBus to dispatch tasks to appropriate handlers.
 */
@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  /**
   * @constructor
   * @param {CommandBus} commandBus - Injected CommandBus for dispatching commands.
   * @param {QueryBus} queryBus - Injected QueryBus for dispatching queries.
   */
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the 'auth.register.user' NATS message pattern.
   * Dispatches a RegisterUserCommand.
   * @async
   * @param {RegisterUserDto} registerUserDto - The payload containing user registration data.
   * @returns {Promise<AuthResponseDto>} The result from the command handler.
   * @throws {RpcException} Propagates exceptions from the command handler.
   */
  @MessagePattern('auth.register.user')
  async registerUser(
    @Payload() registerUserDto: RegisterUserDto,
  ): Promise<AuthResponseDto> {
    this.logger.log(`Received registerUser request for ${registerUserDto.email}`);
    try {
      return await this.commandBus.execute<RegisterUserCommand, AuthResponseDto>(
        new RegisterUserCommand(registerUserDto),
      );
    } catch (error: any) {
      this.logger.error(`Registration failed for ${registerUserDto.email}: ${error?.message ?? error}`, error?.stack);
      // Rethrow RpcException or handle specific errors if needed
      throw error instanceof RpcException ? error : new RpcException(error?.message ?? 'Registration failed');
    }
  }

  /**
   * Handles the 'auth.login.user' NATS message pattern.
   * Dispatches a LoginUserCommand.
   * @async
   * @param {LoginUserDto} loginUserDto - The payload containing user login credentials.
   * @returns {Promise<AuthResponseDto>} The result from the command handler.
   * @throws {RpcException} Propagates exceptions from the command handler.
   */
  @MessagePattern('auth.login.user')
  async loginUser(
    @Payload() loginUserDto: LoginUserDto,
  ): Promise<AuthResponseDto> {
     this.logger.log(`Received loginUser request for ${loginUserDto.email}`);
     try {
        return await this.commandBus.execute<LoginUserCommand, AuthResponseDto>(
            new LoginUserCommand(loginUserDto),
        );
     } catch (error: any) {
        this.logger.error(`Login failed for ${loginUserDto.email}: ${error?.message ?? error}`, error?.stack);
        throw error instanceof RpcException ? error : new RpcException(error?.message ?? 'Login failed');
     }
  }

  /**
   * Handles the 'auth.verify.user' NATS message pattern.
   * Dispatches a VerifyTokenQuery.
   * @async
   * @param {string} token - The JWT token string from the payload.
   * @returns {Promise<VerifyTokenResponseDto>} The result from the query handler.
   * @throws {RpcException} Propagates exceptions from the query handler.
   */
  @MessagePattern('auth.verify.user')
  async verifyToken(
    @Payload() token: string,
  ): Promise<VerifyTokenResponseDto> {
     this.logger.log(`Received verifyToken request`);
     try {
         return await this.queryBus.execute<VerifyTokenQuery, VerifyTokenResponseDto>(
             new VerifyTokenQuery(token),
         );
     } catch (error: any) {
         this.logger.error(`Token verification failed: ${error?.message ?? error}`, error?.stack);
         throw error instanceof RpcException ? error : new RpcException(error?.message ?? 'Token verification failed');
     }
  }
}