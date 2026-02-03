import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as coreSchema from "./schema/core";
import * as okrSchema from "./schema/okr";
import * as okrRelatedSchema from "./schema/okr-related";

// Create postgres connection
const client = postgres(process.env.DATABASE_URL!, {
    prepare: false, // Required for Supabase connection pooling
});

// Combine all schemas
const schema = {
    ...coreSchema,
    ...okrSchema,
    ...okrRelatedSchema,
};

// Export database instance with all schemas
export const db = drizzle(client, { schema });

// Re-export schemas for external use
export { coreSchema, okrSchema, okrRelatedSchema };
