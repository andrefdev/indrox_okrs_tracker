import {
    pgSchema,
    uuid,
    text,
    date,
    integer,
    real,
    timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { area, owner } from "./core";

// Define the 'okr' schema
export const okrSchema = pgSchema("okr");

/**
 * Cycle status enum
 */
export const cycleStatusEnum = okrSchema.enum("cycle_status", [
    "draft",
    "active",
    "completed",
    "archived",
]);

/**
 * Objective type enum
 */
export const objectiveTypeEnum = okrSchema.enum("objective_type", [
    "strategic",
    "tactical",
    "operational",
]);

/**
 * Status enum shared across entities
 */
export const statusEnum = okrSchema.enum("entity_status", [
    "not_started",
    "on_track",
    "at_risk",
    "off_track",
    "completed",
    "cancelled",
]);

/**
 * Priority enum
 */
export const priorityEnum = okrSchema.enum("priority", [
    "low",
    "medium",
    "high",
    "critical",
]);

/**
 * Scoring method for Key Results
 */
export const scoringMethodEnum = okrSchema.enum("scoring_method", [
    "percentage",
    "binary",
    "milestone",
]);

/**
 * Relation type for objective-initiative link
 */
export const relationTypeEnum = okrSchema.enum("relation_type", [
    "primary",
    "secondary",
]);

/**
 * Effort/Impact levels
 */
export const effortImpactEnum = okrSchema.enum("effort_impact", [
    "low",
    "medium",
    "high",
]);

// ============================================
// TABLES
// ============================================

/**
 * OKR Cycles - time periods for OKRs (Q1, Q2, etc.)
 */
export const okrCycle = okrSchema.table("okr_cycle", {
    cycleId: uuid("cycle_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    status: cycleStatusEnum("status").default("draft").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Objectives - main OKR goals
 */
export const objective = okrSchema.table("objective", {
    objectiveKey: uuid("objective_key").primaryKey().defaultRandom(),
    cycleId: uuid("cycle_id")
        .references(() => okrCycle.cycleId)
        .notNull(),
    areaId: uuid("area_id").references(() => area.areaKey),
    ownerId: uuid("owner_id")
        .references(() => owner.ownerKey)
        .notNull(),
    title: text("title").notNull(),
    description: text("description"),
    objectiveType: objectiveTypeEnum("objective_type").default("tactical").notNull(),
    priority: priorityEnum("priority").default("medium").notNull(),
    status: statusEnum("status").default("not_started").notNull(),
    confidence: integer("confidence").default(50), // 0-100
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Key Results - measurable outcomes for objectives
 */
export const keyResult = okrSchema.table("key_result", {
    krKey: uuid("kr_key").primaryKey().defaultRandom(),
    objectiveId: uuid("objective_id")
        .references(() => objective.objectiveKey, { onDelete: "cascade" })
        .notNull(),
    title: text("title").notNull(),
    metricName: text("metric_name"),
    baselineValue: text("baseline_value"),
    targetValue: text("target_value").notNull(),
    currentValue: text("current_value"),
    unit: text("unit"),
    scoringMethod: scoringMethodEnum("scoring_method").default("percentage").notNull(),
    status: statusEnum("status").default("not_started").notNull(),
    confidence: integer("confidence").default(50),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Initiatives - projects/actions to achieve objectives
 */
export const initiative = okrSchema.table("initiative", {
    initiativeKey: uuid("initiative_key").primaryKey().defaultRandom(),
    cycleId: uuid("cycle_id")
        .references(() => okrCycle.cycleId)
        .notNull(),
    ownerId: uuid("owner_id")
        .references(() => owner.ownerKey)
        .notNull(),
    areaId: uuid("area_id").references(() => area.areaKey),
    name: text("name").notNull(),
    problemStatement: text("problem_statement"),
    expectedOutcome: text("expected_outcome"),
    startDate: date("start_date"),
    dueDate: date("due_date"),
    status: statusEnum("status").default("not_started").notNull(),
    priority: priorityEnum("priority").default("medium").notNull(),
    effort: effortImpactEnum("effort").default("medium"),
    impact: effortImpactEnum("impact").default("medium"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Objective-Initiative bridge table (M:N)
 */
export const objectiveInitiative = okrSchema.table("objective_initiative", {
    objectiveId: uuid("objective_id")
        .references(() => objective.objectiveKey, { onDelete: "cascade" })
        .notNull(),
    initiativeId: uuid("initiative_id")
        .references(() => initiative.initiativeKey, { onDelete: "cascade" })
        .notNull(),
    relationType: relationTypeEnum("relation_type").default("primary").notNull(),
    weight: real("weight").default(1.0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// RELATIONS
// ============================================

/**
 * Log of Check-ins for Key Results
 */
export const keyResultCheckIn = okrSchema.table("key_result_check_in", {
    id: uuid("id").primaryKey().defaultRandom(),
    krId: uuid("kr_id")
        .references(() => keyResult.krKey, { onDelete: "cascade" })
        .notNull(),
    value: text("value").notNull(),
    previousValue: text("previous_value"),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Evidence links for Check-ins
 */
export const checkInEvidence = okrSchema.table("check_in_evidence", {
    id: uuid("id").primaryKey().defaultRandom(),
    checkInId: uuid("check_in_id")
        .references(() => keyResultCheckIn.id, { onDelete: "cascade" })
        .notNull(),
    url: text("url").notNull(),
    name: text("name"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// RELATIONS
// ============================================

export const okrCycleRelations = relations(okrCycle, ({ many }) => ({
    objectives: many(objective),
    initiatives: many(initiative),
}));

export const objectiveRelations = relations(objective, ({ one, many }) => ({
    cycle: one(okrCycle, {
        fields: [objective.cycleId],
        references: [okrCycle.cycleId],
    }),
    area: one(area, {
        fields: [objective.areaId],
        references: [area.areaKey],
    }),
    owner: one(owner, {
        fields: [objective.ownerId],
        references: [owner.ownerKey],
    }),
    keyResults: many(keyResult),
    objectiveInitiatives: many(objectiveInitiative),
}));

export const keyResultRelations = relations(keyResult, ({ one, many }) => ({
    objective: one(objective, {
        fields: [keyResult.objectiveId],
        references: [objective.objectiveKey],
    }),
    checkIns: many(keyResultCheckIn),
}));

export const initiativeRelations = relations(initiative, ({ one, many }) => ({
    cycle: one(okrCycle, {
        fields: [initiative.cycleId],
        references: [okrCycle.cycleId],
    }),
    owner: one(owner, {
        fields: [initiative.ownerId],
        references: [owner.ownerKey],
    }),
    area: one(area, {
        fields: [initiative.areaId],
        references: [area.areaKey],
    }),
    objectiveInitiatives: many(objectiveInitiative),
}));

export const objectiveInitiativeRelations = relations(
    objectiveInitiative,
    ({ one }) => ({
        objective: one(objective, {
            fields: [objectiveInitiative.objectiveId],
            references: [objective.objectiveKey],
        }),
        initiative: one(initiative, {
            fields: [objectiveInitiative.initiativeId],
            references: [initiative.initiativeKey],
        }),
    })
);

export const keyResultCheckInRelations = relations(keyResultCheckIn, ({ one, many }) => ({
    keyResult: one(keyResult, {
        fields: [keyResultCheckIn.krId],
        references: [keyResult.krKey],
    }),
    evidence: many(checkInEvidence),
}));

export const checkInEvidenceRelations = relations(checkInEvidence, ({ one }) => ({
    checkIn: one(keyResultCheckIn, {
        fields: [checkInEvidence.checkInId],
        references: [keyResultCheckIn.id],
    }),
}));

// ============================================
// TYPE EXPORTS
// ============================================

export type OkrCycle = typeof okrCycle.$inferSelect;
export type NewOkrCycle = typeof okrCycle.$inferInsert;
export type Objective = typeof objective.$inferSelect;
export type NewObjective = typeof objective.$inferInsert;
export type KeyResult = typeof keyResult.$inferSelect;
export type NewKeyResult = typeof keyResult.$inferInsert;
export type Initiative = typeof initiative.$inferSelect;
export type NewInitiative = typeof initiative.$inferInsert;
export type ObjectiveInitiative = typeof objectiveInitiative.$inferSelect;
export type NewObjectiveInitiative = typeof objectiveInitiative.$inferInsert;
export type KeyResultCheckIn = typeof keyResultCheckIn.$inferSelect;
export type NewKeyResultCheckIn = typeof keyResultCheckIn.$inferInsert;
export type CheckInEvidence = typeof checkInEvidence.$inferSelect;
export type NewCheckInEvidence = typeof checkInEvidence.$inferInsert;
