import { db } from "@/db";
import { risk, Risk } from "@/db/schema/okr-related";
import { owner } from "@/db/schema/core";
import { eq, desc } from "drizzle-orm";

export async function getAllRisks() {
    try {
        const risks = await db.query.risk.findMany({
            with: {
                owner: true,
            },
            orderBy: desc(risk.createdAt),
        });
        return risks;
    } catch (error) {
        console.error("Error fetching all risks:", error);
        throw new Error("Failed to fetch risks");
    }
}

export async function getRisksByEntity(entityId: string) {
    try {
        const risks = await db.query.risk.findMany({
            where: eq(risk.entityId, entityId),
            with: {
                owner: true,
            },
            orderBy: desc(risk.createdAt),
        });
        return risks;
    } catch (error) {
        console.error("Error fetching risks by entity:", error);
        throw new Error("Failed to fetch risks");
    }
}
