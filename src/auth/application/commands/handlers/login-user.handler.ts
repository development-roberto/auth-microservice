/**
 * @file Command handler for logging in a user.
 * @author Roberto Morales
 * @version 1.0.0
 */

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
  HasherPort,
  HASHER_PORT,
  TokenPort,
  TOKEN_PORT,
} from '../../../domain';
import { LoginUserCommand } from '../impl';
import { AuthResponseDto } from '../../dto';

/**
 * @class LoginUserHandler
 * @description Handles the execution of the LoginUserCommand.
 * Implements the ICommandHandler interface from @nestjs/cqrs.
 */
@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand, AuthResponseDto> {
  /**
   * @constructor
   * @param {UserRepositoryPort} userRepository - Injected user repository port implementation.
   * @param {HasherPort} hasher - Injected hasher port implementation.
   * @param {TokenPort} tokenService - Injected token port implementation.
   */
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(HASHER_PORT)
    private readonly hasher: HasherPort,
    @Inject(TOKEN_PORT)
    private readonly tokenService: TokenPort,
  ) {}

  /**
   * Executes the login user command.
   * @async
   * @param {LoginUserCommand} command - The command object containing login credentials.
   * @returns {Promise<AuthResponseDto>} A promise resolving with the authenticated user and token.
   * @throws {RpcException} If credentials are invalid or another error occurs.
   */
  async execute(command: LoginUserCommand): Promise<AuthResponseDto> {
    const { email, password } = command.loginUserDto;

    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user || !user.password) {
        throw new RpcException({
          status: 400,
          message: 'User/Password not valid',
        });
      }

      const isPasswordValid = await this.hasher.compare(password, user.password);

      if (!isPasswordValid) {
        throw new RpcException({
          status: 400,
          message: 'User/Password not valid',
        });
      }

      const { password: _, ...userPayload } = user;

      const token = await this.tokenService.generateToken({
        id: userPayload.id,
        email: userPayload.email,
        name: userPayload.name,
      });

      return new AuthResponseDto({
        id: userPayload.id,
        email: userPayload.email,
        name: userPayload.name,
        isActive: userPayload.isActive,
        updateName: user.updateName
      }, token);

    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      console.error("Error during user login:", error);
      throw new RpcException({
        status: 500,
        message: error.message ?? 'An unexpected error occurred during login.',
      });
    }
  }
}