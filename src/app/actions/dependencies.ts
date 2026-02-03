"use server";

import { db } from "@/db";
import { dependency, NewDependency } from "@/db/schema/okr-related";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createDependency(data: NewDependency) {
    try {
        await db.insert(dependency).values(data);
        revalidatePath("/dependencies");
        return { success: true };
    } catch (error) {
        console.error("Error creating dependency:", error);
        return { success: false, error: "Failed to create dependency" };
    }
}

export async function updateDependency(dependencyKey: string, data: Partial<NewDependency>) {
    try {
        await db.update(dependency).set(data).where(eq(dependency.dependencyKey, dependencyKey));
        revalidatePath("/dependencies");
        return { success: true };
    } catch (error) {
        console.error("Error updating dependency:", error);
        return { success: false, error: "Failed to update dependency" };
    }
}

export async function deleteDependency(dependencyKey: string) {
    try {
        await db.delete(dependency).where(eq(dependency.dependencyKey, dependencyKey));
        revalidatePath("/dependencies");
        return { success: true };
    } catch (error) {
        console.error("Error deleting dependency:", error);
        return { success: false, error: "Failed to delete dependency" };
    }
}
