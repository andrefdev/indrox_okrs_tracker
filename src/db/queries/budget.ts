import { db } from "@/db";
import { budgetItem, BudgetItem } from "@/db/schema/okr-related";
import { initiative } from "@/db/schema/okr";
import { eq, desc } from "drizzle-orm";

export async function getAllBudgetItems() {
    try {
        const items = await db.query.budgetItem.findMany({
            with: {
                initiative: true,
            },
            orderBy: desc(budgetItem.createdAt),
        });
        return items;
    } catch (error) {
        console.error("Error fetching all budget items:", error);
        throw new Error("Failed to fetch budget items");
    }
}

export async function getBudgetByInitiative(initiativeId: string) {
    try {
        const items = await db.query.budgetItem.findMany({
            where: eq(budgetItem.initiativeId, initiativeId),
            orderBy: desc(budgetItem.createdAt),
        });
        return items;
    } catch (error) {
        console.error("Error fetching budget by initiative:", error);
        throw new Error("Failed to fetch budget items");
    }
}
