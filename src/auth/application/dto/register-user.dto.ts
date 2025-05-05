/**
 * @file Data Transfer Object for user registration.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

/**
 * @class RegisterUserDto
 * @description Defines the shape of data required for registering a new user.
 * Uses class-validator decorators for input validation.
 */
export class RegisterUserDto {
  /**
   * @property {string} name - The user's full name.
   * @decorator IsString
   */
  @IsString()
  name: string;

  /**
   * @property {string} email - The user's email address. Must be a valid email format.
   * @decorator IsString
   * @decorator IsEmail
   */
  @IsString()
  @IsEmail()
  email: string;

  /**
   * @property {string} password - The user's desired password. Must meet strength requirements.
   * @decorator IsString
   * @decorator IsStrongPassword
   */
  @IsString()
  @IsStrongPassword()
  password: string;
}
