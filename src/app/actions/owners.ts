"use server";

import { revalidatePath } from "next/cache";
import { createOwner, updateOwner, deleteOwner } from "@/db/queries/owners";
import type { NewOwner } from "@/db/schema/core";

export async function createOwnerAction(data: NewOwner) {
    try {
        await createOwner(data);
        revalidatePath("/admin/owners");
        return { success: true };
    } catch (error) {
        console.error("Error creating owner:", error);
        return { success: false, error: "Failed to create owner" };
    }
}


export async function updateOwnerAction(id: string, data: Partial<NewOwner>) {
    try {
        await updateOwner(id, data);
        revalidatePath("/admin/owners");
        return { success: true };
    } catch (error) {
        console.error("Error updating owner:", error);
        return { success: false, error: "Failed to update owner" };
    }
}

export async function deleteOwnerAction(id: string) {
    try {
        await deleteOwner(id);
        revalidatePath("/admin/owners");
        return { success: true };
    } catch (error) {
        console.error("Error deleting owner:", error);
        return { success: false, error: "Failed to delete owner" };
    }
}
