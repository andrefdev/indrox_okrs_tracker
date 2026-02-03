import { db } from "@/db";
import { owner, area } from "@/db/schema/core";
import { eq, asc } from "drizzle-orm";

export async function getCurrentOwner(authUserId: string) {
    const results = await db
        .select({
            owner: owner,
            area: area
        })
        .from(owner)
        .leftJoin(area, eq(owner.areaId, area.areaKey))
        .where(eq(owner.authUserId, authUserId))
        .limit(1);

    if (results.length === 0) return null;

    const { owner: ownerData, area: areaData } = results[0];
    return {
        ...ownerData,
        area: areaData
    };
}


export async function getOwners() {
    return await db.query.owner.findMany({
        with: {
            area: true,
        },
        orderBy: [asc(owner.fullName)],
    });
}

export async function createOwner(data: any) {
    const [newOwner] = await db.insert(owner).values(data).returning();
    return newOwner;
}

export async function updateOwner(id: string, data: any) {
    const [updatedOwner] = await db
        .update(owner)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(owner.ownerKey, id))
        .returning();
    return updatedOwner;
}

export async function deleteOwner(id: string) {
    const [deletedOwner] = await db
        .delete(owner)
        .where(eq(owner.ownerKey, id))
        .returning();
    return deletedOwner;
}

