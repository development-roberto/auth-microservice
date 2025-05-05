/**
 * @file Command handler for registering a new user.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
  HasherPort,
  HASHER_PORT,
  TokenPort,
  TOKEN_PORT,
  User,
} from '../../../domain';
import { RegisterUserCommand } from '../impl';
import { AuthResponseDto } from '../../dto';

/**
 * @class RegisterUserHandler
 * @description Handles the execution of the RegisterUserCommand.
 * Implements the ICommandHandler interface from @nestjs/cqrs.
 */
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand, AuthResponseDto> {
  private readonly logger = new Logger(RegisterUserHandler.name);

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
   * Executes the register user command.
   * @async
   * @param {RegisterUserCommand} command - The command object containing registration data.
   * @returns {Promise<AuthResponseDto>} A promise resolving with the authenticated user and token.
   * @throws {RpcException} If the email already exists or another error occurs.
   */
  async execute(command: RegisterUserCommand): Promise<AuthResponseDto> {
    const { email, name, password } = command.registerUserDto;

    try {
      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        throw new RpcException({
          status: 400,
          message: 'User already exists',
        });
      }

      const hashedPassword = await this.hasher.hash(password);

      // Generate UUID externally
      const id = randomUUID();
      this.logger.log(`Generated user UUID: ${id}`);

      // Create User entity with the generated UUID
      const userToSave = new User(id, email, name, hashedPassword);

      const savedUser = await this.userRepository.save(userToSave);

      // Ensure password is not sent back
      const { password: _, ...userPayload } = savedUser;

      const token = await this.tokenService.generateToken({
        id: userPayload.id,
        email: userPayload.email,
        name: userPayload.name
      });

      return new AuthResponseDto({
        id: userPayload.id,
        email: userPayload.email,
        name: userPayload.name,
        isActive: userPayload.isActive,
        updateName: savedUser.updateName
      }, token);
    } catch (error) {
       // Catch specific domain errors if defined, otherwise rethrow RpcExceptions
       if (error instanceof RpcException) {
           throw error;
       }
       // Log the internal error for debugging
       this.logger.error(`Error during user registration: ${error.message}`, error.stack);
       // Throw a generic RpcException for unexpected errors
       throw new RpcException({
           status: 500, // Internal Server Error
           message: error.message ?? 'An unexpected error occurred during registration.',
       });
    }
  }
}