"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { objective, type NewObjective } from "@/db/schema/okr";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

/**
 * Create a new objective
 */
export async function createObjective(
    data: Omit<NewObjective, "objectiveKey" | "createdAt" | "updatedAt">
) {
    await requireAuth();

    const [created] = await db
        .insert(objective)
        .values(data)
        .returning();

    revalidatePath("/objectives");
    revalidatePath(`/cycles/${data.cycleId}`);
    return created;
}

/**
 * Update an existing objective
 */
export async function updateObjective(
    objectiveId: string,
    data: Partial<Omit<NewObjective, "objectiveKey" | "createdAt" | "updatedAt">>
) {
    await requireAuth();

    const [updated] = await db
        .update(objective)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(objective.objectiveKey, objectiveId))
        .returning();

    revalidatePath("/objectives");
    revalidatePath(`/objectives/${objectiveId}`);
    if (updated?.cycleId) {
        revalidatePath(`/cycles/${updated.cycleId}`);
    }
    return updated;
}

/**
 * Delete an objective (cascades to key results)
 */
export async function deleteObjective(objectiveId: string) {
    await requireAuth();

    // Get the objective first to know the cycle
    const [obj] = await db
        .select({ cycleId: objective.cycleId })
        .from(objective)
        .where(eq(objective.objectiveKey, objectiveId))
        .limit(1);

    await db.delete(objective).where(eq(objective.objectiveKey, objectiveId));

    revalidatePath("/objectives");
    if (obj?.cycleId) {
        revalidatePath(`/cycles/${obj.cycleId}`);
    }
}

/**
 * Update objective status
 */
export async function updateObjectiveStatus(
    objectiveId: string,
    status: "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled"
) {
    await requireAuth();

    const [updated] = await db
        .update(objective)
        .set({ status, updatedAt: new Date() })
        .where(eq(objective.objectiveKey, objectiveId))
        .returning();

    revalidatePath("/objectives");
    revalidatePath(`/objectives/${objectiveId}`);
    return updated;
}

/**
 * Update objective confidence
 */
export async function updateObjectiveConfidence(
    objectiveId: string,
    confidence: number
) {
    await requireAuth();

    const [updated] = await db
        .update(objective)
        .set({ confidence, updatedAt: new Date() })
        .where(eq(objective.objectiveKey, objectiveId))
        .returning();

    revalidatePath(`/objectives/${objectiveId}`);
    return updated;
}
