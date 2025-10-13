# Technical Specification: [Epic Name]

**Version:** 1.0  
**Last Updated:** YYYY-MM-DD  
**Status:** ⏳ Draft | 🔄 In Review | ✅ Approved

---

## Executive Summary

**Purpose:** [One-sentence description of what this epic accomplishes technically]

**Scope:** [High-level technical scope - what systems/components are affected]

**Timeline:** [Estimated development time]

**Risk Level:** 🟢 Low | 🟡 Medium | 🔴 High

---

## Technology Stack

### Frontend

| Technology | Version | Purpose | Rationale | Alternatives Considered |
|------------|---------|---------|-----------|------------------------|
| React | 18.x | UI framework | Industry standard, team expertise | Vue.js, Svelte |
| Next.js | 14.x | React framework | SSR, routing, API routes built-in | Remix, Gatsby |
| TypeScript | 5.x | Type safety | Catch errors at compile time | Flow, vanilla JS |
| Tailwind CSS | 3.x | Styling | Utility-first, rapid development | CSS Modules, Styled Components |
| [Library] | [Ver] | [Purpose] | [Rationale] | [Alternatives] |

**Framework Selection Criteria:**
- [ ] Team expertise available
- [ ] Strong community support
- [ ] Long-term viability
- [ ] Performance characteristics
- [ ] Integration with existing stack

---

### Backend

| Technology | Version | Purpose | Rationale | Alternatives Considered |
|------------|---------|---------|-----------|------------------------|
| Node.js | 20.x | Runtime | JavaScript end-to-end, async I/O | Python, Go, Rust |
| [Framework] | [Ver] | API framework | [Why chosen] | [Alternatives] |
| [ORM/Query Builder] | [Ver] | Database access | Type-safe queries, migrations | [Alternatives] |

---

### Database

| Technology | Version | Purpose | Rationale | Alternatives Considered |
|------------|---------|---------|-----------|------------------------|
| PostgreSQL | 15.x | Primary database | ACID compliance, JSON support | MySQL, MongoDB |
| Redis | 7.x | Caching & sessions | In-memory speed, pub/sub | Memcached, Valkey |
| [Database] | [Ver] | [Purpose] | [Rationale] | [Alternatives] |

**Database Design Principles:**
- Normalization level: [3NF | denormalized for performance]
- Indexing strategy: [Index on foreign keys, frequently queried columns]
- Partitioning: [If applicable, describe strategy]
- Replication: [Read replicas, multi-region, etc.]

---

### DevOps & Infrastructure

| Technology | Purpose | Rationale | Cost Estimate |
|------------|---------|-----------|---------------|
| Vercel | Hosting & deployment | Zero-config, edge functions | $[X]/month |
| GitHub Actions | CI/CD pipeline | Native GitHub integration | Included |
| [Monitoring tool] | Observability | Real-time insights, alerting | $[X]/month |
| [CDN] | Static asset delivery | Global edge network | $[X]/month |

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│   Next.js   │────▶│  API Routes │
│   (Client)  │◀────│   (SSR)     │◀────│  (Backend)  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                                                ▼
                    ┌─────────────┐     ┌─────────────┐
                    │    Redis    │     │  PostgreSQL │
                    │   (Cache)   │     │  (Primary)  │
                    └─────────────┘     └─────────────┘
                                                │
                                                ▼
                                        ┌─────────────┐
                                        │  External   │
                                        │  Services   │
                                        └─────────────┘
```

**Key Architectural Decisions:**

1. **Server-Side Rendering (SSR):** [Why or why not]
   - Benefits: [List]
   - Trade-offs: [List]

2. **API Design:** [REST | GraphQL | tRPC]
   - Benefits: [List]
   - Trade-offs: [List]

3. **State Management:** [Redux | Zustand | React Context | Server State]
   - Benefits: [List]
   - Trade-offs: [List]

---

### Component Architecture

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Route group for auth pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/       # Route group for authenticated pages
│   │   ├── layout.tsx     # Dashboard layout
│   │   └── page.tsx       # Dashboard home
│   ├── api/               # API routes
│   │   ├── auth/
│   │   ├── users/
│   │   └── [resource]/
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components (buttons, inputs, etc.)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── modal.tsx
│   ├── features/         # Feature-specific components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── [feature]/
│   └── layouts/          # Layout components
│       ├── header.tsx
│       ├── footer.tsx
│       └── sidebar.tsx
├── lib/                  # Utility libraries
│   ├── api/             # API client & utilities
│   │   ├── client.ts    # HTTP client configuration
│   │   ├── endpoints.ts # API endpoint definitions
│   │   └── hooks.ts     # React Query hooks
│   ├── db/              # Database utilities
│   │   ├── client.ts    # Database client
│   │   ├── schema.ts    # Database schema (Prisma/Drizzle)
│   │   └── migrations/  # Database migrations
│   ├── auth/            # Authentication utilities
│   │   ├── jwt.ts
│   │   ├── session.ts
│   │   └── middleware.ts
│   └── utils/           # Helper functions
│       ├── validation.ts
│       ├── formatting.ts
│       └── errors.ts
├── hooks/               # Custom React hooks
│   ├── use-auth.ts
│   ├── use-[feature].ts
│   └── use-[utility].ts
├── types/               # TypeScript type definitions
│   ├── api.ts          # API request/response types
│   ├── database.ts     # Database entity types
│   └── ui.ts           # UI component prop types
├── styles/             # Global styles
│   └── globals.css
├── config/             # Configuration files
│   ├── site.ts         # Site metadata
│   └── constants.ts    # Application constants
└── tests/              # Test files
    ├── unit/
    ├── integration/
    └── e2e/
```

**Directory Naming Conventions:**
- `kebab-case` for directories
- `PascalCase` for component files
- `camelCase` for utility files
- `SCREAMING_SNAKE_CASE` for constants

---

## Constitution Compliance

### Article I: Library-First Principle

**Status:** ✅ Compliant | ⚠️ Exception Required | ❌ Non-Compliant

[If exception: Explain why this feature cannot be a standalone library]

**Library Extraction Plan:**

| Component/Feature | Can Be Library? | Extraction Timeline | Dependencies |
|-------------------|----------------|---------------------|--------------|
| [Component 1] | ✅ Yes | Phase 2 | None |
| [Component 2] | ⚠️ Partial | Phase 3 | Database access |
| [Component 3] | ❌ No | N/A | Tightly coupled to app |

**Rationale for Non-Library Components:**
[If any components cannot be libraries, explain why]

---

### Article II: CLI Interface Mandate

**CLI Commands:**

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build           # Production build
npm run start           # Start production server
npm run test            # Run all tests
npm run test:watch      # Run tests in watch mode
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript compiler check

# Database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with test data
npm run db:studio       # Open database GUI
npm run db:generate     # Generate Prisma/Drizzle client

# Feature-specific
npm run [feature]:test  # Test specific feature
npm run [feature]:build # Build specific feature (if library)

