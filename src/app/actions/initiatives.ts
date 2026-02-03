"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
    initiative,
    objectiveInitiative,
    type NewInitiative,
    type NewObjectiveInitiative,
} from "@/db/schema/okr";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

/**
 * Create a new initiative
 */
export async function createInitiative(
    data: Omit<NewInitiative, "initiativeKey" | "createdAt" | "updatedAt">
) {
    await requireAuth();

    const [created] = await db
        .insert(initiative)
        .values(data)
        .returning();

    revalidatePath("/initiatives");
    revalidatePath(`/cycles/${data.cycleId}`);
    return created;
}

/**
 * Update an existing initiative
 */
export async function updateInitiative(
    initiativeId: string,
    data: Partial<Omit<NewInitiative, "initiativeKey" | "createdAt" | "updatedAt">>
) {
    await requireAuth();

    const [updated] = await db
        .update(initiative)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(initiative.initiativeKey, initiativeId))
        .returning();

    revalidatePath("/initiatives");
    revalidatePath(`/initiatives/${initiativeId}`);
    if (updated?.cycleId) {
        revalidatePath(`/cycles/${updated.cycleId}`);
    }
    return updated;
}

/**
 * Delete an initiative (cascades to work items, budget items)
 */
export async function deleteInitiative(initiativeId: string) {
    await requireAuth();

    // Get the initiative first to know the cycle
    const [init] = await db
        .select({ cycleId: initiative.cycleId })
        .from(initiative)
        .where(eq(initiative.initiativeKey, initiativeId))
        .limit(1);

    await db.delete(initiative).where(eq(initiative.initiativeKey, initiativeId));

    revalidatePath("/initiatives");
    if (init?.cycleId) {
        revalidatePath(`/cycles/${init.cycleId}`);
    }
}

/**
 * Link an initiative to an objective
 */
export async function linkInitiativeToObjective(
    initiativeId: string,
    objectiveId: string,
    relationType: "primary" | "secondary" = "primary",
    weight: number = 1.0
) {
    await requireAuth();

    const [link] = await db
        .insert(objectiveInitiative)
        .values({
            initiativeId,
            objectiveId,
            relationType,
            weight,
        })
        .onConflictDoUpdate({
            target: [objectiveInitiative.initiativeId, objectiveInitiative.objectiveId],
            set: { relationType, weight },
        })
        .returning();

    revalidatePath(`/objectives/${objectiveId}`);
    revalidatePath(`/initiatives/${initiativeId}`);
    return link;
}

/**
 * Unlink an initiative from an objective
 */
export async function unlinkInitiativeFromObjective(
    initiativeId: string,
    objectiveId: string
) {
    await requireAuth();

    await db
        .delete(objectiveInitiative)
        .where(
            and(
                eq(objectiveInitiative.initiativeId, initiativeId),
                eq(objectiveInitiative.objectiveId, objectiveId)
            )
        );

    revalidatePath(`/objectives/${objectiveId}`);
    revalidatePath(`/initiatives/${initiativeId}`);
}

/**
 * Update initiative status
 */
export async function updateInitiativeStatus(
    initiativeId: string,
    status: "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled"
) {
    await requireAuth();

    const [updated] = await db
        .update(initiative)
        .set({ status, updatedAt: new Date() })
        .where(eq(initiative.initiativeKey, initiativeId))
        .returning();

    revalidatePath("/initiatives");
    revalidatePath(`/initiatives/${initiativeId}`);
    return updated;
}
