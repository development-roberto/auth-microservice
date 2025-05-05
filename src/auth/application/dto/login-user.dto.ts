/**
 * @file Data Transfer Object for user login.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

/**
 * @class LoginUserDto
 * @description Defines the shape of data required for logging in a user.
 * Uses class-validator decorators for input validation.
 */
export class LoginUserDto {
  /**
   * @property {string} email - The user's email address used for login.
   * @decorator IsString
   * @decorator IsEmail
   */
  @IsString()
  @IsEmail()
  email: string;

  /**
   * @property {string} password - The user's password used for login.
   * @decorator IsString
   * @decorator IsStrongPassword - Although login doesn't strictly need strong password validation here,
   * keeping it might prevent weak passwords from even being attempted
   * if the registration enforced it. Adjust if needed.
   */
  @IsString()
  @IsStrongPassword()
  password: string;
}
