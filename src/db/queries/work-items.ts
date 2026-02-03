import { db } from "@/db";
import { workItem } from "@/db/schema/okr-related";
import { initiative } from "@/db/schema/okr";
import { owner } from "@/db/schema/core";
import { eq, and, desc, asc, ilike, SQL } from "drizzle-orm";

// ============================================
// TYPES
// ============================================

export interface WorkItemFilters {
    initiativeId?: string;
    ownerId?: string;
    status?: string;
    priority?: string;
    type?: string;
    search?: string;
}

export interface WorkItemWithRelations {
    workItem: typeof workItem.$inferSelect;
    initiative: {
        initiativeKey: string;
        name: string;
    } | null;
    owner: {
        ownerKey: string;
        fullName: string;
        email: string | null;
        role: string;
    } | null;
}

// ============================================
// QUERIES
// ============================================

/**
 * Get all work items with optional filters
 */
export async function getWorkItems(
    filters: WorkItemFilters = {}
): Promise<WorkItemWithRelations[]> {
    const conditions: SQL[] = [];

    if (filters.initiativeId) {
        conditions.push(eq(workItem.initiativeId, filters.initiativeId));
    }

    if (filters.ownerId) {
        conditions.push(eq(workItem.ownerId, filters.ownerId));
    }

    if (filters.status) {
        conditions.push(eq(workItem.status, filters.status as any));
    }

    if (filters.priority) {
        conditions.push(eq(workItem.priority, filters.priority as any));
    }

    if (filters.type) {
        conditions.push(eq(workItem.type, filters.type as any));
    }

    if (filters.search) {
        conditions.push(ilike(workItem.title, `%${filters.search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
        .select({
            workItem: workItem,
            initiative: {
                initiativeKey: initiative.initiativeKey,
                name: initiative.name,
            },
            owner: {
                ownerKey: owner.ownerKey,
                fullName: owner.fullName,
                email: owner.email,
                role: owner.role,
            },
        })
        .from(workItem)
        .leftJoin(initiative, eq(workItem.initiativeId, initiative.initiativeKey))
        .leftJoin(owner, eq(workItem.ownerId, owner.ownerKey))
        .where(whereClause)
        .orderBy(desc(workItem.createdAt));

    return results;
}

/**
 * Get a single work item by ID with full relations
 */
export async function getWorkItemById(
    workItemId: string
): Promise<WorkItemWithRelations | null> {
    const results = await db
        .select({
            workItem: workItem,
            initiative: {
                initiativeKey: initiative.initiativeKey,
                name: initiative.name,
            },
            owner: {
                ownerKey: owner.ownerKey,
                fullName: owner.fullName,
                email: owner.email,
                role: owner.role,
            },
        })
        .from(workItem)
        .leftJoin(initiative, eq(workItem.initiativeId, initiative.initiativeKey))
        .leftJoin(owner, eq(workItem.ownerId, owner.ownerKey))
        .where(eq(workItem.workitemKey, workItemId))
        .limit(1);

    return results[0] || null;
}

/**
 * Get work items for a specific initiative
 */
export async function getWorkItemsByInitiative(
    initiativeId: string
): Promise<WorkItemWithRelations[]> {
    return getWorkItems({ initiativeId });
}

/**
 * Get work items for a specific owner
 */
export async function getWorkItemsByOwner(
    ownerId: string
): Promise<WorkItemWithRelations[]> {
    return getWorkItems({ ownerId });
}
