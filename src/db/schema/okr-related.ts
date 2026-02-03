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
import { owner } from "./core";
import { okrSchema, objective, initiative, statusEnum, priorityEnum } from "./okr";

/**
 * Entity type enum for polymorphic relations
 */
export const entityTypeEnum = okrSchema.enum("entity_type", [
    "objective",
    "key_result",
    "initiative",
    "work_item",
]);

/**
 * Work item type enum
 */
export const workItemTypeEnum = okrSchema.enum("work_item_type", [
    "task",
    "bug",
    "feature",
    "spike",
    "other",
]);

/**
 * Evidence type enum
 */
export const evidenceTypeEnum = okrSchema.enum("evidence_type", [
    "document",
    "link",
    "screenshot",
    "video",
    "other",
]);

/**
 * Dependency type enum
 */
export const dependencyTypeEnum = okrSchema.enum("dependency_type", [
    "blocks",
    "blocked_by",
    "relates_to",
]);

/**
 * Risk status enum
 */
export const riskStatusEnum = okrSchema.enum("risk_status", [
    "open",
    "mitigating",
    "mitigated",
    "accepted",
    "closed",
]);

// ============================================
// TABLES
// ============================================

/**
 * Work Items - tasks within initiatives
 */
export const workItem = okrSchema.table("work_item", {
    workitemKey: uuid("workitem_key").primaryKey().defaultRandom(),
    initiativeId: uuid("initiative_id")
        .references(() => initiative.initiativeKey, { onDelete: "cascade" })
        .notNull(),
    title: text("title").notNull(),
    type: workItemTypeEnum("type").default("task").notNull(),
    ownerId: uuid("owner_id").references(() => owner.ownerKey),
    status: statusEnum("status").default("not_started").notNull(),
    priority: priorityEnum("priority").default("medium").notNull(),
    startDate: date("start_date"),
    dueDate: date("due_date"),
    estimateHours: real("estimate_hours"),
    actualHours: real("actual_hours"),
    linkToTool: text("link_to_tool"), // Link to Jira, Linear, etc.
    acceptanceCriteria: text("acceptance_criteria"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Check-ins - progress updates for any entity
 */
export const checkin = okrSchema.table("checkin", {
    checkinKey: uuid("checkin_key").primaryKey().defaultRandom(),
    entityType: entityTypeEnum("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    ownerId: uuid("owner_id")
        .references(() => owner.ownerKey)
        .notNull(),
    checkinDate: date("checkin_date").notNull(),
    status: statusEnum("status").notNull(),
    confidence: integer("confidence"), // 0-100
    progressNote: text("progress_note"),
    nextActions: text("next_actions"),
    blockers: text("blockers"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Evidence - proof of progress
 */
export const evidence = okrSchema.table("evidence", {
    evidenceKey: uuid("evidence_key").primaryKey().defaultRandom(),
    entityType: entityTypeEnum("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    title: text("title").notNull(),
    url: text("url"),
    type: evidenceTypeEnum("type").default("link").notNull(),
    uploadedBy: uuid("uploaded_by").references(() => owner.ownerKey),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Dependencies - relationships between entities
 */
export const dependency = okrSchema.table("dependency", {
    dependencyKey: uuid("dependency_key").primaryKey().defaultRandom(),
    fromType: entityTypeEnum("from_type").notNull(),
    fromId: uuid("from_id").notNull(),
    toType: entityTypeEnum("to_type").notNull(),
    toId: uuid("to_id").notNull(),
    dependencyType: dependencyTypeEnum("dependency_type").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Risks - potential issues
 */
export const risk = okrSchema.table("risk", {
    riskKey: uuid("risk_key").primaryKey().defaultRandom(),
    entityType: entityTypeEnum("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    probability: integer("probability").notNull(), // 1-5
    impact: integer("impact").notNull(), // 1-5
    mitigation: text("mitigation"),
    ownerId: uuid("owner_id").references(() => owner.ownerKey),
    status: riskStatusEnum("status").default("open").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Budget Items - financial tracking
 */
export const budgetItem = okrSchema.table("budget_item", {
    budgetKey: uuid("budget_key").primaryKey().defaultRandom(),
    initiativeId: uuid("initiative_id")
        .references(() => initiative.initiativeKey, { onDelete: "cascade" })
        .notNull(),
    category: text("category").notNull(),
    plannedAmount: real("planned_amount").notNull(),
    actualAmount: real("actual_amount"),
    currency: text("currency").default("USD").notNull(),
    vendor: text("vendor"),
    spendDate: date("spend_date"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Decision Log - record of decisions
 */
export const decisionLog = okrSchema.table("decision_log", {
    decisionKey: uuid("decision_key").primaryKey().defaultRandom(),
    entityType: entityTypeEnum("entity_type"),
    entityId: uuid("entity_id"),
    decisionDate: date("decision_date").notNull(),
    title: text("title").notNull(),
    context: text("context"),
    decision: text("decision").notNull(),
    ownerId: uuid("owner_id").references(() => owner.ownerKey),
    evidenceUrl: text("evidence_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// RELATIONS
// ============================================

export const workItemRelations = relations(workItem, ({ one }) => ({
    initiative: one(initiative, {
        fields: [workItem.initiativeId],
        references: [initiative.initiativeKey],
    }),
    owner: one(owner, {
        fields: [workItem.ownerId],
        references: [owner.ownerKey],
    }),
}));

export const checkinRelations = relations(checkin, ({ one }) => ({
    owner: one(owner, {
        fields: [checkin.ownerId],
        references: [owner.ownerKey],
    }),
}));

export const evidenceRelations = relations(evidence, ({ one }) => ({
    uploadedByOwner: one(owner, {
        fields: [evidence.uploadedBy],
        references: [owner.ownerKey],
    }),
}));

export const riskRelations = relations(risk, ({ one }) => ({
    owner: one(owner, {
        fields: [risk.ownerId],
        references: [owner.ownerKey],
    }),
}));

export const budgetItemRelations = relations(budgetItem, ({ one }) => ({
    initiative: one(initiative, {
        fields: [budgetItem.initiativeId],
        references: [initiative.initiativeKey],
    }),
}));

export const decisionLogRelations = relations(decisionLog, ({ one }) => ({
    owner: one(owner, {
        fields: [decisionLog.ownerId],
        references: [owner.ownerKey],
    }),
}));

// ============================================
// TYPE EXPORTS
// ============================================

export type WorkItem = typeof workItem.$inferSelect;
export type NewWorkItem = typeof workItem.$inferInsert;
export type Checkin = typeof checkin.$inferSelect;
export type NewCheckin = typeof checkin.$inferInsert;
export type Evidence = typeof evidence.$inferSelect;
export type NewEvidence = typeof evidence.$inferInsert;
export type Dependency = typeof dependency.$inferSelect;
export type NewDependency = typeof dependency.$inferInsert;
export type Risk = typeof risk.$inferSelect;
export type NewRisk = typeof risk.$inferInsert;
export type BudgetItem = typeof budgetItem.$inferSelect;
export type NewBudgetItem = typeof budgetItem.$inferInsert;
export type DecisionLog = typeof decisionLog.$inferSelect;
export type NewDecisionLog = typeof decisionLog.$inferInsert;
