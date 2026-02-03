import { db } from "@/db";
import { okrCycle } from "@/db/schema/okr";
import { eq, desc, asc, and, gte, lte, SQL } from "drizzle-orm";

export type CycleFilters = {
    status?: "draft" | "active" | "completed" | "archived";
    startDateFrom?: Date;
    startDateTo?: Date;
};

/**
 * Get all cycles with optional filters
 */
export async function getCycles(filters?: CycleFilters) {
    const conditions: SQL[] = [];

    if (filters?.status) {
        conditions.push(eq(okrCycle.status, filters.status));
    }

    if (filters?.startDateFrom) {
        conditions.push(gte(okrCycle.startDate, filters.startDateFrom.toISOString()));
    }

    if (filters?.startDateTo) {
        conditions.push(lte(okrCycle.startDate, filters.startDateTo.toISOString()));
    }

    const query = db
        .select()
        .from(okrCycle)
        .orderBy(desc(okrCycle.startDate));

    if (conditions.length > 0) {
        return query.where(and(...conditions));
    }

    return query;
}

/**
 * Get a single cycle by ID
 */
export async function getCycleById(cycleId: string) {
    const result = await db
        .select()
        .from(okrCycle)
        .where(eq(okrCycle.cycleId, cycleId))
        .limit(1);

    return result[0] ?? null;
}

/**
 * Get active cycle
 */
export async function getActiveCycle() {
    const result = await db
        .select()
        .from(okrCycle)
        .where(eq(okrCycle.status, "active"))
        .limit(1);

    return result[0] ?? null;
}
