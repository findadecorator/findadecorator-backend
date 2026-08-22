# Prisma 7 Migration Summary

## Schema changes
- Updated Prisma schema to be Prisma 7 compatible.
- Removed legacy datasource `url` usage from `prisma/schema.prisma` and kept the datasource definition valid for Prisma 7.
- Fixed the truncated `DomainEvent` model so the schema validates cleanly.

## prisma.config.ts
- Added `prisma.config.ts` using Prisma 7 config conventions.
- Wired the PostgreSQL connection via `DATABASE_URL` from environment using `prisma/config` and `env("DATABASE_URL")`.
- Kept migration configuration in the Prisma config instead of the schema file.

## PrismaClient initialization
- Replaced the default `new PrismaClient()` pattern with a Prisma 7-compatible PostgreSQL adapter setup.
- Added `@prisma/adapter-pg` and created a `PrismaPg` adapter using `process.env.DATABASE_URL`.
- Kept client reuse in development using a process-global singleton.
- Removed any legacy Accelerate/adapter pattern that would conflict with Prisma 7.

## Other migration work
- Updated dependencies to Prisma 7-compatible versions.
- Added a project `.env.example` for env-driven local configuration.
- Corrected backend pricing-engine import paths to match the repo layout.
- Added the missing Socket.IO dependency required for the backend to compile and run.
- Adjusted TypeScript output path so the built app starts from `dist/find-a-decorator-backend/src/server.js`.
