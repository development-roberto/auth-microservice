/**
 * @file Defines the command for logging in a user.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { LoginUserDto } from '../../dto';

/**
 * @class LoginUserCommand
 * @description Represents the intent to log in a user.
 * Implements the command pattern for CQRS.
 */
export class LoginUserCommand {
  /**
   * @constructor
   * @param {LoginUserDto} loginUserDto - The data required for login.
   */
  constructor(public readonly loginUserDto: LoginUserDto) {}
}