# Utilities
npm run clean           # Clean build artifacts
npm run format          # Format code with Prettier
```

**Input/Output Specification:**
- All CLI commands accept text input (stdin, args, files)
- All CLI commands produce text output (stdout, JSON)
- Exit codes: 0 (success), 1 (error), 2 (invalid usage)

---

### Article III: Test-First Imperative

**TDD Workflow:**

1. **Write Failing Tests (Red):**
   ```bash
   npm run test:watch
   # Write test, confirm it fails
   ```

2. **User Validation:**
   - Share test scenarios with stakeholders
   - Confirm tests capture requirements
   - Get explicit approval to proceed

3. **Implement Code (Green):**
   ```bash
   # Write minimum code to pass tests
   npm run test
   # Confirm all tests pass
   ```

4. **Refactor:**
   ```bash
   # Improve code quality
   npm run test
   # Confirm tests still pass
   ```

**Test Coverage Enforcement:**
- Minimum coverage: 80% overall
- Critical paths: 100% coverage
- CI fails if coverage drops below threshold

---

### Article VII: Simplicity Gate

**Project Structure Audit:**

- [ ] Using ≤3 projects? **[Yes/No]**
  - Current project count: [X]
  - Justification (if >3): [Explanation]

- [ ] No future-proofing? **[Yes/No]**
  - Speculative features removed: [List]

- [ ] Avoiding unnecessary features? **[Yes/No]**
  - Feature justification: [Each feature traces to user story]

**Complexity Score:** [X]/10 (target: ≤5)

**Complexity Tracking:**

| Feature | Complexity | Justification | Simplification Options |
|---------|-----------|---------------|----------------------|
| [Feature 1] | 3/10 | Core requirement | N/A |
| [Feature 2] | 7/10 | [Reason] | [How to simplify] |

---

### Article VIII: Anti-Abstraction Gate

**Framework Usage Audit:**

- [ ] Using framework directly (no unnecessary wrappers)? **[Yes/No]**
  - Examples: [Direct Next.js routing, no custom router]

- [ ] Single model representation per entity? **[Yes/No]**
  - Entities: [List]
  - Models per entity: [Should be 1:1]

**Abstraction Violations:**

| Component | Issue | Justification | Remediation Plan |
|-----------|-------|---------------|------------------|
| [Component] | [Extra layer] | [Why needed] | [How to remove] |

---

### Article IX: Integration-First Testing

**Contract Testing:**

- [ ] Contracts defined before implementation? **[Yes/No]**
  - Location: `src/contracts/` or `tests/contracts/`

- [ ] Using real databases in tests (not mocks)? **[Yes/No]**
  - Test database: [PostgreSQL test instance]
  - Reset strategy: [Transaction rollback | Truncate tables]

**Integration Test Coverage:**

| Integration Point | Contract Defined | Contract Tests | Status |
|-------------------|-----------------|----------------|--------|
| User API | ✅ | ✅ | Passing |
| Auth Service | ✅ | ⏳ | In Progress |
| Payment Gateway | ⏳ | ❌ | Pending |

---

## API Contracts

### REST Endpoints

#### POST /api/[resource]

**Purpose:** [What this endpoint does]

**Authentication:** Required | Optional | None

**Authorization:** [Required role/permission]

**Request:**

```typescript
interface [Resource]CreateRequest {
  field1: string;          // Required: [description]
  field2: number;          // Required: [description, constraints]
  field3?: boolean;        // Optional: [description, default value]
  field4: string[];        // Required: [description, min/max length]
}
```

**Request Example:**

```bash
curl -X POST https://api.example.com/api/[resource] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "field1": "example value",
    "field2": 42,
    "field3": true,
    "field4": ["item1", "item2"]
  }'
