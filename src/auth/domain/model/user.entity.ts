/**
 * @file Defines the core User entity for the domain layer.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

/**
 * @class User
 * @description Represents a user within the application domain.
 * Contains core user properties and potentially domain logic.
 */
export class User {
  /**
   * @property {string} id - The unique identifier for the user.
   */
  public readonly id: string;

  /**
   * @property {string} email - The user's email address (unique).
   */
  public readonly email: string;

  /**
   * @property {string} name - The user's full name.
   */
  public name: string;

  /**
   * @property {string} password - The user's hashed password.
   * @description Should only be handled within appropriate layers (application/infrastructure).
   * Marked as potentially undefined as it might not always be loaded or needed.
   */
  public password?: string;

  /**
   * @property {boolean} isActive - Indicates if the user account is active.
   * @default true
   */
  public isActive: boolean;

  /**
   * @constructor
   * @param {string} id
   * @param {string} email
   * @param {string} name
   * @param {string} [password] - Hashed password.
   * @param {boolean} [isActive=true]
   */
  constructor(
    id: string,
    email: string,
    name: string,
    password?: string,
    isActive: boolean = true,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password; // Store the hashed password if provided
    this.isActive = isActive;
  }

  /**
   * @method updateName
   * @description Updates the user's name. Example of domain logic.
   * @param {string} newName - The new name for the user.
   */
  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('User name cannot be empty.'); // Domain specific error
    }
    this.name = newName.trim();
  }

  // Add other domain-specific methods here if needed
  // e.g., password validation logic could potentially live here
  // or be handled by a dedicated domain service.
}