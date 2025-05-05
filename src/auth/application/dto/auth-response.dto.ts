/**
 * @file Data Transfer Object for authentication responses (login/register).
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { User } from '../../domain'; // Assuming User entity is properly exported

/**
 * @class AuthResponseDto
 * @description Defines the shape of the data returned upon successful authentication.
 */
export class AuthResponseDto {
  /**
   * @property {Omit<User, 'password'>} user - The authenticated user's data (excluding password).
   */
  user: Omit<User, 'password'>;

  /**
   * @property {string} token - The JWT authentication token.
   */
  token: string;

   /**
   * @constructor
   * @param {Omit<User, 'password'>} user
   * @param {string} token
   */
  constructor(user: Omit<User, 'password'>, token: string) {
    this.user = user;
    this.token = token;
  }
}