```

**Response (201 Created):**

```typescript
interface [Resource]Response {
  id: string;              // UUID v4
  field1: string;
  field2: number;
  field3: boolean;
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

**Response Example:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "field1": "example value",
  "field2": 42,
  "field3": true,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

**Error Responses:**

```typescript
// 400 Bad Request - Validation error
{
  "error": "Validation failed",
  "details": [
    {
      "field": "field2",
      "message": "Must be a positive number",
      "code": "INVALID_VALUE"
    }
  ]
}

// 401 Unauthorized - Missing or invalid token
{
  "error": "Unauthorized",
  "message": "Authentication required"
}

// 403 Forbidden - Insufficient permissions
{
  "error": "Forbidden",
  "message": "You don't have permission to create this resource"
}

// 409 Conflict - Resource already exists
{
  "error": "Conflict",
  "message": "Resource with this identifier already exists",
  "existingResourceId": "123e4567-e89b-12d3-a456-426614174000"
}

// 500 Internal Server Error
{
  "error": "Internal server error",
  "message": "An unexpected error occurred",
  "requestId": "req_abc123"  // For support debugging
}
```

**Rate Limiting:**
- 100 requests per minute per user
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

**Validation Rules:**
- `field1`: 1-255 characters, no special characters except `_-`
- `field2`: Integer between 1 and 10000
- `field4`: Array length 1-10 items

---

#### GET /api/[resource]

**Purpose:** [Retrieve a list of resources with filtering, sorting, pagination]

**Authentication:** Required | Optional | None

**Query Parameters:**

```typescript
interface [Resource]ListQuery {
  page?: number;           // Default: 1, Min: 1
  limit?: number;          // Default: 20, Min: 1, Max: 100
  sort?: 'name' | 'createdAt' | 'updatedAt';  // Default: 'createdAt'
  order?: 'asc' | 'desc';  // Default: 'desc'
  search?: string;         // Search in name, description fields
  filter?: {
    status?: 'active' | 'inactive' | 'archived';
    category?: string;
    createdAfter?: string;  // ISO 8601 date
    createdBefore?: string; // ISO 8601 date
  };
}
```

**Request Example:**

```bash
curl "https://api.example.com/api/[resource]?page=1&limit=20&sort=createdAt&order=desc&search=example" \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response (200 OK):**

```typescript
interface [Resource]ListResponse {
  data: [Resource][];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta: {
    requestId: string;
    duration: number;  // milliseconds
  };
}
```

---

#### GET /api/[resource]/:id

**Purpose:** [Retrieve a single resource by ID]

**Path Parameters:**
- `id`: Resource UUID

**Response (200 OK):**
```typescript
interface [Resource]DetailResponse extends [Resource]Response {
  // Additional fields for detailed view
  relatedField?: [RelatedType][];
  metadata?: Record<string, any>;
}
```

**Error Responses:**
- 404: Resource not found

---

#### PATCH /api/[resource]/:id

**Purpose:** [Partially update a resource]

**Request:**
```typescript
interface [Resource]UpdateRequest {
  field1?: string;         // All fields optional for PATCH
  field2?: number;
  field3?: boolean;
}
```

**Response (200 OK):**
```typescript
[Resource]Response  // Updated resource
```

---

#### DELETE /api/[resource]/:id

**Purpose:** [Soft delete or hard delete a resource]

**Response (204 No Content):**
- Empty body on success

**Note:** [Specify if soft delete or hard delete, retention policy]

---

### GraphQL Schema (if applicable)

```graphql
"""
[Resource description]
"""
type [Resource] {
  id: ID!
  field1: String!
  field2: Int!
  field3: Boolean
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relations
  relatedItems: [[RelatedType]!]!
}

"""
Input for creating a new [Resource]
"""
input [Resource]CreateInput {
  field1: String!
  field2: Int!
  field3: Boolean
}

"""
Input for updating an existing [Resource]
"""
input [Resource]UpdateInput {
  field1: String
  field2: Int
  field3: Boolean
}

"""
Filters for querying [Resource]s
"""
input [Resource]FilterInput {
  status: [Resource]Status
  createdAfter: DateTime
  createdBefore: DateTime
  search: String
}

type Query {
  """
  Get a single [Resource] by ID
  """
  [resource](id: ID!): [Resource]
  
  """
  List [Resource]s with filtering, sorting, pagination
  """
  [resources](
    filter: [Resource]FilterInput
    sort: [Resource]Sort
    page: Int = 1
    limit: Int = 20
  ): [Resource]Connection!
}

type Mutation {
  """
  Create a new [Resource]
  """
  create[Resource](input: [Resource]CreateInput!): [Resource]!
  
  """
  Update an existing [Resource]
  """
  update[Resource](id: ID!, input: [Resource]UpdateInput!): [Resource]!
  
  """
  Delete a [Resource]
  """
  delete[Resource](id: ID!): Boolean!
}

type Subscription {
  """
  Subscribe to [Resource] changes
  """
  [resource]Changed(id: ID!): [Resource]!
}

"""
Connection type for pagination
"""
type [Resource]Connection {
  edges: [[Resource]Edge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type [Resource]Edge {
  node: [Resource]!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

---

## Data Models

### Entity Relationship Diagram

```
┌─────────────────────────────────┐
│         User                     │
├─────────────────────────────────┤
│ id: UUID (PK)                    │
│ email: string (unique)           │
│ password: string (hashed)        │
│ role: enum                       │
│ createdAt: timestamp             │
│ updatedAt: timestamp             │
└─────────────────┬───────────────┘
                  │ 1
                  │
                  │ N
┌─────────────────▼───────────────┐       ┌─────────────────────────────────┐
│       [Entity1]                  │   N   │       [Entity2]                  │
├─────────────────────────────────┤ ────▶ ├─────────────────────────────────┤
│ id: UUID (PK)                    │   1   │ id: UUID (PK)                    │
│ userId: UUID (FK → User)         │       │ entity1Id: UUID (FK → Entity1)   │
│ field1: string                   │       │ field1: string                   │
│ field2: number                   │       │ field2: jsonb                    │
│ createdAt: timestamp             │       │ createdAt: timestamp             │
│ updatedAt: timestamp             │       │ updatedAt: timestamp             │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

**Relationship Summary:**
- User ↔ [Entity1]: One-to-Many (one user has many entities)
- [Entity1] ↔ [Entity2]: One-to-Many
- [Add other relationships]

---

### Database Schema

#### Table: users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- bcrypt hashed
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,  -- Soft delete
  
  -- Constraints
  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT users_role_check CHECK (role IN ('admin', 'manager', 'user', 'guest'))
);

-- Indexes
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

#### Table: [table_name]

```sql
CREATE TABLE [table_name] (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  field1 VARCHAR(255) NOT NULL,
  field2 INTEGER NOT NULL CHECK (field2 >= 0),
  field3 JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Indexes
  INDEX idx_[table]_user_id (user_id),
  INDEX idx_[table]_field1 (field1),
  INDEX idx_[table]_status (status) WHERE deleted_at IS NULL,
  INDEX idx_[table]_created_at (created_at DESC),
  
  -- Full-text search (if needed)
  INDEX idx_[table]_search ON [table_name] USING GIN(to_tsvector('english', field1))
);

-- Trigger for updated_at
CREATE TRIGGER update_[table]_updated_at
  BEFORE UPDATE ON [table_name]
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Soft delete constraint (optional)
CREATE INDEX idx_[table]_active ON [table_name] (id) WHERE deleted_at IS NULL;
```

---

### TypeScript Types

```typescript
// ============================================
// Database Types (from Prisma/Drizzle/manual)
// ============================================

/**
 * User entity from database
 */
export interface User {
  id: string;
  email: string;
  password: string;  // Never send this to client!
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type UserRole = 'admin' | 'manager' | 'user' | 'guest';

/**
 * [Entity] from database
 */
export interface [Entity] {
  id: string;
  userId: string;
  field1: string;
  field2: number;
  field3: Record<string, any> | null;
  status: [Entity]Status;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type [Entity]Status = 'active' | 'inactive' | 'archived';

// ============================================
// API Types (what goes over the wire)
// ============================================

/**
 * User data transfer object (safe for API)
 * Excludes sensitive fields like password
 */
export interface UserDTO {
  id: string;
  email: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
  lastLoginAt: string | null;  // ISO 8601 string
  createdAt: string;            // ISO 8601 string
  updatedAt: string;            // ISO 8601 string
}

/**
 * [Entity] DTO for API responses
 */
export interface [Entity]DTO {
  id: string;
  userId: string;
  field1: string;
  field2: number;
  field3: Record<string, any> | null;
  status: [Entity]Status;
  createdAt: string;  // ISO 8601 string
  updatedAt: string;  // ISO 8601 string
}

// ============================================
// Form Types (what the UI works with)
// ============================================

/**
 * Form data for creating a new user
 */
export interface UserCreateForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: UserRole;  // Optional, defaults to 'user'
}

/**
 * Form data for updating user profile
 */
export interface UserUpdateForm {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

/**
 * Form data for creating [Entity]
 */
export interface [Entity]CreateForm {
  field1: string;
  field2: number;
  field3?: Record<string, any>;
}

/**
 * Form data for updating [Entity]
 */
export interface [Entity]UpdateForm {
  field1?: string;
  field2?: number;
  field3?: Record<string, any>;
  status?: [Entity]Status;
}

// ============================================
// Validation Schemas (Zod)
// ============================================

import { z } from 'zod';

export const UserCreateSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  role: z.enum(['admin', 'manager', 'user', 'guest']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const [Entity]CreateSchema = z.object({
  field1: z.string().min(1).max(255),
  field2: z.number().int().positive(),
  field3: z.record(z.any()).optional(),
});

export const [Entity]UpdateSchema = [Entity]CreateSchema.partial();
```

---

### Migrations Strategy

**Migration Tool:** [Prisma | Drizzle | node-pg-migrate | Knex]

**Migration Workflow:**

```bash
# 1. Create migration
npm run db:migration:create add_[table]_table

# 2. Edit migration file (generated in db/migrations/)
# 3. Run migration (dev)
npm run db:migrate

# 4. Run migration (production)
npm run db:migrate:prod

# 5. Rollback (if needed)
npm run db:migrate:rollback
```

**Migration File Structure:**

```typescript
// db/migrations/YYYYMMDDHHMMSS_add_[table]_table.ts

export async function up(db: Database) {
  await db.query(`
    CREATE TABLE [table_name] (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      -- ... fields
    );
  `);
}

export async function down(db: Database) {
  await db.query(`DROP TABLE IF EXISTS [table_name];`);
}
```

**Migration Best Practices:**

- [ ] Always provide `down` migration for rollback
- [ ] Test migrations on staging before production
- [ ] Backup database before running migrations
- [ ] Keep migrations small and focused
- [ ] Never edit existing migrations (create new ones)
- [ ] Document breaking changes in migration comments

---

## Security Implementation

### Authentication

**Method:** JWT (JSON Web Tokens) with refresh tokens

**Token Flow:**

```
1. User submits credentials (POST /api/auth/login)
   ↓
2. Server validates credentials against database
   ↓
3. Server generates access token (15min) + refresh token (7d)
   ↓
4. Tokens stored:
   - Access token: Memory (or httpOnly cookie)
   - Refresh token: httpOnly, secure, sameSite cookie
   ↓
5. Client sends access token in Authorization header
   ↓
6. Server validates token on each request
   ↓
7. If expired, use refresh token to get new access token
```

**Token Structure:**

```typescript
interface JWTPayload {
  sub: string;             // User ID (subject)
  email: string;
  role: UserRole;
  iat: number;             // Issued at (Unix timestamp)
  exp: number;             // Expiration (Unix timestamp)
  jti: string;             // JWT ID (for revocation)
}

interface RefreshTokenPayload {
  sub: string;             // User ID
  tokenFamily: string;     // For rotation detection
  iat: number;
  exp: number;
  jti: string;
}
```

**Token Generation:**

```typescript
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export function generateAccessToken(user: User): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    ACCESS_TOKEN_SECRET,
    { 
      expiresIn: ACCESS_TOKEN_EXPIRY,
      jwtid: crypto.randomUUID(),
    }
  );
}

export function generateRefreshToken(user: User, tokenFamily: string): string {
  return jwt.sign(
    {
      sub: user.id,
      tokenFamily,
    },
    REFRESH_TOKEN_SECRET,
    { 
      expiresIn: REFRESH_TOKEN_EXPIRY,
      jwtid: crypto.randomUUID(),
    }
  );
}
```

**Token Validation Middleware:**

```typescript
// lib/auth/middleware.ts

export async function requireAuth(
  req: NextRequest,
  requiredRole?: UserRole
): Promise<User | null> {
  // 1. Extract token from Authorization header
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    throw new AuthError('Authentication required', 401);
  }
  
  try {
    // 2. Verify JWT signature and expiration
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as JWTPayload;
    
    // 3. Check if token is revoked (optional: check Redis blacklist)
    const isRevoked = await checkTokenRevocation(payload.jti);
    if (isRevoked) {
      throw new AuthError('Token revoked', 401);
    }
    
    // 4. Fetch user from database
    const user = await db.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.deletedAt) {
      throw new AuthError('User not found', 401);
    }
    
    // 5. Verify role if specified
    if (requiredRole && !hasRole(user.role, requiredRole)) {
      throw new AuthError('Insufficient permissions', 403);
    }
    
    return user;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthError('Token expired', 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthError('Invalid token', 401);
    }
    throw error;
  }
}
```

**Refresh Token Rotation:**

```typescript
// Prevent token replay attacks with rotation

export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
  
  // Check if token family is valid (not reused)
  const storedFamily = await redis.get(`token:family:${payload.sub}`);
  if (storedFamily !== payload.tokenFamily) {
    // Token reuse detected! Revoke all tokens for this user
    await revokeAllUserTokens(payload.sub);
    throw new AuthError('Token reuse detected', 401);
  }
  
  const user = await db.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw new AuthError('User not found', 401);
  
  // Generate new token family for rotation
  const newTokenFamily = crypto.randomUUID();
  await redis.set(`token:family:${user.id}`, newTokenFamily, 'EX', 7 * 24 * 60 * 60);
  
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user, newTokenFamily),
  };
}
```

---

### Authorization

**Role-Based Access Control (RBAC)**

| Role | Description | Capabilities |
|------|-------------|-------------|
| Admin | Full system access | All operations, user management, system settings |
| Manager | Team management | CRUD on team resources, view all, invite users |
| User | Standard access | CRUD on own resources, read public resources |
| Guest | Limited access | Read-only access to public resources |

**Permission Hierarchy:**

```typescript
const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  user: 1,
  manager: 2,
  admin: 3,
};

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
```

**Resource-Level Permissions:**

```typescript
// Check if user can perform action on resource

