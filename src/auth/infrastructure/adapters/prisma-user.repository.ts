/**
 * @file Prisma adapter implementing the UserRepositoryPort.
 * @author Roberto Morales
 * @version 1.0.0
 * @date 2025-05-01
 */

import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { User } from '../../domain/model/user.entity';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service'; // Adjust path if needed

/**
 * @class PrismaUserRepository
 * @implements UserRepositoryPort
 * @description Implements user persistence logic using Prisma ORM.
 */
@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  private readonly logger = new Logger(PrismaUserRepository.name);

  /**
   * @constructor
   * @param {PrismaService} prisma - Injected PrismaService instance.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Maps a Prisma User model to a domain User entity.
   * @private
   * @param {any | null} prismaUser - The user object retrieved from Prisma.
   * @returns {User | null} The corresponding domain User entity. Returns null if input is null/undefined.
   */
  private mapToDomain(prismaUser): User | null {
    if (!prismaUser) {
      return null;
    }
    // Note: Ensure properties match between PrismaUser and domain User entity
    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.name,
      prismaUser.password, // Include password hash
      prismaUser.isActive,
    );
  }

   /**
   * Maps a domain User entity to Prisma's UserCreateInput or UserUpdateInput format.
   * Includes the ID since it's provided externally now.
   * @private
   * @param {User} user - The domain User entity.
   * @returns {any} Data suitable for Prisma create operation.
   */
   private mapToPrismaCreateData(user: User): any {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password ?? '',
      isActive: user.isActive,
    };
  }


  /**
   * Finds a user by their unique ID using Prisma.
   * @async
   * @param {string} id - The ID of the user to find.
   * @returns {Promise<User | null>} A promise resolving with the domain User entity or null.
   */
  async findById(id: string): Promise<User | null> {
    try {
      const prismaUser = await this.prisma.user.findUnique({
        where: { id },
      });
      return this.mapToDomain(prismaUser);
    } catch (error) {
      this.logger.error(`Error finding user by ID ${id}:`, error);
      throw new RpcException({ status: 500, message: 'Database error finding user by ID.' });
    }
  }

  /**
   * Finds a user by their email address using Prisma.
   * @async
   * @param {string} email - The email address to search for.
   * @returns {Promise<User | null>} A promise resolving with the domain User entity or null.
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const prismaUser = await this.prisma.user.findUnique({
        where: { email },
      });
      return this.mapToDomain(prismaUser);
    } catch (error) {
      this.logger.error(`Error finding user by email ${email}:`, error);
       // Don't throw RpcException here, let the handler decide (e.g., UserNotFound vs. DB error)
       // For now, return null to indicate not found due to error or non-existence.
       // Or throw a custom infrastructure error. Let's rethrow for now.
       throw new RpcException({ status: 500, message: 'Database error finding user by email.' });
    }
  }

  /**
   * Saves (creates) a user entity using Prisma.
   * Uses the ID provided from the User entity.
   * @async
   * @param {User} user - The domain User entity to save.
   * @returns {Promise<User>} A promise resolving with the saved domain User entity.
   */
  async save(user: User): Promise<User> {
    const prismaData = this.mapToPrismaCreateData(user);
    try {
      const savedPrismaUser = await this.prisma.user.create({
        data: prismaData,
      });
      return this.mapToDomain(savedPrismaUser);
    } catch (error: any) { // Catch specific Prisma Errors
      this.logger.error(`Error saving user ${user.email}:`, error);
      // Check for Prisma specific unique constraint errors if needed
      if (error.code === 'P2002') { // Prisma unique constraint violation code
         throw new RpcException({ status: 409, message: `User with email ${user.email} already exists.` });
      }
      throw new RpcException({ status: 500, message: 'Database error saving user.' });
    }
  }

  /**
   * Deletes a user by their unique ID using Prisma.
   * @async
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<void>} A promise that resolves when deletion is complete.
   * @throws {RpcException} If the user is not found or a database error occurs.
   */
  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error: any) { // Catch specific Prisma Errors
        this.logger.error(`Error deleting user ${id}:`, error);
         // Handle Prisma's record not found error P2025
        if (error.code === 'P2025') {
             throw new RpcException({ status: 404, message: `User with ID ${id} not found.` });
        }
        throw new RpcException({ status: 500, message: 'Database error deleting user.' });
    }
  }
}