# Auth Microservice (`auth-microservice`)

## 1. Overview

This project implements an Authentication Microservice using **NestJS**, designed with a focus on **Clean Architecture (Hexagonal Architecture)** principles and the **Command Query Responsibility Segregation (CQRS)** pattern. Its primary responsibilities include:

* User Registration
* User Login (Credentials Validation)
* JWT Token Generation
* JWT Token Verification

The microservice communicates via **NATS** messaging transport, making it suitable for distributed systems. It leverages **Prisma** as its ORM (with SQLite for development simplicity) and **JWT** for stateless authentication.

The architecture prioritizes **maintainability, scalability, and clear separation of concerns**, adhering to senior-level development standards.

---

## 2. Architectural Approach

The core architecture combines **Clean Architecture (Hexagonal)** with **CQRS**.

### 2.1. Clean Architecture / Hexagonal Architecture

This paradigm isolates the core business logic (Domain and Application layers) from external dependencies and implementation details (Infrastructure layer).

* **Domain Layer:** Contains the core business entities (e.g., `User`), value objects, and domain logic, completely independent of any framework or external service.
* **Application Layer:** Orchestrates use cases by interacting with the Domain Layer and defining interfaces (Ports) for infrastructure dependencies. It implements the CQRS command and query handlers.
* **Infrastructure Layer:** Contains concrete implementations (Adapters) for the ports defined in the Application/Domain layers (e.g., database repositories, external API clients, web controllers). It also includes framework-specific configurations (like NestJS modules, controllers).

**Key Benefits:**

* **Framework Independence:** The core logic doesn't depend on NestJS, Prisma, or NATS.
* **Testability:** Domain and Application layers can be unit-tested in isolation without databases or external services.
* **Maintainability:** Changes in infrastructure details (e.g., switching databases) have minimal impact on core logic.
* **Flexibility:** Adapters can be easily swapped or added.

### 2.2. CQRS (Command Query Responsibility Segregation)

CQRS separates operations that change state (Commands) from operations that read state (Queries).

* **Commands:** Represent an intent to change the system's state (e.g., `RegisterUserCommand`, `LoginUserCommand`). They are dispatched via a `CommandBus` and handled by a single `CommandHandler`. Commands should not return data, though in practice, they might return identifiers or status confirmations (here, returning `AuthResponseDto` for immediate feedback post-login/register).
* **Queries:** Represent a request for information (e.g., `VerifyTokenQuery`). They are dispatched via a `QueryBus` and handled by a single `QueryHandler`. Queries should not modify state.
* **Handlers:** Contain the logic to process a specific Command or Query, coordinating interactions with domain entities and infrastructure ports.

**Why CQRS?**

* **Clear Intent:** Explicitly separates read and write operations, improving code clarity and understanding.
* **Scalability:** Allows independent scaling of read and write paths. Read models can be optimized differently from write models (though not fully implemented here, the pattern facilitates it).
* **Focused Logic:** Handlers have a single responsibility, making them easier to develop, test, and maintain.
* **Flexibility:** Simplifies implementing different strategies for reads (e.g., caching, specialized read databases) versus writes.

### 2.3. Synergy: Clean Architecture + CQRS

Combining these patterns provides a robust structure:

* Clean Architecture defines the layers and dependency flow (Infrastructure depends on Application/Domain).
* CQRS organizes the logic within the Application Layer into distinct read and write flows, further enhancing separation and focus.
* Domain Ports define the contracts needed by Application Handlers, which are then implemented by Infrastructure Adapters, respecting the dependency rule.

---

## 3. Project Structure

The codebase is organized into layers reflecting the chosen architecture:

