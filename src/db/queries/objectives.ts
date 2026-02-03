import { db } from "@/db";
import {
    objective,
    keyResult,
    initiative,
    objectiveInitiative,
    okrCycle,
    keyResultCheckIn,
} from "@/db/schema/okr";
import {
    checkin,
    evidence,
    risk,
    dependency,
    decisionLog,
} from "@/db/schema/okr-related";
import { owner, area } from "@/db/schema/core";
import { eq, desc, and, SQL, inArray } from "drizzle-orm";

export type ObjectiveFilters = {
    cycleId?: string;
    areaId?: string;
    ownerId?: string;
    status?: "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled";
    priority?: "low" | "medium" | "high" | "critical";
    objectiveType?: "strategic" | "tactical" | "operational";
};

/**
 * Get objectives with optional filters and relations
 */
export async function getObjectives(filters?: ObjectiveFilters) {
    const conditions: SQL[] = [];

    if (filters?.cycleId) {
        conditions.push(eq(objective.cycleId, filters.cycleId));
    }
    if (filters?.areaId) {
        conditions.push(eq(objective.areaId, filters.areaId));
    }
    if (filters?.ownerId) {
        conditions.push(eq(objective.ownerId, filters.ownerId));
    }
    if (filters?.status) {
        conditions.push(eq(objective.status, filters.status));
    }
    if (filters?.priority) {
        conditions.push(eq(objective.priority, filters.priority));
    }
    if (filters?.objectiveType) {
        conditions.push(eq(objective.objectiveType, filters.objectiveType));
    }

    const baseQuery = db
        .select({
            objective: objective,
            owner: {
                ownerKey: owner.ownerKey,
                fullName: owner.fullName,
                email: owner.email,
                role: owner.role,
            },
            area: {
                areaKey: area.areaKey,
                name: area.name,
                code: area.code,
            },
            cycle: {
                cycleId: okrCycle.cycleId,
                name: okrCycle.name,
            },
        })
        .from(objective)
        .leftJoin(owner, eq(objective.ownerId, owner.ownerKey))
        .leftJoin(area, eq(objective.areaId, area.areaKey))
        .leftJoin(okrCycle, eq(objective.cycleId, okrCycle.cycleId))
        .orderBy(desc(objective.createdAt));

    if (conditions.length > 0) {
        return baseQuery.where(and(...conditions));
    }

    return baseQuery;
}

/**
 * Get a single objective by ID with all related data
 */
export async function getObjectiveById(objectiveId: string) {
    // Get the main objective with owner, area, and cycle
    const [mainObjective] = await db
        .select({
            objective: objective,
            owner: {
                ownerKey: owner.ownerKey,
                fullName: owner.fullName,
                email: owner.email,
                role: owner.role,
            },
            area: {
                areaKey: area.areaKey,
                name: area.name,
                code: area.code,
            },
            cycle: {
                cycleId: okrCycle.cycleId,
                name: okrCycle.name,
                status: okrCycle.status,
            },
        })
        .from(objective)
        .leftJoin(owner, eq(objective.ownerId, owner.ownerKey))
        .leftJoin(area, eq(objective.areaId, area.areaKey))
        .leftJoin(okrCycle, eq(objective.cycleId, okrCycle.cycleId))
        .where(eq(objective.objectiveKey, objectiveId))
        .limit(1);

    if (!mainObjective) {
        return null;
    }

    // Get related Key Results with Check-ins and Evidence
    const keyResults = await db.query.keyResult.findMany({
        where: eq(keyResult.objectiveId, objectiveId),
        with: {
            checkIns: {
                with: {
                    evidence: true,
                },
                orderBy: [desc(keyResultCheckIn.createdAt)],
            },
        },
        orderBy: [keyResult.createdAt],
    });

    // Get linked initiatives via bridge table
    const initiativeLinks = await db
        .select({
            initiative: initiative,
            relationType: objectiveInitiative.relationType,
            weight: objectiveInitiative.weight,
            initiativeOwner: {
                ownerKey: owner.ownerKey,
                fullName: owner.fullName,
            },
        })
        .from(objectiveInitiative)
        .innerJoin(initiative, eq(objectiveInitiative.initiativeId, initiative.initiativeKey))
        .leftJoin(owner, eq(initiative.ownerId, owner.ownerKey))
        .where(eq(objectiveInitiative.objectiveId, objectiveId));

    // Get check-ins for this objective (Objective-level check-ins)
    const objectiveCheckins = await db
        .select({
            checkin: checkin,
            owner: {
                ownerKey: owner.ownerKey,
                fullName: owner.fullName,
            },
        })
        .from(checkin)
        .leftJoin(owner, eq(checkin.ownerId, owner.ownerKey))
        .where(
            and(
                eq(checkin.entityType, "objective"),
                eq(checkin.entityId, objectiveId)
            )
        )
        .orderBy(desc(checkin.checkinDate));

    // Get evidence for this objective (Objective-level evidence)
    const objectiveEvidence = await db
        .select({
            evidence: evidence,
            uploadedBy: {
                ownerKey: owner.ownerKey,
                fullName: owner.fullName,
            },
        })
        .from(evidence)
        .leftJoin(owner, eq(evidence.uploadedBy, owner.ownerKey))
        .where(
            and(
                eq(evidence.entityType, "objective"),
                eq(evidence.entityId, objectiveId)
            )
        )
        .orderBy(desc(evidence.createdAt));

    // Get risks for this objective
    const risks = await db
        .select({
            risk: risk,
            owner: {
                ownerKey: owner.ownerKey,
                fullName: owner.fullName,
            },
        })
        .from(risk)
        .leftJoin(owner, eq(risk.ownerId, owner.ownerKey))
        .where(
            and(
                eq(risk.entityType, "objective"),
                eq(risk.entityId, objectiveId)
            )
        )
        .orderBy(desc(risk.createdAt));

    // Get dependencies for this objective
    const dependencies = await db
        .select()
        .from(dependency)
        .where(
            and(
                eq(dependency.fromType, "objective"),
                eq(dependency.fromId, objectiveId)
            )
        );

    // Get decisions related to this objective
    const decisions = await db
        .select({
            decision: decisionLog,
            owner: {
                ownerKey: owner.ownerKey,
                fullName: owner.fullName,
            },
        })
        .from(decisionLog)
        .leftJoin(owner, eq(decisionLog.ownerId, owner.ownerKey))
        .where(
            and(
                eq(decisionLog.entityType, "objective"),
                eq(decisionLog.entityId, objectiveId)
            )
        )
        .orderBy(desc(decisionLog.decisionDate));

    // Aggregate Check-ins and Evidence
    // We already have KR checkins nested in keyResults.
    // We can also flatten them if needed, but passing the full KR structure is better context.

    return {
        ...mainObjective,
        keyResults,
        initiatives: initiativeLinks,
        checkins: objectiveCheckins,
        evidence: objectiveEvidence,
        risks,
        dependencies,
        decisions,
    };
}
