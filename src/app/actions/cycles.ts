"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { okrCycle, type NewOkrCycle } from "@/db/schema/okr";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

/**
 * Create a new OKR cycle
 */
export async function createCycle(data: Omit<NewOkrCycle, "cycleId" | "createdAt" | "updatedAt">) {
    await requireAuth();

    const [cycle] = await db
        .insert(okrCycle)
        .values(data)
        .returning();

    revalidatePath("/cycles");
    return cycle;
}

/**
 * Update an existing cycle
 */
export async function updateCycle(
    cycleId: string,
    data: Partial<Omit<NewOkrCycle, "cycleId" | "createdAt" | "updatedAt">>
) {
    await requireAuth();

    const [updated] = await db
        .update(okrCycle)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(okrCycle.cycleId, cycleId))
        .returning();

    revalidatePath("/cycles");
    revalidatePath(`/cycles/${cycleId}`);
    return updated;
}

/**
 * Delete a cycle
 */
export async function deleteCycle(cycleId: string) {
    await requireAuth();

    await db.delete(okrCycle).where(eq(okrCycle.cycleId, cycleId));

    revalidatePath("/cycles");
}

/**
 * Activate a cycle (set status to active)
 */
export async function activateCycle(cycleId: string) {
    await requireAuth();

    // First, deactivate any currently active cycle
    await db
        .update(okrCycle)
        .set({ status: "archived", updatedAt: new Date() })
        .where(eq(okrCycle.status, "active"));

    // Then activate the selected cycle
    const [activated] = await db
        .update(okrCycle)
        .set({ status: "active", updatedAt: new Date() })
        .where(eq(okrCycle.cycleId, cycleId))
        .returning();

    revalidatePath("/cycles");
    revalidatePath(`/cycles/${cycleId}`);
    return activated;
}

/**
 * Complete a cycle
 */
export async function completeCycle(cycleId: string) {
    await requireAuth();

    const [completed] = await db
        .update(okrCycle)
        .set({ status: "completed", updatedAt: new Date() })
        .where(eq(okrCycle.cycleId, cycleId))
        .returning();

    revalidatePath("/cycles");
    revalidatePath(`/cycles/${cycleId}`);
    return completed;
}
