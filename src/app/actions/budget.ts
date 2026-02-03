"use server";

import { db } from "@/db";
import { budgetItem, NewBudgetItem } from "@/db/schema/okr-related";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createBudgetItem(data: NewBudgetItem) {
    try {
        await db.insert(budgetItem).values(data);
        revalidatePath("/budget");
        return { success: true };
    } catch (error) {
        console.error("Error creating budget item:", error);
        return { success: false, error: "Failed to create budget item" };
    }
}

export async function updateBudgetItem(budgetKey: string, data: Partial<NewBudgetItem>) {
    try {
        await db.update(budgetItem).set(data).where(eq(budgetItem.budgetKey, budgetKey));
        revalidatePath("/budget");
        return { success: true };
    } catch (error) {
        console.error("Error updating budget item:", error);
        return { success: false, error: "Failed to update budget item" };
    }
}

export async function deleteBudgetItem(budgetKey: string) {
    try {
        await db.delete(budgetItem).where(eq(budgetItem.budgetKey, budgetKey));
        revalidatePath("/budget");
        return { success: true };
    } catch (error) {
        console.error("Error deleting budget item:", error);
        return { success: false, error: "Failed to delete budget item" };
    }
}