```
src/
├── auth/                     # Feature Module: Authentication
│   ├── application/          # Application Layer (Use Cases, CQRS Handlers, DTOs)
│   │   ├── commands/
│   │   │   ├── handlers/     # Logic for executing commands
│   │   │   └── impl/         # Command definitions
│   │   ├── queries/
│   │   │   ├── handlers/     # Logic for executing queries
│   │   │   └── impl/         # Query definitions
│   │   └── dto/              # Data Transfer Objects (Input Validation, Output Shaping)
│   ├── domain/                 # Domain Layer (Core Business Logic)
│   │   ├── model/            # Domain Entities (e.g., User)
│   │   └── ports/            # Interfaces for Infrastructure (Repositories, Services)
│   └── infrastructure/         # Infrastructure Layer (Adapters, Controllers, External Dependencies)
│       ├── adapters/         # Concrete implementations of Domain Ports
│       └── controllers/      # Entry points (e.g., NATS message handlers)
├── config/                   # Application Configuration (envs, constants)
├── shared/                   # Shared Infrastructure components (Prisma, Filters, etc.)
│   └── infrastructure/
└── main.ts                   # Application entry point
└── app.module.ts             # Root application module
```

**Key File Types:**

* **`.entity.ts` (Domain):** Represents core business objects and their intrinsic logic (e.g., `User.updateName`).
* **`.port.ts` (Domain):** Defines interfaces (`UserRepositoryPort`, `TokenPort`, `HasherPort`) acting as contracts for infrastructure implementations. Ensures Dependency Inversion.
* **`.command.ts` / `.query.ts` (Application):** Simple classes representing the intent of an operation.
* **`.handler.ts` (Application):** Classes decorated with `@CommandHandler` or `@QueryHandler` containing the core logic for a specific use case, orchestrating domain objects and infrastructure ports.
* **`.dto.ts` (Application):** Classes using `class-validator` for input validation and defining the shape of data transferred between layers or over the network.
* **`.adapter.ts` (Infrastructure):** Concrete implementations of domain ports using specific technologies (e.g., `PrismaUserRepository`, `JwtTokenAdapter`, `BcryptAdapter`).
* **`.controller.ts` (Infrastructure):** NestJS controllers handling incoming requests/messages (here, NATS messages via `@MessagePattern`).
* **`.module.ts`:** NestJS modules organizing providers, controllers, and dependencies.

---

## 4. Key Technologies & Dependencies

* **Node.js:** Runtime environment.
* **TypeScript:** Primary language, providing static typing and enhanced maintainability.
* **NestJS (`@nestjs/*`):** Core framework providing dependency injection, modularity, CQRS integration, microservice capabilities, and more. Chosen for its structure, scalability, and strong TypeScript support.
* **Prisma (`@prisma/client`):** Modern ORM providing type-safe database access, migrations, and excellent developer experience. Used with SQLite for development.
* **NATS (`nats`):** High-performance messaging system used as the transport layer for microservice communication.
* **JWT (`@nestjs/jwt`, `jsonwebtoken`):** Standard for creating stateless authentication tokens.
* **Bcrypt (`bcrypt`):** Industry-standard library for securely hashing passwords.
* **CQRS (`@nestjs/cqrs`):** NestJS module facilitating the implementation of the CQRS pattern (`CommandBus`, `QueryBus`, handlers).
* **Class Validator (`class-validator`):** Decorator-based validation for DTOs, ensuring data integrity at the application boundary.
* **Class Transformer (`class-transformer`):** Used implicitly by NestJS pipes for transforming plain objects to class instances.
* **Dotenv (`dotenv`), Joi (`joi`):** Used for loading and validating environment variables (`src/config/envs.ts`).

---

## 5. Setup and Running

### 5.1. Prerequisites

* Node.js (Version specified in `.nvmrc` or `package.json`, e.g., >= 16.13)
* NPM or Yarn
* NATS Server (Running locally or accessible)
* (Optional) Docker for running NATS/Database if preferred.

### 5.2. Installation

```bash
npm install
# or
yarn install
```

### 5.3. Environment Configuration

Create a `.env` file in the project root based on the required variables. Key variables include:

```dotenv
# .env example
# PORT=3000 # Optional, might be used for health checks if exposed via HTTP

# NATS Configuration
NATS_SERVERS=nats://localhost:4222 # Comma-separated if multiple

# Database (Prisma uses this implicitly via schema.prisma)
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET=YOUR_SUPER_SECRET_KEY_REPLACE_ME
JWT_EXPIRES_IN=2h # Optional, defaults to 2h if not set
```

* **Note:** The `DATABASE_URL` is primarily configured in `prisma/schema.prisma`. Ensure this points to your desired database (currently SQLite file `./dev.db`). For production, update this to a persistent database connection string.
* **Security:** **NEVER** commit your actual `JWT_SECRET` to version control. Use a strong, unique secret.

