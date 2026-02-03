
import { db } from "@/db";
import {
    okrCycle,
    objective,
    keyResult,
    initiative,
    statusEnum,
    priorityEnum,
} from "@/db/schema/okr";
import { evidence, entityTypeEnum } from "@/db/schema/okr-related";
import { eq, and, or, desc, asc, sql, inArray } from "drizzle-orm";

export async function getDashboardStats(cycleId: string) {
    // Counts for Objectives
    const objectivesCount = await db
        .select({
            status: objective.status,
            count: sql<number>`count(*)`,
        })
        .from(objective)
        .where(eq(objective.cycleId, cycleId))
        .groupBy(objective.status);

    // Counts for Key Results
    // We need to join with objective to filter by cycleId
    const krsCount = await db
        .select({
            status: keyResult.status,
            count: sql<number>`count(*)`,
        })
        .from(keyResult)
        .innerJoin(objective, eq(keyResult.objectiveId, objective.objectiveKey))
        .where(eq(objective.cycleId, cycleId))
        .groupBy(keyResult.status);

    // Counts for Initiatives
    const initiativesCount = await db
        .select({
            status: initiative.status,
            count: sql<number>`count(*)`,
        })
        .from(initiative)
        .where(eq(initiative.cycleId, cycleId))
        .groupBy(initiative.status);

    return {
        objectives: objectivesCount,
        keyResults: krsCount,
        initiatives: initiativesCount,
    };
}

export async function getBlockedItems(cycleId: string) {
    // Objectives "blocked" (off_track or at_risk)
    const blockedObjectives = await db.query.objective.findMany({
        where: and(
            eq(objective.cycleId, cycleId),
            or(eq(objective.status, "off_track"), eq(objective.status, "at_risk"))
        ),
        with: {
            owner: true,
        },
    });

    // Initiatives "blocked"
    const blockedInitiatives = await db.query.initiative.findMany({
        where: and(
            eq(initiative.cycleId, cycleId),
            or(eq(initiative.status, "off_track"), eq(initiative.status, "at_risk"))
        ),
        with: {
            owner: true,
        },
    });

    return {
        objectives: blockedObjectives,
        initiatives: blockedInitiatives,
    };
}

export async function getItemsWithoutRecentEvidence(cycleId: string, days: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // This is a bit complex in pure ORM without raw custom queries for "latest evidence",
    // but we can try to find items where NO evidence exists after cutoffDate.
    // A simpler approach for the dashboard:
    // 1. Get all active initiatives in cycle
    // 2. For each, check if it has evidence > cutoffDate.
    // Optimization: Subquery.

    // Allow fetching objectives/initiatives that do NOT have evidence created after cutoffDate.

    // Subquery for entities with recent evidence
    const recentEvidence = db
        .select({ entityId: evidence.entityId })
        .from(evidence)
        .where(
            and(
                sql`${evidence.createdAt} > ${cutoffDate.toISOString()}`
            )
        );

    const staleInitiatives = await db.query.initiative.findMany({
        where: and(
            eq(initiative.cycleId, cycleId),
            // Status is active-ish (not completed, not cancelled) - optional refinement
            // notInArray(initiative.status, ["completed", "cancelled"]), 
            // For now, let's just check existence
            // We use 'not exists' logic via 'notIn' if possible, or filtered js side for small datasets.
            // Drizzle 'notInArray' is safer.
            // @ts-ignore - 'notInArray' works but recentEvidence is a query. Drizzle supports this.
            sql`${initiative.initiativeKey} NOT IN (${recentEvidence})`
        ),
        with: {
            owner: true,
        },
        limit: 10,
    });

    // We can do the same for objectives if needed, but usually initiatives drive evidence.
    // Let's stick to initiatives for "Execution Evidence".

    return staleInitiatives;
}

export async function getHighPriorityItems(cycleId: string) {
    const highPriorityObjectives = await db.query.objective.findMany({
        where: and(
            eq(objective.cycleId, cycleId),
            inArray(objective.priority, ["high", "critical"])
        ),
        orderBy: [desc(objective.priority)], // Critical first? Enum sorting might need care, usually maps to string.
        // If enum is string, 'critical' < 'high' alphabetically? No.
        // If we want specific order we might need a map or specific querying.
        // For simplicity, just listing them.
        limit: 5,
        with: {
            owner: true,
        }
    });

    const highPriorityInitiatives = await db.query.initiative.findMany({
        where: and(
            eq(initiative.cycleId, cycleId),
            inArray(initiative.priority, ["high", "critical"])
        ),
        orderBy: [asc(initiative.dueDate)], // Close due dates first
        limit: 5,
        with: {
            owner: true,
        }
    });

    return {
        objectives: highPriorityObjectives,
        initiatives: highPriorityInitiatives,
    };
}
