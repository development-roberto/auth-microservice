import { VerifyTokenHandler } from './handlers/verify-token.handler';

// Export Queries if needed elsewhere
export * from './impl/verify-token.query';

// Export Handlers for the module providers
export const QueryHandlers = [VerifyTokenHandler];