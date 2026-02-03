"use server";

import { db } from "@/db";
import { evidence, type NewEvidence } from "@/db/schema/okr-related";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export async function createEvidence(data: NewEvidence) {
    await requireAuth();

    try {
        const [newEvidence] = await db.insert(evidence).values(data).returning();
        revalidatePath(`/objectives/${data.entityId}`); // Assumes objective context
        return newEvidence;
    } catch (error) {
        console.error("Error creating evidence:", error);
        throw new Error("Failed to create evidence");
    }
}
