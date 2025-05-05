/**
 * @file Bcrypt adapter implementing the HasherPort for password operations.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HasherPort } from '../../domain/ports/hasher.port';

/**
 * @class BcryptAdapter
 * @implements HasherPort
 * @description Provides password hashing and comparison using the bcrypt library.
 */
@Injectable()
export class BcryptAdapter implements HasherPort {
  private readonly saltRounds = 10; // Configurable salt rounds

  /**
   * Hashes a plain text password using bcrypt.
   * @async
   * @param {string} plainText - The plain text password to hash.
   * @returns {Promise<string>} A promise that resolves with the hashed password.
   */
  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  /**
   * Compares a plain text password with a bcrypt hash.
   * @async
   * @param {string} plainText - The plain text password.
   * @param {string} hash - The hashed password to compare against.
   * @returns {Promise<boolean>} A promise that resolves with true if the passwords match, false otherwise.
   */
  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}