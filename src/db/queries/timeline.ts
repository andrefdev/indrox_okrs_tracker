import { db } from "@/db";
import {
    objective,
    keyResult,
    initiative,
    objectiveInitiative,
    okrCycle,
} from "@/db/schema/okr";
import { workItem } from "@/db/schema/okr-related";
import { owner, area } from "@/db/schema/core";
import { eq, inArray, desc } from "drizzle-orm";

export interface TimelineWorkItem {
    workItem: typeof workItem.$inferSelect;
    owner: { ownerKey: string; fullName: string } | null;
}

export interface TimelineInitiative {
    initiative: typeof initiative.$inferSelect;
    owner: { ownerKey: string; fullName: string } | null;
    relationType: string;
    workItems: TimelineWorkItem[];
}

export interface TimelineObjective {
    objective: typeof objective.$inferSelect;
    owner: { ownerKey: string; fullName: string } | null;
    area: { areaKey: string; name: string; code: string } | null;
    keyResults: (typeof keyResult.$inferSelect)[];
    initiatives: TimelineInitiative[];
}

export interface TimelineData {
    cycle: typeof okrCycle.$inferSelect;
    objectives: TimelineObjective[];
}

/**
 * Get all timeline data for a cycle: objectives -> key results, initiatives -> work items
 */
export async function getTimelineData(
    cycleId: string
): Promise<TimelineData | null> {
    // 1. Get the cycle
    const [cycle] = await db
        .select()
        .from(okrCycle)
        .where(eq(okrCycle.cycleId, cycleId))
        .limit(1);

    if (!cycle) return null;

    // 2. Get objectives for this cycle
    const objectives = await db
        .select({
            objective: objective,
            owner: {
                ownerKey: owner.ownerKey,
                fullName: owner.fullName,
            },
            area: {
                areaKey: area.areaKey,
                name: area.name,
                code: area.code,
            },
        })
        .from(objective)
        .leftJoin(owner, eq(objective.ownerId, owner.ownerKey))
        .leftJoin(area, eq(objective.areaId, area.areaKey))
        .where(eq(objective.cycleId, cycleId))
        .orderBy(objective.priority, objective.createdAt);

    if (objectives.length === 0) {
        return { cycle, objectives: [] };
    }

    const objectiveIds = objectives.map((o) => o.objective.objectiveKey);

    // 3. Get key results for all objectives
    const krs = await db
        .select()
        .from(keyResult)
        .where(inArray(keyResult.objectiveId, objectiveIds))
        .orderBy(keyResult.createdAt);

    // 4. Get initiative links with initiative data
    const initLinks = await db
        .select({
            objectiveId: objectiveInitiative.objectiveId,
            relationType: objectiveInitiative.relationType,
            initiative: initiative,
            owner: {
                ownerKey: owner.ownerKey,
                fullName: owner.fullName,
            },
        })
        .from(objectiveInitiative)
        .innerJoin(
            initiative,
            eq(objectiveInitiative.initiativeId, initiative.initiativeKey)
        )
        .leftJoin(owner, eq(initiative.ownerId, owner.ownerKey))
        .where(inArray(objectiveInitiative.objectiveId, objectiveIds));

    // 5. Get work items for all linked initiatives
    const initiativeIds = [
        ...new Set(initLinks.map((l) => l.initiative.initiativeKey)),
    ];

    let workItems: TimelineWorkItem[] = [];
    if (initiativeIds.length > 0) {
        workItems = await db
            .select({
                workItem: workItem,
                owner: {
                    ownerKey: owner.ownerKey,
                    fullName: owner.fullName,
                },
            })
            .from(workItem)
            .leftJoin(owner, eq(workItem.ownerId, owner.ownerKey))
            .where(inArray(workItem.initiativeId, initiativeIds))
            .orderBy(workItem.priority, workItem.createdAt);
    }

    // 6. Assemble the tree
    const result: TimelineObjective[] = objectives.map((obj) => {
        const objKrs = krs.filter(
            (kr) => kr.objectiveId === obj.objective.objectiveKey
        );

        const objInits = initLinks
            .filter((l) => l.objectiveId === obj.objective.objectiveKey)
            .map((l) => ({
                initiative: l.initiative,
                owner: l.owner,
                relationType: l.relationType,
                workItems: workItems.filter(
                    (wi) =>
                        wi.workItem.initiativeId ===
                        l.initiative.initiativeKey
                ),
            }));

        return {
            ...obj,
            keyResults: objKrs,
            initiatives: objInits,
        };
    });

    return { cycle, objectives: result };
}
