
import { db } from "@/db";
import { area, owner } from "@/db/schema/core";
import { eq, asc, desc } from "drizzle-orm";
import type { NewArea } from "@/db/schema/core";

export async function getAreas() {
    return await db.query.area.findMany({
        with: {
            leadOwner: true,
        },
        orderBy: [asc(area.name)],
    });
}

export async function createArea(data: NewArea) {
    const [newArea] = await db.insert(area).values(data).returning();
    return newArea;
}

export async function updateArea(id: string, data: Partial<NewArea>) {
    const [updatedArea] = await db
        .update(area)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(area.areaKey, id))
        .returning();
    return updatedArea;
}

export async function deleteArea(id: string) {
    const [deletedArea] = await db
        .delete(area)
        .where(eq(area.areaKey, id))
        .returning();
    return deletedArea;
}
