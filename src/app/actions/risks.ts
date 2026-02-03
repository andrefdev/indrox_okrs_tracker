"use server";

import { db } from "@/db";
import { risk, NewRisk } from "@/db/schema/okr-related";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createRisk(data: NewRisk) {
    try {
        await db.insert(risk).values(data);
        revalidatePath("/risks");
        return { success: true };
    } catch (error) {
        console.error("Error creating risk:", error);
        return { success: false, error: "Failed to create risk" };
    }
}

export async function updateRisk(riskKey: string, data: Partial<NewRisk>) {
    try {
        await db.update(risk).set(data).where(eq(risk.riskKey, riskKey));
        revalidatePath("/risks");
        return { success: true };
    } catch (error) {
        console.error("Error updating risk:", error);
        return { success: false, error: "Failed to update risk" };
    }
}

export async function deleteRisk(riskKey: string) {
    try {
        await db.delete(risk).where(eq(risk.riskKey, riskKey));
        revalidatePath("/risks");
        return { success: true };
    } catch (error) {
        console.error("Error deleting risk:", error);
        return { success: false, error: "Failed to delete risk" };
    }
}
