"use server";

import { db } from "@/db";
import { decisionLog, NewDecisionLog } from "@/db/schema/okr-related";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createDecision(data: NewDecisionLog) {
    try {
        await db.insert(decisionLog).values(data);
        revalidatePath("/decisions");
        return { success: true };
    } catch (error) {
        console.error("Error creating decision:", error);
        return { success: false, error: "Failed to create decision" };
    }
}

export async function updateDecision(decisionKey: string, data: Partial<NewDecisionLog>) {
    try {
        await db.update(decisionLog).set(data).where(eq(decisionLog.decisionKey, decisionKey));
        revalidatePath("/decisions");
        return { success: true };
    } catch (error) {
        console.error("Error updating decision:", error);
        return { success: false, error: "Failed to update decision" };
    }
}

export async function deleteDecision(decisionKey: string) {
    try {
        await db.delete(decisionLog).where(eq(decisionLog.decisionKey, decisionKey));
        revalidatePath("/decisions");
        return { success: true };
    } catch (error) {
        console.error("Error deleting decision:", error);
        return { success: false, error: "Failed to delete decision" };
    }
}
