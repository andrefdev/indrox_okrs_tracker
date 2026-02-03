"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
    keyResult,
    keyResultCheckIn,
    checkInEvidence,
    type NewKeyResultCheckIn,
    type NewCheckInEvidence
} from "@/db/schema/okr";
import { checkin, type NewCheckin } from "@/db/schema/okr-related";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

/**
 * Get check-ins for a key result
 */
export async function getCheckIns(krId: string) {
    const checkIns = await db.query.keyResultCheckIn.findMany({
        where: eq(keyResultCheckIn.krId, krId),
        with: {
            evidence: true,
        },
        orderBy: [desc(keyResultCheckIn.createdAt)],
    });

    return checkIns;
}

/**
 * Create a new check-in
 * Updates the Key Result current value and creates evidence if provided.
 */
export async function createCheckIn(
    data: Omit<NewKeyResultCheckIn, "id" | "createdAt">,
    evidenceList: Omit<NewCheckInEvidence, "id" | "checkInId" | "createdAt">[] = []
) {
    await requireAuth();

    return await db.transaction(async (tx) => {
        // 1. Create the check-in
        const [newCheckIn] = await tx.insert(keyResultCheckIn).values(data).returning();

        // 2. Create evidence if any
        if (evidenceList.length > 0) {
            await tx.insert(checkInEvidence).values(
                evidenceList.map((e) => ({
                    ...e,
                    checkInId: newCheckIn.id,
                }))
            );
        }

        // 3. Update Key Result current value
        const [updatedKr] = await tx
            .update(keyResult)
            .set({
                currentValue: data.value,
                updatedAt: new Date()
            })
            .where(eq(keyResult.krKey, data.krId))
            .returning();

        revalidatePath(`/objectives/${updatedKr.objectiveId}`);
        return newCheckIn;
    });

}

/**
 * Create a generic check-in (for Objectives/Initiatives)
 */
export async function createGenericCheckIn(data: NewCheckin) {
    await requireAuth();

    try {
        const [newCheckIn] = await db.insert(checkin).values(data).returning();
        revalidatePath(`/objectives/${data.entityId}`); // Assumes objectives generic checkin for now
        return newCheckIn;
    } catch (error) {
        console.error("Error creating generic check-in:", error);
        throw new Error("Failed to create check-in");
    }
}

/**
 * Delete a check-in
 * Note: This does NOT revert the Key Result value automatically to avoid complexity.
 * Users should manually update if needed, or simply delete the wrong entry.
 */
export async function deleteCheckIn(checkInId: string) {
    await requireAuth();

    // Get checkin first to know KR -> Objective for revalidation
    const [checkIn] = await db
        .select({ krId: keyResultCheckIn.krId })
        .from(keyResultCheckIn)
        .where(eq(keyResultCheckIn.id, checkInId))
        .limit(1);

    if (!checkIn) return;

    await db.delete(keyResultCheckIn).where(eq(keyResultCheckIn.id, checkInId));

    // Get KR to know Objective
    const [kr] = await db
        .select({ objectiveId: keyResult.objectiveId })
        .from(keyResult)
        .where(eq(keyResult.krKey, checkIn.krId))
        .limit(1);

    if (kr) {
        revalidatePath(`/objectives/${kr.objectiveId}`);
    }
}