### 5.4. Database Migrations (Prisma)

Ensure your database schema is up-to-date:

```bash
npx prisma migrate dev --name init # For the first migration or subsequent changes
# or if you only need to generate the client after schema changes
npx prisma generate
```

### 5.5. Running the Service

* **Development (with hot-reloading):**
    ```bash
    npm run start:dev
    ```
* **Production:**
    ```bash
    npm run build
    npm run start:prod
    ```

The service will connect to the configured NATS server(s) and listen for messages.

---

## 6. API (NATS Message Patterns)

The microservice exposes the following NATS message patterns:

1.  **`auth.register.user`**
    * **Payload:** `RegisterUserDto` (`{ name: string, email: string, password: string }`)
    * **Response:** `AuthResponseDto` (`{ user: { id, email, name, isActive }, token: string }`) on success, or an `RpcException` on failure (e.g., email already exists, validation error).

2.  **`auth.login.user`**
    * **Payload:** `LoginUserDto` (`{ email: string, password: string }`)
    * **Response:** `AuthResponseDto` (`{ user: { id, email, name, isActive }, token: string }`) on success, or an `RpcException` on failure (e.g., invalid credentials).

3.  **`auth.verify.user`**
    * **Payload:** `string` (The JWT token)
    * **Response:** `VerifyTokenResponseDto` (`{ user: { id, email, name }, token: string }`) (user payload and potentially refreshed token) on success, or an `RpcException` (status 401) if the token is invalid or expired.

---

## 7. Error Handling

* **Standardized Errors:** The service uses NestJS's `RpcException` to throw errors suitable for microservice communication. Errors typically include a `status` (HTTP-like status code) and a `message`.
* **Global Filter:** A global exception filter (`src/shared/infrastructure/filters/rpc-exception.filter.ts`) catches all unhandled exceptions (including `RpcException` and standard `Error` instances) and formats them into a consistent JSON structure: `{ status: number, message: string, timestamp: string }`. This ensures predictable error responses for clients.
* **Validation Errors:** The global `ValidationPipe` (configured in `main.ts`) automatically handles input validation defined in DTOs using `class-validator`. Invalid requests result in an appropriate `RpcException` before reaching the handlers.

---

## 8. Best Practices Employed

* **Dependency Injection:** Leveraged heavily via NestJS for decoupling components.
* **Separation of Concerns:** Strictly enforced through Clean Architecture layers and CQRS patterns.
* **Interface-Based Programming (Ports & Adapters):** Domain/Application layers depend on abstractions (ports), not concrete implementations, enhancing flexibility and testability.
* **Configuration Management:** Centralized and validated environment configuration (`src/config`).
* **Type Safety:** Ensured through TypeScript and Prisma.
* **Input Validation:** DTOs with `class-validator` decorators validate data at the application boundary.
* **Asynchronous Operations:** Consistent use of `async/await` for non-blocking I/O.
* **Logging:** Basic logging implemented using NestJS's built-in `Logger`. Can be extended with more sophisticated logging solutions.
* **Security:** Password hashing using `bcrypt`, JWT for stateless authentication.

---

## 9. Future Considerations & Scalability

* **Independent Scaling:** CQRS allows scaling the read (query) and write (command) paths independently if performance bottlenecks arise.
* **Optimized Read Models:** Separate, denormalized read models could be introduced for complex queries, managed by event listeners (not implemented yet).
* **Event Sourcing:** The CQRS pattern provides a foundation for potentially introducing event sourcing later if complex state tracking or auditing is required.
* **Adapter Swapping:** The Ports & Adapters pattern makes it easy to swap infrastructure components (e.g., move from SQLite to PostgreSQL, change JWT library, use a different hashing algorithm) by simply creating a new adapter implementing the required port.
* **Domain Complexity:** The Domain layer can be expanded with more sophisticated business rules, value objects, and domain events without impacting other layers directly.
* **Monitoring & Tracing:** Implement distributed tracing and more detailed monitoring for production environments.
* **Caching:** Introduce caching strategies, especially for frequent queries.