export async function canPerformAction(
  user: User,
  resource: Resource,
  action: 'read' | 'create' | 'update' | 'delete'
): Promise<boolean> {
  // Admins can do anything
  if (user.role === 'admin') return true;
  
  // Managers can do anything with their team's resources
  if (user.role === 'manager' && resource.teamId === user.teamId) {
    return true;
  }
  
  // Users can only modify their own resources
  if (action === 'read') {
    return resource.isPublic || resource.userId === user.id;
  }
  
  return resource.userId === user.id;
}
```

---

### Input Validation & Sanitization

**Validation Library:** Zod (runtime type validation)

```typescript
// In API route handler

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Parse and validate with Zod
    const validated = UserCreateSchema.parse(body);
    
    // If validation passes, proceed with business logic
    const user = await createUser(validated);
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code,
          })),
        },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**SQL Injection Prevention:**

```typescript
// ✅ GOOD: Parameterized queries (automatic with Prisma/Drizzle)
const user = await db.user.findUnique({
  where: { email: userEmail },  // Safe
});

// ✅ GOOD: Parameterized raw queries
const users = await db.$queryRaw`
  SELECT * FROM users WHERE email = ${userEmail}
`;

// ❌ BAD: String concatenation (NEVER DO THIS)
const users = await db.$queryRawUnsafe(
  `SELECT * FROM users WHERE email = '${userEmail}'`
);
```

**XSS Prevention:**

```typescript
// React automatically escapes content, but for special cases:

import DOMPurify from 'isomorphic-dompurify';

// Sanitize user-generated HTML
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
}

// In component
<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(userContent) }} />
```

**CSRF Protection:**

```typescript
// Using double-submit cookie pattern

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function setCSRFCookie(response: NextResponse): void {
  const token = generateCSRFToken();
  response.cookies.set('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
}

export function validateCSRFToken(req: NextRequest): void {
  const cookieToken = req.cookies.get('csrf-token')?.value;
  const headerToken = req.headers.get('x-csrf-token');
  
  if (!cookieToken || cookieToken !== headerToken) {
    throw new AuthError('CSRF token invalid', 403);
  }
}
```

---

### Rate Limiting

**Strategy:** Token bucket algorithm with Redis

