import {
    pgSchema,
    uuid,
    text,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define the 'core' schema
export const coreSchema = pgSchema("core");

/**
 * Roles enum matching the OKR system
 */
export const userRoleEnum = coreSchema.enum("user_role", [
    "CEO",
    "CMO",
    "CTO",
    "PM",
    "DEV",
    "DEVOPS",
    "UI_DESIGNER",
]);

/**
 * Areas table - organizational units
 */
export const area = coreSchema.table("area", {
    areaKey: uuid("area_key").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    name: text("name").notNull(),
    leadOwnerId: uuid("lead_owner_id"), // FK to owner, nullable
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Owners table - users in the system
 */
export const owner = coreSchema.table("owner", {
    ownerKey: uuid("owner_key").primaryKey().defaultRandom(),
    authUserId: uuid("auth_user_id").notNull().unique(), // References Supabase auth.users
    fullName: text("full_name").notNull(),
    email: text("email"),
    role: userRoleEnum("role").notNull().default("DEV"),
    areaId: uuid("area_id").references(() => area.areaKey),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const areaRelations = relations(area, ({ one, many }) => ({
    leadOwner: one(owner, {
        fields: [area.leadOwnerId],
        references: [owner.ownerKey],
    }),
    owners: many(owner),
}));

export const ownerRelations = relations(owner, ({ one }) => ({
    area: one(area, {
        fields: [owner.areaId],
        references: [area.areaKey],
    }),
}));

// Type exports
export type Area = typeof area.$inferSelect;
export type NewArea = typeof area.$inferInsert;
export type Owner = typeof owner.$inferSelect;
export type NewOwner = typeof owner.$inferInsert;
