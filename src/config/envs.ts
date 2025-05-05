/**
 * @file Environment variable configuration and validation.
 * @author Roberto Morales
 * @version 1.1.0
 * @date 2025-05-01
 */

import 'dotenv/config';
import * as joi from 'joi';

/**
 * @interface EnvVars
 * @description Defines the structure of expected environment variables.
 */
interface EnvVars {
  PORT: number; // Although this is a microservice, a PORT might still be used (e.g., for health checks if exposed via HTTP)
  NATS_SERVERS: string[];
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string; // Added for token expiration configuration
}

// Define the validation schema using Joi
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().default('2h'), // Added with default
  })
  .unknown(true); // Allow other environment variables not defined here

// Validate environment variables
const { error, value } = envsSchema.validate({
  ...process.env,
  // Split NATS_SERVERS string into an array
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`!!! Config validation error: ${error.message} !!!`);
}

// Cast validated value to the EnvVars interface
const envVars: EnvVars = value;

/**
 * @const {object} envs
 * @description Exported configuration object containing validated and typed environment variables.
 */
export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN, // Export the expiration time
};