```typescript
// lib/rate-limit.ts

import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

interface RateLimitConfig {
  points: number;      // Number of requests allowed
  duration: number;    // Time window in seconds
  blockDuration?: number;  // How long to block after limit
}

export class RateLimiter {
  constructor(private config: RateLimitConfig) {}
  
  async consume(key: string): Promise<void> {
    const now = Date.now();
    const windowStart = now - (this.config.duration * 1000);
    
    // Use Redis sorted set for sliding window
    const pipeline = redis.pipeline();
    
    // Remove old entries
    pipeline.zremrangebyscore(key, 0, windowStart);
    
    // Count remaining entries
    pipeline.zcard(key);
    
    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    
    // Set expiration
    pipeline.expire(key, this.config.duration);
    
    const results = await pipeline.exec();
    const count = results?.[1]?.[1] as number;
    
    if (count >= this.config.points) {
      throw new RateLimitError(
        'Rate limit exceeded',
        429,
        Math.ceil((windowStart + this.config.duration * 1000 - now) / 1000)
      );
    }
  }
}

// Usage in API route
const userRateLimiter = new RateLimiter({
  points: 100,      // 100 requests
  duration: 900,    // per 15 minutes
});

export async function POST(req: NextRequest) {
  const userId = req.user?.id;
  
  if (userId) {
    await userRateLimiter.consume(`rate:user:${userId}`);
  } else {
    // For unauthenticated users, use IP
    const ip = req.headers.get('x-forwarded-for') || req.ip;
    await userRateLimiter.consume(`rate:ip:${ip}`);
  }
  
  // Proceed with request...
}
```

**Rate Limit Headers:**

```typescript
// Add to response
response.headers.set('X-RateLimit-Limit', '100');
response.headers.set('X-RateLimit-Remaining', `${100 - count}`);
response.headers.set('X-RateLimit-Reset', `${resetTime}`);
```

---

### Data Encryption

**At Rest:**
- Database-level encryption (PostgreSQL with encryption at rest)
- Application-level encryption for sensitive fields

```typescript
// Encrypt sensitive data before storing

import crypto from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Usage
const user = await db.user.create({
  data: {
    email: email,
    ssn: encrypt(ssn),  // Encrypt before storing
  },
});

// When retrieving
const decryptedSSN = decrypt(user.ssn);
```

**In Transit:**
- TLS 1.3 minimum
- HTTPS enforced (redirect HTTP to HTTPS)
- Secure WebSocket connections (WSS)

```typescript
// Next.js security headers (next.config.js)

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ];
  }
};
```

---

## Testing Strategy

### Testing Pyramid

```
        ╱╲
       ╱E2E╲     ← Few (5-10 critical user flows)
      ╱────╲
     ╱ Intg ╲    ← Some (20-30 integration tests)
    ╱────────╲
   ╱   Unit   ╲  ← Many (100+ unit tests)
  ╱────────────╲
```

**Coverage Targets:**
- Unit tests: 80% overall, 100% for business logic
- Integration tests: All API endpoints
- E2E tests: All critical user journeys

---

### Unit Tests

**Framework:** Jest + React Testing Library

**Test Structure:**

```typescript
// src/lib/utils/validation.test.ts

import { validateEmail, validatePassword } from './validation';

describe('validateEmail', () => {
  it('should accept valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.user+tag@domain.co.uk')).toBe(true);
  });
  
  it('should reject invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
  });
  
  it('should handle edge cases', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('   ')).toBe(false);
    expect(validateEmail(null as any)).toBe(false);
  });
});

describe('validatePassword', () => {
  it('should accept strong passwords', () => {
    const result = validatePassword('MyP@ssw0rd123');
    expect(result.isValid).toBe(true);
  });
  
  it('should reject weak passwords', () => {
    const result = validatePassword('weak');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password too short');
  });
  
  it('should require special characters', () => {
    const result = validatePassword('NoSpecialChar123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Must contain special character');
  });
});
```

**Component Testing:**

```typescript
// src/components/ui/button.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('should be disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('should apply variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });
});
```

---

### Integration Tests

**Framework:** Jest + Supertest + Test Database

**Database Setup:**

```typescript
// tests/setup.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

beforeAll(async () => {
  // Run migrations on test database
  await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  // Seed test data if needed
});

beforeEach(async () => {
  // Clean database between tests
  await prisma.user.deleteMany();
  await prisma.[entity].deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma as testDb };
```

**API Route Testing:**

```typescript
// src/app/api/users/route.test.ts

import { POST, GET } from './route';
import { testDb } from '@/tests/setup';

describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const request = {
      json: async () => ({
        email: 'test@example.com',
        password: 'Test@123',
        firstName: 'Test',
        lastName: 'User',
      }),
    } as any;
    
    const response = await POST(request);
    expect(response.status).toBe(201);
    
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.email).toBe('test@example.com');
    expect(body.password).toBeUndefined();  // Should not return password
    
    // Verify in database
    const saved = await testDb.user.findUnique({
      where: { id: body.id },
    });
    expect(saved).toBeDefined();
    expect(saved?.email).toBe('test@example.com');
  });
  
  it('should reject duplicate email', async () => {
    // Create initial user
    await testDb.user.create({
      data: {
        email: 'existing@example.com',
        password: 'hashed',
        firstName: 'Existing',
        lastName: 'User',
      },
    });
    
    // Attempt to create duplicate
    const request = {
      json: async () => ({
        email: 'existing@example.com',
        password: 'Test@123',
        firstName: 'Test',
        lastName: 'User',
      }),
    } as any;
    
    const response = await POST(request);
    expect(response.status).toBe(409);
    
    const body = await response.json();
    expect(body.error).toBe('Conflict');
  });
  
  it('should validate required fields', async () => {
    const request = {
      json: async () => ({
        email: 'invalid-email',  // Invalid format
        password: 'weak',        // Too weak
      }),
    } as any;
    
    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const body = await response.json();
    expect(body.error).toBe('Validation failed');
    expect(body.details).toHaveLength(3);  // email, password, firstName
  });
});

describe('GET /api/users', () => {
  beforeEach(async () => {
    // Seed test data
    await testDb.user.createMany({
      data: [
        { email: 'user1@example.com', password: 'hashed', firstName: 'User', lastName: 'One' },
        { email: 'user2@example.com', password: 'hashed', firstName: 'User', lastName: 'Two' },
        { email: 'user3@example.com', password: 'hashed', firstName: 'User', lastName: 'Three' },
      ],
    });
  });
  
  it('should return paginated users', async () => {
    const request = {
      url: 'http://localhost:3000/api/users?page=1&limit=2',
      headers: new Headers({
        authorization: 'Bearer valid-token',
      }),
    } as any;
    
    const response = await GET(request);
    expect(response.status).toBe(200);
    
    const body = await response.json();
    expect(body.data).toHaveLength(2);
    expect(body.pagination.total).toBe(3);
    expect(body.pagination.hasNext).toBe(true);
  });
  
  it('should filter by search query', async () => {
    const request = {
      url: 'http://localhost:3000/api/users?search=One',
      headers: new Headers({
        authorization: 'Bearer valid-token',
      }),
    } as any;
    
    const response = await GET(request);
    const body = await response.json();
    
    expect(body.data).toHaveLength(1);
    expect(body.data[0].lastName).toBe('One');
  });
});
```

---

### E2E Tests

**Framework:** Playwright

**Test Structure:**

