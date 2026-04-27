# Branch & PR Details

## Active Branch: `feature/kysely-user-model`

### Purpose
Integrated Kysely as the type-safe query builder and established the foundational User model and database connection for the backend.

### Key Changes

#### Backend (Infrastructure & Database)
- **Kysely Integration**: Added `kysely` and `pg` dependencies.
- **Database Module**: Implemented a global `DatabaseModule` in `backend/src/database/` that configures the PostgreSQL connection pool and initializes the Kysely instance.
- **Type Safety**: Created a central `Database` interface to map table definitions.
- **Environment Config**: Updated `.env.example` with required database variables (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

#### Backend (User Model)
- **User Schema**: Defined the `UserTable` interface with fields for `id`, `email`, `password`, `role`, and `createdAt`.
- **User Roles**: Implemented `UserRole` enum with values: `Admin`, `Ranger`, and `Junior Ranger`.
- **Type Utilities**: Exported `User`, `NewUser`, and `UserUpdate` types using Kysely's `Selectable`, `Insertable`, and `Updateable` helpers for consistent data handling.

#### Mobile
- **Configuration**: Minor updates to `tsconfig.json` for path/module resolution.

---
*Last updated: April 26, 2026*
