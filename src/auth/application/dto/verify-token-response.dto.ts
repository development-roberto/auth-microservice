/**
 * @file Data Transfer Object for token verification response.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { JwtPayload } from '../../domain'; // Reusing JwtPayload from domain ports

/**
 * @class VerifyTokenResponseDto
 * @description Defines the shape of the data returned upon successful token verification.
 * This mirrors the original structure but uses the defined JwtPayload.
 */
export class VerifyTokenResponseDto {
  /**
   * @property {JwtPayload} user - The payload extracted from the verified token.
   */
  user: JwtPayload;

  /**
   * @property {string} token - A potentially refreshed JWT authentication token.
   */
  token: string;

   /**
   * @constructor
   * @param {JwtPayload} user
   * @param {string} token
   */
  constructor(user: JwtPayload, token: string) {
    this.user = user;
    this.token = token;
  }
}