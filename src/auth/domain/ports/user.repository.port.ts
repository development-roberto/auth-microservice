/**
 * @file Defines the port (interface) for user repository operations.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { User } from '../model/user.entity';

/**
 * @interface UserRepositoryPort
 * @description Defines the contract (methods) that any user repository adapter
 * must implement to interact with user data storage.
 */
export interface UserRepositoryPort {
  /**
   * Finds a user by their unique ID.
   * @async
   * @param {string} id - The ID of the user to find.
   * @returns {Promise<User | null>} A promise that resolves with the User entity or null if not found.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Finds a user by their email address.
   * @async
   * @param {string} email - The email address of the user to find.
   * @returns {Promise<User | null>} A promise that resolves with the User entity or null if not found.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Saves (creates or updates) a user entity in the data storage.
   * @async
   * @param {User} user - The user entity to save.
   * @returns {Promise<User>} A promise that resolves with the saved User entity.
   */
  save(user: User): Promise<User>;

  /**
   * Deletes a user by their unique ID.
   * @async
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<void>} A promise that resolves when the deletion is complete.
   */
  delete(id: string): Promise<void>;
}

/**
 * @const {string} USER_REPOSITORY_PORT
 * @description Injection token for the UserRepositoryPort.
 * Used for dependency injection within the NestJS application.
 */
export const USER_REPOSITORY_PORT = 'UserRepositoryPort';