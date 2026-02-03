"use server";

import { revalidatePath } from "next/cache";
import { createArea, updateArea, deleteArea } from "@/db/queries/areas";
import type { NewArea } from "@/db/schema/core";

export async function createAreaAction(data: NewArea) {
    try {
        await createArea(data);
        revalidatePath("/admin/areas");
        return { success: true };
    } catch (error) {
        console.error("Error creating area:", error);
        return { success: false, error: "Failed to create area" };
    }
}

export async function updateAreaAction(id: string, data: Partial<NewArea>) {
    try {
        await updateArea(id, data);
        revalidatePath("/admin/areas");
        return { success: true };
    } catch (error) {
        console.error("Error updating area:", error);
        return { success: false, error: "Failed to update area" };
    }
}

export async function deleteAreaAction(id: string) {
    try {
        await deleteArea(id);
        revalidatePath("/admin/areas");
        return { success: true };
    } catch (error) {
        console.error("Error deleting area:", error);
        return { success: false, error: "Failed to delete area" };
    }
}
