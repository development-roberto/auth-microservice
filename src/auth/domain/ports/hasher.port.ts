/**
 * @file Defines the port (interface) for password hashing operations.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

/**
 * @interface HasherPort
 * @description Defines the contract for hashing and comparing passwords.
 */
export interface HasherPort {
  /**
   * Hashes a plain text password.
   * @async
   * @param {string} plainText - The plain text password to hash.
   * @returns {Promise<string>} A promise that resolves with the hashed password.
   */
  hash(plainText: string): Promise<string>;

  /**
   * Compares a plain text password with a hash.
   * @async
   * @param {string} plainText - The plain text password.
   * @param {string} hash - The hashed password to compare against.
   * @returns {Promise<boolean>} A promise that resolves with true if the passwords match, false otherwise.
   */
  compare(plainText: string, hash: string): Promise<boolean>;
}

/**
 * @const {string} HASHER_PORT
 * @description Injection token for the HasherPort.
 */
export const HASHER_PORT = 'HasherPort';