/**
 * @file Defines the port (interface) for token generation and verification.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

/**
 * @interface JwtPayload
 * @description Payload expected within the JWT.
 */
export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  // Add other relevant claims like roles, permissions etc. if needed
}

/**
 * @interface TokenPort
 * @description Defines the contract for handling JWT operations.
 */
export interface TokenPort {
  /**
   * Generates a JWT for the given payload.
   * @async
   * @param {JwtPayload} payload - The data to include in the token.
   * @returns {Promise<string>} A promise that resolves with the generated JWT string.
   */
  generateToken(payload: JwtPayload): Promise<string>;

  /**
   * Verifies a JWT string and returns its payload.
   * @async
   * @param {string} token - The JWT string to verify.
   * @returns {Promise<JwtPayload>} A promise that resolves with the verified payload.
   * @throws {Error} If the token is invalid or expired.
   */
  verifyToken(token: string): Promise<JwtPayload>;
}

/**
 * @const {string} TOKEN_PORT
 * @description Injection token for the TokenPort.
 */
export const TOKEN_PORT = 'TokenPort';