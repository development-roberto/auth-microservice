/**
 * @file Defines the command for registering a new user.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { RegisterUserDto } from '../../dto';

/**
 * @class RegisterUserCommand
 * @description Represents the intent to register a new user.
 * Implements the command pattern for CQRS.
 */
export class RegisterUserCommand {
  /**
   * @constructor
   * @param {RegisterUserDto} registerUserDto - The data required for registration.
   */
  constructor(public readonly registerUserDto: RegisterUserDto) {}
}