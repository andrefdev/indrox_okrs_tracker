"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { keyResult, type NewKeyResult } from "@/db/schema/okr";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

/**
 * Create a new key result
 */
export async function createKeyResult(
    data: Omit<NewKeyResult, "krKey" | "createdAt" | "updatedAt">
) {
    await requireAuth();

    const [created] = await db
        .insert(keyResult)
        .values(data)
        .returning();

    revalidatePath(`/objectives/${data.objectiveId}`);
    return created;
}

/**
 * Update an existing key result
 */
export async function updateKeyResult(
    krId: string,
    data: Partial<Omit<NewKeyResult, "krKey" | "createdAt" | "updatedAt">>
) {
    await requireAuth();

    const [updated] = await db
        .update(keyResult)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(keyResult.krKey, krId))
        .returning();

    if (updated?.objectiveId) {
        revalidatePath(`/objectives/${updated.objectiveId}`);
    }
    return updated;
}

/**
 * Delete a key result
 */
export async function deleteKeyResult(krId: string) {
    await requireAuth();

    // Get the KR first to know the objective
    const [kr] = await db
        .select({ objectiveId: keyResult.objectiveId })
        .from(keyResult)
        .where(eq(keyResult.krKey, krId))
        .limit(1);

    await db.delete(keyResult).where(eq(keyResult.krKey, krId));

    if (kr?.objectiveId) {
        revalidatePath(`/objectives/${kr.objectiveId}`);
    }
}

/**
 * Update key result progress
 */
export async function updateKeyResultProgress(
    krId: string,
    currentValue: string,
    status?: "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled"
) {
    await requireAuth();

    const [updated] = await db
        .update(keyResult)
        .set({
            currentValue,
            ...(status && { status }),
            updatedAt: new Date(),
        })
        .where(eq(keyResult.krKey, krId))
        .returning();

    if (updated?.objectiveId) {
        revalidatePath(`/objectives/${updated.objectiveId}`);
    }
    return updated;
}