```typescript
// e2e/user-registration.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('should complete registration successfully', async ({ page }) => {
    // 1. Navigate to signup page
    await page.goto('/signup');
    await expect(page).toHaveTitle(/Sign Up/);
    
    // 2. Fill in registration form
    await page.fill('[data-testid="email-input"]', 'newuser@example.com');
    await page.fill('[data-testid="password-input"]', 'SecureP@ss123');
    await page.fill('[data-testid="confirm-password-input"]', 'SecureP@ss123');
    await page.fill('[data-testid="first-name-input"]', 'New');
    await page.fill('[data-testid="last-name-input"]', 'User');
    
    // 3. Submit form
    await page.click('[data-testid="submit-button"]');
    
    // 4. Wait for success message
    await expect(page.locator('[data-testid="success-message"]'))
      .toBeVisible();
    await expect(page.locator('[data-testid="success-message"]'))
      .toContainText('Registration successful');
    
    // 5. Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // 6. Verify user is logged in
    await expect(page.locator('[data-testid="user-menu"]'))
      .toContainText('New User');
  });
  
  test('should show validation errors for invalid input', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill in invalid data
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.fill('[data-testid="password-input"]', 'weak');
    
    // Try to submit
    await page.click('[data-testid="submit-button"]');
    
    // Verify validation errors
    await expect(page.locator('[data-testid="email-error"]'))
      .toBeVisible();
    await expect(page.locator('[data-testid="email-error"]'))
      .toContainText('Invalid email');
    
    await expect(page.locator('[data-testid="password-error"]'))
      .toContainText('Password must be at least 8 characters');
    
    // Verify form not submitted (still on signup page)
    await expect(page).toHaveURL('/signup');
  });
  
  test('should handle duplicate email gracefully', async ({ page }) => {
    // Register first user
    await page.goto('/signup');
    await page.fill('[data-testid="email-input"]', 'existing@example.com');
    await page.fill('[data-testid="password-input"]', 'SecureP@ss123');
    await page.fill('[data-testid="confirm-password-input"]', 'SecureP@ss123');
    await page.fill('[data-testid="first-name-input"]', 'First');
    await page.fill('[data-testid="last-name-input"]', 'User');
    await page.click('[data-testid="submit-button"]');
    
    // Wait for success, then log out
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    
    // Try to register with same email
    await page.goto('/signup');
    await page.fill('[data-testid="email-input"]', 'existing@example.com');
    await page.fill('[data-testid="password-input"]', 'AnotherP@ss456');
    await page.fill('[data-testid="confirm-password-input"]', 'AnotherP@ss456');
    await page.fill('[data-testid="first-name-input"]', 'Second');
    await page.fill('[data-testid="last-name-input"]', 'User');
    await page.click('[data-testid="submit-button"]');
    
    // Verify error message
    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Email already in use');
    
    // Verify helpful recovery option
    await expect(page.locator('[data-testid="login-link"]'))
      .toBeVisible();
  });
});
```

**Visual Regression Testing:**

```typescript
// e2e/visual-regression.spec.ts

test('should match dashboard screenshot', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png');
});
```

---

### Test Data Management

**Factories:**

```typescript
// tests/factories/user.factory.ts

import { faker } from '@faker-js/faker';
import { User } from '@/types';

export function createUserFactory(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: 'hashed',  // Never use real passwords
    role: 'user',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    avatarUrl: null,
    isVerified: false,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}

// Usage
const testUser = createUserFactory({
  email: 'specific@example.com',
  role: 'admin',
});
```

**Fixtures:**

```typescript
// tests/fixtures/users.json

[
  {
    "email": "admin@example.com",
    "password": "Admin@123",
    "role": "admin",
    "firstName": "Admin",
    "lastName": "User"
  },
  {
    "email": "user@example.com",
    "password": "User@123",
    "role": "user",
    "firstName": "Regular",
    "lastName": "User"
  }
]
```

---

## Performance Optimization

### Frontend Optimization

#### 1. Code Splitting & Lazy Loading

```typescript
// app/dashboard/page.tsx

import dynamic from 'next/dynamic';

// Heavy component loaded only when needed
const HeavyChart = dynamic(() => import('@/components/charts/HeavyChart'), {
  loading: () => <Spinner />,
  ssr: false,  // Client-only if not needed for SEO
});

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart data={data} />
    </div>
  );
}
```

#### 2. Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority  // Load immediately (above fold)
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Below the fold images
<Image
  src="/gallery-1.jpg"
  alt="Gallery image"
  width={800}
  height={600}
  loading="lazy"  // Lazy load
  quality={85}     // Adjust quality
  sizes="(max-width: 768px) 100vw, 50vw"  // Responsive sizes
/>
```

#### 3. Font Optimization

```typescript
// app/layout.tsx

import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }: { children: React.Node }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

#### 4. React Query Caching

```typescript
// lib/api/hooks.ts

import { useQuery } from '@tanstack/react-query';

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000,  // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Prefetch on hover for instant navigation
export function prefetchUser(userId: string) {
  queryClient.prefetchQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}
```

---

### Backend Optimization

#### 1. Database Indexing

```sql
-- Index frequently queried columns
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Composite index for common query patterns
CREATE INDEX idx_posts_user_status ON posts(user_id, status, created_at DESC);

-- Partial index for active records
CREATE INDEX idx_posts_active ON posts(id) WHERE deleted_at IS NULL AND status = 'active';

-- Full-text search index
CREATE INDEX idx_posts_search ON posts USING GIN(to_tsvector('english', title || ' ' || content));
```

#### 2. Query Optimization

```typescript
// ❌ BAD: N+1 query problem
const users = await db.user.findMany();
for (const user of users) {
  const posts = await db.post.findMany({ where: { userId: user.id } });
  user.posts = posts;  // N additional queries
}

// ✅ GOOD: Include relation in single query
const users = await db.user.findMany({
  include: {
    posts: {
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
  },
});

// ✅ GOOD: Select only needed fields
const users = await db.user.findMany({
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    // Don't select password, large text fields, etc.
  },
});
```

#### 3. Redis Caching

```typescript
// lib/cache.ts

import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600  // 1 hour default
): Promise<T> {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch fresh data
  const fresh = await fetcher();
  
  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(fresh));
  
  return fresh;
}

// Usage
export async function getUserProfile(userId: string) {
  return getCached(
    `user:profile:${userId}`,
    () => db.user.findUnique({ where: { id: userId } }),
    15 * 60  // 15 minutes
  );
}

// Invalidation on update
export async function updateUser(userId: string, data: Partial<User>) {
  const updated = await db.user.update({
    where: { id: userId },
    data,
  });
  
  // Invalidate cache
  await redis.del(`user:profile:${userId}`);
  
  return updated;
}
```

#### 4. Connection Pooling

```typescript
// lib/db/client.ts

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Connection pool configuration
// Set in DATABASE_URL:
// postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=10
```

---

### Performance Monitoring

**Key Metrics:**

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint (FCP) | < 1.8s | Vercel Analytics, Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Vercel Analytics, Lighthouse |
| First Input Delay (FID) | < 100ms | Vercel Analytics, Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Vercel Analytics, Lighthouse |
| Time to First Byte (TTFB) | < 600ms | Vercel Analytics |
| API Response Time (P95) | < 500ms | Custom logging, Sentry |

**Monitoring Setup:**

