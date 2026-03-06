import { db } from "@/db";
import { initiative } from "@/db/schema/okr";
import { eq, and, desc } from "drizzle-orm";

export type InitiativeFilters = {
    cycleId?: string;
    areaId?: string;
    ownerId?: string;
    status?: "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled";
};

export async function getInitiatives(filters?: InitiativeFilters) {
    const conditions = [];

    if (filters?.cycleId) conditions.push(eq(initiative.cycleId, filters.cycleId));
    if (filters?.areaId) conditions.push(eq(initiative.areaId, filters.areaId));
    if (filters?.ownerId) conditions.push(eq(initiative.ownerId, filters.ownerId));
    if (filters?.status) conditions.push(eq(initiative.status, filters.status));

    return await db.query.initiative.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        with: {
            cycle: true,
            owner: true,
            area: true,
        },
        orderBy: [desc(initiative.createdAt)],
    });
}
