import { db } from "@/db";
import { decisionLog, DecisionLog } from "@/db/schema/okr-related";
import { eq, desc } from "drizzle-orm";

export async function getAllDecisions() {
    try {
        const decisions = await db.query.decisionLog.findMany({
            with: {
                owner: true,
            },
            orderBy: desc(decisionLog.decisionDate),
        });
        return decisions;
    } catch (error) {
        console.error("Error fetching all decisions:", error);
        throw new Error("Failed to fetch decisions");
    }
}

export async function getDecisionsByEntity(entityId: string) {
    try {
        const decisions = await db.query.decisionLog.findMany({
            where: eq(decisionLog.entityId, entityId),
            with: {
                owner: true,
            },
            orderBy: desc(decisionLog.decisionDate),
        });
        return decisions;
    } catch (error) {
        console.error("Error fetching decisions by entity:", error);
        throw new Error("Failed to fetch decisions");
    }
}