```typescript
// lib/monitoring.ts

import * as Sentry from '@sentry/nextjs';

export function trackAPIPerformance(endpoint: string, duration: number) {
  Sentry.metrics.distribution('api.response_time', duration, {
    tags: { endpoint },
    unit: 'millisecond',
  });
  
  if (duration > 1000) {
    Sentry.captureMessage(`Slow API response: ${endpoint}`, {
      level: 'warning',
      extra: { duration },
    });
  }
}

// Usage in API route
export async function GET(req: NextRequest) {
  const start = Date.now();
  
  try {
    const data = await fetchData();
    const duration = Date.now() - start;
    
    trackAPIPerformance('/api/users', duration);
    
    return NextResponse.json(data);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}
```

---

## DevOps & Deployment

### CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
# .github/workflows/deploy.yml

name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - run: npm run lint
      
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Run migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  deploy-preview:
    needs: [lint, test]
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Deploy to Vercel (Preview)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    needs: [lint, test, e2e]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Run database migrations
        run: npm run db:migrate:prod
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
      
      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
      
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "🚀 Production deployment completed",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Deployment successful*\nCommit: ${{ github.sha }}\nBranch: ${{ github.ref }}"
                  }
                }
              ]
            }
```

---

### Environment Variables

```bash
# .env.example

# ===========================
# Application
# ===========================
NODE_ENV="production"  # development | production | test
APP_URL="https://example.com"
PORT=3000

# ===========================
# Database
# ===========================
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ===========================
# Redis
# ===========================
REDIS_URL="redis://host:6379"
REDIS_PASSWORD="password"

# ===========================
# Authentication
# ===========================
JWT_SECRET="your-secret-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# ===========================
# Encryption
# ===========================
ENCRYPTION_KEY="64-char-hex-string"  # Generated with: openssl rand -hex 32

# ===========================
# External APIs
# ===========================
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

SENDGRID_API_KEY="SG...."
FROM_EMAIL="noreply@example.com"

# ===========================
# Feature Flags
# ===========================
FEATURE_NEW_DASHBOARD="true"
FEATURE_BETA_ACCESS="false"

# ===========================
# Monitoring
# ===========================
SENTRY_DSN="https://...@sentry.io/..."
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"

VERCEL_ANALYTICS_ID="..."

# ===========================
# Vercel (Auto-injected)
# ===========================
# VERCEL="1"
# VERCEL_ENV="production"
# VERCEL_URL="your-project.vercel.app"
# VERCEL_GIT_COMMIT_SHA="abc123"
```

**Environment Variable Validation:**

```typescript
// lib/env.ts

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  APP_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
});

// Validate on startup
const env = envSchema.parse(process.env);

export { env };
```

---

### Database Migrations

**On Deploy:**

```bash
# Vercel build command (vercel.json)
{
  "buildCommand": "npm run build && npm run db:migrate:deploy"
}
```

**Migration Script:**

```bash
# scripts/migrate.sh

#!/bin/bash
set -e

echo "Running database migrations..."

# Backup production database before migration
if [ "$VERCEL_ENV" = "production" ]; then
  echo "Creating backup..."
  pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
fi

# Run migrations
npm run db:migrate

echo "Migrations complete!"
```

**Rollback Strategy:**

```bash
# scripts/rollback.sh

#!/bin/bash
set -e

echo "Rolling back last migration..."

# Rollback Prisma migration
npx prisma migrate resolve --rolled-back <migration-name>

# Or manual rollback
psql $DATABASE_URL -f backup_YYYYMMDD_HHMMSS.sql

echo "Rollback complete!"
```

---

### Monitoring & Observability

**Error Tracking (Sentry):**

```typescript
// sentry.client.config.ts

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV || 'development',
  tracesSampleRate: 1.0,  // 100% in dev, lower in prod
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', /^https:\/\/yourapp\.com/],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0.1,  // 10% of sessions
  replaysOnErrorSampleRate: 1.0,  // 100% when error occurs
});
```

**Custom Metrics:**

```typescript
// lib/metrics.ts

import * as Sentry from '@sentry/nextjs';

export function trackEvent(name: string, data?: Record<string, any>) {
  Sentry.metrics.increment(name, 1, {
    tags: data,
  });
}

export function trackDuration(name: string, duration: number, tags?: Record<string, string>) {
  Sentry.metrics.distribution(name, duration, {
    tags,
    unit: 'millisecond',
  });
}

// Usage
trackEvent('user.signup', { method: 'email' });
trackDuration('api.response_time', 150, { endpoint: '/api/users' });
```

**Uptime Monitoring:**

```typescript
// Use external service like UptimeRobot, Pingdom, or implement health check

// app/api/health/route.ts

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis connection
    await redis.ping();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
      },
      { status: 503 }
    );
  }
}
```

---

## Development Workflow

### Branch Strategy

```
main (production) ← Protected, requires PR review
  └── develop (staging) ← Integration branch
       └── feature/epic-[number]-[feature-name] ← Feature branches
       └── bugfix/[issue-number]-[description] ← Bug fix branches
       └── hotfix/[critical-fix] ← Production hotfixes
```

**Branch Naming Convention:**
- Feature: `feature/001-user-authentication`
- Bug fix: `bugfix/42-login-error`
- Hotfix: `hotfix/security-vulnerability`

---

### Commit Convention

**Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**

```
feat(auth): implement JWT refresh token rotation

- Add refresh token to user session
- Implement rotation on token refresh
- Update middleware to handle expired tokens
- Add tests for token rotation flow

Closes #123
```

**Commit Linting:**

```json
// package.json

