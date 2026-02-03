import { db } from "@/db";
import { initiative } from "@/db/schema/okr";
import { eq, desc } from "drizzle-orm";

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
        where: (initiative, { and, eq }) => {
            if (conditions.length === 0) return undefined;
            // drizzle-orm's findMany 'where' API is different from query builder.
            // Using query builder style for filters might be easier or require simpler where clause.
            // Let's stick to simple filters for now or use the query builder if complex.
            // Actually, let's use the query builder pattern with with: {} which is compatible with findMany if we construct the where clause correctly.
            // BUT, for compatibility with the provided snippet using `eq` and `and` from `drizzle-orm`, let's rewrite to use `db.select()...` or properly construct `findMany`.

            // To simplify and ensure relations are fetched easily using `with`, `db.query` is better.
            const filterConditions = [];
            if (filters?.cycleId) filterConditions.push(eq(initiative.cycleId, filters.cycleId));
            if (filters?.areaId) filterConditions.push(eq(initiative.areaId, filters.areaId));
            if (filters?.ownerId) filterConditions.push(eq(initiative.ownerId, filters.ownerId));
            if (filters?.status) filterConditions.push(eq(initiative.status, filters.status));

            return filterConditions.length > 0 ? and(...filterConditions) : undefined;
        },
        with: {
            cycle: true,
            owner: true,
            area: true,
        },
        orderBy: [desc(initiative.createdAt)],
    });
}
