import { LoginUserHandler } from './handlers/login-user.handler';
import { RegisterUserHandler } from './handlers/register-user.handler';

// Export Commands if needed elsewhere, though often only Handlers are exported for the module
export * from './impl/login-user.command';
export * from './impl/register-user.command';

// Export Handlers for the module providers
export const CommandHandlers = [LoginUserHandler, RegisterUserHandler];