{
  "scripts": {
    "commit": "cz"
  },
  "devDependencies": {
    "@commitlint/cli": "^18.0.0",
    "@commitlint/config-conventional": "^18.0.0",
    "commitizen": "^4.3.0",
    "cz-conventional-changelog": "^3.3.0"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

---

### Code Review Checklist

#### Before Requesting Review

- [ ] All tests pass locally
- [ ] No linting errors
- [ ] TypeScript compiles without errors
- [ ] Code follows project style guide
- [ ] New features have tests
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow convention

#### Reviewer Checklist

- [ ] Code is readable and maintainable
- [ ] No unnecessary abstraction (Article VIII)
- [ ] Business logic has tests
- [ ] Security considerations addressed
- [ ] Performance impact considered
- [ ] Accessibility requirements met (if UI)
- [ ] No magic numbers or hardcoded values
- [ ] Error handling is appropriate
- [ ] Database queries are optimized
- [ ] No sensitive data in logs

---

## Implementation Phases

### Phase -1: Pre-Implementation Gates

#### Simplicity Gate (Article VII)
- [ ] Using ≤3 projects?
- [ ] No future-proofing?
- [ ] No speculative features?

#### Anti-Abstraction Gate (Article VIII)
- [ ] Using framework directly?
- [ ] Single model representation?
- [ ] No unnecessary wrappers?

#### Integration-First Gate (Article IX)
- [ ] Contracts defined?
- [ ] Contract tests written?
- [ ] Using real services in tests?

**Gate Review:** [Pass/Fail] with documented exceptions

---

### Phase 0: Foundation

**Duration:** [X days]  
**Goal:** Set up development environment and architecture

**Tasks:**

- [ ] Initialize Next.js project
  ```bash
  npx create-next-app@latest --typescript --tailwind --app
  ```

- [ ] Configure TypeScript
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noImplicitAny": true,
      "strictNullChecks": true
    }
  }
  ```

- [ ] Set up database
  - [ ] Install Prisma/Drizzle
  - [ ] Define schema
  - [ ] Create initial migration
  - [ ] Seed test data

- [ ] Configure testing framework
  - [ ] Install Jest + React Testing Library
  - [ ] Configure test environment
  - [ ] Write first test (should pass)

- [ ] Set up CI/CD pipeline
  - [ ] Create GitHub Actions workflow
  - [ ] Configure Vercel integration
  - [ ] Set up preview deployments

- [ ] Create component library structure
  - [ ] UI components (`components/ui/`)
  - [ ] Feature components (`components/features/`)
  - [ ] Layout components (`components/layouts/`)

**Deliverables:**

- [ ] Project scaffolding complete
- [ ] Development environment documented
- [ ] First test passing
- [ ] CI/CD pipeline working

---

### Phase 1: Core Implementation

[See SPRINTS.md for detailed breakdown of user stories and tasks]

**Duration:** [X weeks]  
**Goal:** Implement core functionality

---

### Phase 2: Testing & Refinement

**Duration:** [X days]  
**Goal:** Ensure completeness and quality

**Tasks:**

- [ ] Integration test suite complete
  - [ ] All API endpoints tested
  - [ ] All database operations tested
  - [ ] All external integrations tested

- [ ] E2E tests for critical paths
  - [ ] User registration flow
  - [ ] Login flow
  - [ ] Primary user journey
  - [ ] Error scenarios

- [ ] Performance optimization
  - [ ] Database queries optimized
  - [ ] Caching implemented
  - [ ] Bundle size analyzed
  - [ ] Lighthouse score >90

- [ ] Accessibility audit
  - [ ] WCAG 2.1 AA compliance
  - [ ] Keyboard navigation tested
  - [ ] Screen reader tested

- [ ] Security review
  - [ ] Input validation comprehensive
  - [ ] Authentication tested
  - [ ] Authorization tested
  - [ ] OWASP Top 10 checked

**Deliverables:**

- [ ] All tests passing
- [ ] Coverage targets met
- [ ] Performance benchmarks achieved
- [ ] Security checklist completed

---

### Phase 3: Documentation & Deployment

**Duration:** [X days]  
**Goal:** Prepare for production launch

**Tasks:**

- [ ] API documentation complete
  - [ ] All endpoints documented
  - [ ] Example requests/responses
  - [ ] Error codes explained

- [ ] User guide written
  - [ ] Getting started guide
  - [ ] Feature tutorials
  - [ ] FAQ section

- [ ] Technical documentation
  - [ ] Architecture diagrams
  - [ ] Database schema
  - [ ] Deployment guide
  - [ ] Troubleshooting guide

- [ ] Deployment runbook created
  - [ ] Pre-deployment checklist
  - [ ] Deployment steps
  - [ ] Rollback procedure
  - [ ] Post-deployment verification

- [ ] Production deployment
  - [ ] Environment variables set
  - [ ] Database migrations run
  - [ ] Monitoring configured
  - [ ] Alerting set up

- [ ] Post-launch monitoring
  - [ ] Error rate tracking
  - [ ] Performance monitoring
  - [ ] User feedback collection

**Deliverables:**

- [ ] All documentation complete
- [ ] Deployment successful
- [ ] Monitoring active
- [ ] Team trained

---

## Technical Risks & Mitigation

| Risk | Probability | Impact | Mitigation Strategy | Owner |
|------|------------|--------|-------------------|-------|
| Database performance at scale | Medium | High | Implement caching (Redis), optimize queries, add indexes, monitor query performance | Backend Lead |
| Third-party API downtime | Low | Medium | Implement circuit breaker pattern, add fallback behavior, queue requests during outage | Backend Lead |
| Security vulnerability | Low | High | Regular security audits, automated scanning (Snyk), security training for team, bug bounty program | Security Team |
| Browser compatibility issues | Medium | Low | Polyfills for older browsers, feature detection, progressive enhancement, automated cross-browser testing | Frontend Lead |
| Data migration failure | Low | High | Thorough testing on staging, backup before migration, rollback plan, dry-run migrations | DevOps Lead |
| Scaling costs exceed budget | Medium | Medium | Monitor usage closely, implement rate limiting, optimize expensive operations, set billing alerts | Product Manager |

---

## Acceptance Criteria

### Technical Acceptance

- [ ] All tests pass (unit, integration, e2e)
- [ ] Code coverage meets targets (80%+ overall, 100% critical paths)
- [ ] Performance benchmarks met (see Performance section)
- [ ] Security scan passes (no critical/high issues)
- [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] Code review approved by at least 2 developers
- [ ] Documentation complete and reviewed
- [ ] No known critical bugs

### Deployment Acceptance

- [ ] Deployed to staging without errors
- [ ] Smoke tests pass on staging
- [ ] Database migrations successful
- [ ] Environment variables configured correctly
- [ ] Monitoring and alerts active
- [ ] Rollback plan tested and documented
- [ ] Stakeholder sign-off obtained

### SLC Acceptance

- [ ] **Simple:** Core value delivered without unnecessary complexity
  - Feature count reasonable
  - UI intuitive without training
  - Code maintainable

- [ ] **Lovable:** Delightful user experience with thoughtful details
  - User feedback positive
  - Delight moments present
  - Personality evident

- [ ] **Complete:** Fully solves the problem, production-ready
  - All acceptance criteria met
  - No major gaps in functionality
  - Handles edge cases gracefully

---

## Post-Launch Checklist

### Immediate (Day 1)

- [ ] Monitor error rates (alert if >1%)
- [ ] Check performance metrics (Lighthouse, API response times)
- [ ] Verify analytics tracking working
- [ ] Monitor user feedback channels
- [ ] Team available for urgent issues

### Short-term (Week 1)

- [ ] Review initial user feedback
- [ ] Analyze usage patterns
- [ ] Address any quick wins or bugs
- [ ] Optimize based on real-world data
- [ ] Conduct retrospective with team

### Long-term (Month 1)

- [ ] Measure success against KPIs
- [ ] Gather comprehensive user feedback
- [ ] Plan next iteration based on learnings
- [ ] Document lessons learned
- [ ] Update roadmap

---

## Appendix

### Glossary

| Term | Definition |
|------|------------|
| JWT | JSON Web Token - A compact, URL-safe means of representing claims between two parties |
| RBAC | Role-Based Access Control - Authorization model that restricts access based on roles |
| TTL | Time To Live - Duration for which data is cached |
| SSR | Server-Side Rendering - Rendering pages on the server before sending to client |
| TDD | Test-Driven Development - Write tests before implementation code |

### Related Documents

- [Product Requirements Document (PRD)](./PRD_[epic_name].md)
- [Functional Specification](./FUNCTIONAL_SPEC_[epic_name].md)
- [Design Specification](./DESIGN_SPEC_[epic_name].md)
- [Sprint Planning](./SPRINTS.md)
- [Project README](./README.md)

### References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | [Name] | Initial draft |
| 1.1 | YYYY-MM-DD | [Name] | Added security section details |
| 2.0 | YYYY-MM-DD | [Name] | Major revision after architecture review |
