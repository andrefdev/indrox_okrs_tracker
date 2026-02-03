import { db } from "@/db";
import { dependency } from "@/db/schema/okr-related";
import { eq, desc, or } from "drizzle-orm";

export async function getAllDependencies() {
    try {
        const dependencies = await db.query.dependency.findMany({
            orderBy: desc(dependency.createdAt),
        });
        return dependencies;
    } catch (error) {
        console.error("Error fetching all dependencies:", error);
        throw new Error("Failed to fetch dependencies");
    }
}

export async function getDependenciesByEntity(entityId: string) {
    try {
        const dependencies = await db.query.dependency.findMany({
            where: or(
                eq(dependency.fromId, entityId),
                eq(dependency.toId, entityId)
            ),
            orderBy: desc(dependency.createdAt),
        });
        return dependencies;
    } catch (error) {
        console.error("Error fetching dependencies by entity:", error);
        throw new Error("Failed to fetch dependencies");
    }
}
