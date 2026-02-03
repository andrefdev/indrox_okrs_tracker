import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import * as coreSchema from "./schema/core";
import * as okrSchema from "./schema/okr";
import * as okrRelatedSchema from "./schema/okr-related";

const isProduction = process.env.NODE_ENV === "production";

// Combine all schemas
const schema = {
    ...coreSchema,
    ...okrSchema,
    ...okrRelatedSchema,
};

// Type for our database instance
type DbSchema = typeof schema;

// Global singleton to prevent connection exhaustion during hot reload
const globalForDb = globalThis as unknown as {
    client: Sql | undefined;
    db: PostgresJsDatabase<DbSchema> | undefined;
};

// Create postgres connection (singleton)
const client =
    globalForDb.client ??
    postgres(process.env.DATABASE_URL!, {
        prepare: false, // Required for Supabase connection pooling
        ssl: isProduction ? "require" : false,
        max: 10, // Limit max connections
    });

// In development, preserve the client across hot reloads
if (!isProduction) {
    globalForDb.client = client;
}

// Create drizzle instance (singleton)
const db = globalForDb.db ?? drizzle(client, { schema });

// In development, preserve the db instance across hot reloads
if (!isProduction) {
    globalForDb.db = db;
}

// Export database instance with all schemas
export { db };

// Re-export schemas for external use
export { coreSchema, okrSchema, okrRelatedSchema };
