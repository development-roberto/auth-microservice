/**
 * @file Defines the query for verifying a JWT.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

/**
 * @class VerifyTokenQuery
 * @description Represents the intent to verify a JWT token.
 * Implements the query pattern for CQRS.
 */
export class VerifyTokenQuery {
  /**
   * @constructor
   * @param {string} token - The JWT string to verify.
   */
  constructor(public readonly token: string) {}
}