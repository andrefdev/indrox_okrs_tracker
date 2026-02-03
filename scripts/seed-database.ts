/**
 * Database Seed Script
 *
 * Populates the database with data from a JSON file.
 *
 * Usage:
 *   npx tsx scripts/seed-database.ts <path-to-json-file>
 *   npx tsx scripts/seed-database.ts seed-data.json --dry-run
 *   npx tsx scripts/seed-database.ts seed-data.json --clear
 *
 * Options:
 *   --dry-run    Validate data without inserting
 *   --clear      Clear existing data before inserting (CAUTION!)
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";

// Import schemas
import { area, owner } from "../src/db/schema/core";
import {
    okrCycle,
    objective,
    keyResult,
    initiative,
    objectiveInitiative,
    keyResultCheckIn,
    checkInEvidence,
} from "../src/db/schema/okr";
import {
    workItem,
    checkin,
    evidence,
    dependency,
    risk,
    budgetItem,
    decisionLog,
} from "../src/db/schema/okr-related";

// ============================================
// TYPES
// ============================================

interface SeedArea {
    refId: string;
    code: string;
    name: string;
    leadOwnerRefId?: string;
}

interface SeedOwner {
    refId: string;
    authUserId: string;
    fullName: string;
    email?: string;
    role: "CEO" | "CMO" | "CTO" | "PM" | "DEV" | "DEVOPS" | "UI_DESIGNER";
    areaRefId?: string;
    isActive?: boolean;
}

interface SeedCycle {
    refId: string;
    name: string;
    startDate: string;
    endDate: string;
    status?: "draft" | "active" | "completed" | "archived";
    notes?: string;
}

interface SeedObjective {
    refId: string;
    cycleRefId: string;
    areaRefId?: string;
    ownerRefId: string;
    title: string;
    description?: string;
    objectiveType?: "strategic" | "tactical" | "operational";
    priority?: "low" | "medium" | "high" | "critical";
    status?: "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled";
    confidence?: number;
}

interface SeedKeyResult {
    refId: string;
    objectiveRefId: string;
    title: string;
    metricName?: string;
    baselineValue?: string;
    targetValue: string;
    currentValue?: string;
    unit?: string;
    scoringMethod?: "percentage" | "binary" | "milestone";
    status?: "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled";
    confidence?: number;
}

interface SeedInitiative {
    refId: string;
    cycleRefId: string;
    ownerRefId: string;
    areaRefId?: string;
    name: string;
    problemStatement?: string;
    expectedOutcome?: string;
    startDate?: string;
    dueDate?: string;
    status?: "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled";
    priority?: "low" | "medium" | "high" | "critical";
    effort?: "low" | "medium" | "high";
    impact?: "low" | "medium" | "high";
    notes?: string;
}

interface SeedObjectiveInitiative {
    objectiveRefId: string;
    initiativeRefId: string;
    relationType?: "primary" | "secondary";
    weight?: number;
}

interface SeedWorkItem {
    refId: string;
    initiativeRefId: string;
    title: string;
    type?: "task" | "bug" | "feature" | "spike" | "other";
    ownerRefId?: string;
    status?: "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled";
    priority?: "low" | "medium" | "high" | "critical";
    startDate?: string;
    dueDate?: string;
    estimateHours?: number;
    actualHours?: number;
    linkToTool?: string;
    acceptanceCriteria?: string;
}

interface SeedKeyResultCheckIn {
    refId: string;
    krRefId: string;
    value: string;
    previousValue?: string;
    comment?: string;
}

interface SeedCheckInEvidence {
    checkInRefId: string;
    url: string;
    name?: string;
    description?: string;
}

interface SeedCheckin {
    entityType: "objective" | "key_result" | "initiative" | "work_item";
    entityRefId: string;
    ownerRefId: string;
    checkinDate: string;
    status: "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled";
    confidence?: number;
    progressNote?: string;
    nextActions?: string;
    blockers?: string;
}

interface SeedEvidence {
    entityType: "objective" | "key_result" | "initiative" | "work_item";
    entityRefId: string;
    title: string;
    url?: string;
    type?: "document" | "link" | "screenshot" | "video" | "other";
    uploadedByRefId?: string;
}

interface SeedDependency {
    fromType: "objective" | "key_result" | "initiative" | "work_item";
    fromRefId: string;
    toType: "objective" | "key_result" | "initiative" | "work_item";
    toRefId: string;
    dependencyType: "blocks" | "blocked_by" | "relates_to";
    notes?: string;
}

interface SeedRisk {
    entityType: "objective" | "key_result" | "initiative" | "work_item";
    entityRefId: string;
    title: string;
    description?: string;
    probability: number;
    impact: number;
    mitigation?: string;
    ownerRefId?: string;
    status?: "open" | "mitigating" | "mitigated" | "accepted" | "closed";
}

interface SeedBudgetItem {
    initiativeRefId: string;
    category: string;
    plannedAmount: number;
    actualAmount?: number;
    currency?: string;
    vendor?: string;
    spendDate?: string;
    notes?: string;
}

interface SeedDecisionLog {
    entityType?: "objective" | "key_result" | "initiative" | "work_item";
    entityRefId?: string;
    decisionDate: string;
    title: string;
    context?: string;
    decision: string;
    ownerRefId?: string;
    evidenceUrl?: string;
}

interface SeedData {
    areas?: SeedArea[];
    owners?: SeedOwner[];
    cycles?: SeedCycle[];
    objectives?: SeedObjective[];
    keyResults?: SeedKeyResult[];
    initiatives?: SeedInitiative[];
    objectiveInitiatives?: SeedObjectiveInitiative[];
    workItems?: SeedWorkItem[];
    keyResultCheckIns?: SeedKeyResultCheckIn[];
    checkInEvidence?: SeedCheckInEvidence[];
    checkins?: SeedCheckin[];
    evidence?: SeedEvidence[];
    dependencies?: SeedDependency[];
    risks?: SeedRisk[];
    budgetItems?: SeedBudgetItem[];
    decisionLogs?: SeedDecisionLog[];
}

// ============================================
// MAIN SCRIPT
// ============================================

const args = process.argv.slice(2);
const jsonFilePath = args.find((arg) => !arg.startsWith("--"));
const isDryRun = args.includes("--dry-run");
const shouldClear = args.includes("--clear");

if (!jsonFilePath) {
    console.error("❌ Error: Please provide a JSON file path");
    console.log("\nUsage:");
    console.log("  npx tsx scripts/seed-database.ts <path-to-json-file>");
    console.log("  npx tsx scripts/seed-database.ts seed-data.json --dry-run");
    console.log("  npx tsx scripts/seed-database.ts seed-data.json --clear");
    process.exit(1);
}

// Load environment variables
import "dotenv/config";

if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL environment variable is not set");
    process.exit(1);
}

// Create database connection
const client = postgres(process.env.DATABASE_URL, {
    prepare: false,
    ssl: process.env.NODE_ENV === "production" ? "require" : false,
});

const db = drizzle(client);

// Reference ID to real UUID mapping
const refIdMap: Record<string, string> = {};

// Get real ID from refId, with type context for polymorphic entities
function getRealId(refId: string | undefined, context?: string): string | undefined {
    if (!refId) return undefined;
    const realId = refIdMap[refId];
    if (!realId) {
        throw new Error(`Reference ID not found: ${refId}${context ? ` (${context})` : ""}`);
    }
    return realId;
}

async function seedDatabase() {
    console.log("🌱 Starting database seed...\n");

    // Read JSON file
    const absolutePath = path.resolve(process.cwd(), jsonFilePath!);
    console.log(`📄 Reading seed data from: ${absolutePath}`);

    if (!fs.existsSync(absolutePath)) {
        throw new Error(`File not found: ${absolutePath}`);
    }

    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const seedData: SeedData = JSON.parse(fileContent);

    // Validate JSON structure
    console.log("\n📋 Seed data summary:");
    console.log(`   Areas: ${seedData.areas?.length ?? 0}`);
    console.log(`   Owners: ${seedData.owners?.length ?? 0}`);
    console.log(`   Cycles: ${seedData.cycles?.length ?? 0}`);
    console.log(`   Objectives: ${seedData.objectives?.length ?? 0}`);
    console.log(`   Key Results: ${seedData.keyResults?.length ?? 0}`);
    console.log(`   Initiatives: ${seedData.initiatives?.length ?? 0}`);
    console.log(`   Objective-Initiative Links: ${seedData.objectiveInitiatives?.length ?? 0}`);
    console.log(`   Work Items: ${seedData.workItems?.length ?? 0}`);
    console.log(`   KR Check-ins: ${seedData.keyResultCheckIns?.length ?? 0}`);
    console.log(`   Check-in Evidence: ${seedData.checkInEvidence?.length ?? 0}`);
    console.log(`   General Check-ins: ${seedData.checkins?.length ?? 0}`);
    console.log(`   Evidence: ${seedData.evidence?.length ?? 0}`);
    console.log(`   Dependencies: ${seedData.dependencies?.length ?? 0}`);
    console.log(`   Risks: ${seedData.risks?.length ?? 0}`);
    console.log(`   Budget Items: ${seedData.budgetItems?.length ?? 0}`);
    console.log(`   Decision Logs: ${seedData.decisionLogs?.length ?? 0}`);

    if (isDryRun) {
        console.log("\n🔍 DRY RUN MODE - No data will be inserted");
        console.log("✅ JSON validation passed!");
        return;
    }

    // Clear existing data if requested
    if (shouldClear) {
        console.log("\n⚠️  Clearing existing data...");
        await db.delete(checkInEvidence);
        await db.delete(keyResultCheckIn);
        await db.delete(decisionLog);
        await db.delete(budgetItem);
        await db.delete(risk);
        await db.delete(dependency);
        await db.delete(evidence);
        await db.delete(checkin);
        await db.delete(workItem);
        await db.delete(objectiveInitiative);
        await db.delete(initiative);
        await db.delete(keyResult);
        await db.delete(objective);
        await db.delete(okrCycle);
        await db.delete(owner);
        await db.delete(area);
        console.log("   ✓ Data cleared");
    }

    // Insert data in order of dependencies
    console.log("\n📥 Inserting data...\n");

    // 1. Insert Areas (without leadOwnerId first)
    if (seedData.areas?.length) {
        console.log("   → Inserting areas...");
        for (const a of seedData.areas) {
            const [inserted] = await db
                .insert(area)
                .values({
                    code: a.code,
                    name: a.name,
                    // leadOwnerId will be updated after owners are inserted
                })
                .returning({ areaKey: area.areaKey });
            refIdMap[a.refId] = inserted.areaKey;
        }
        console.log(`     ✓ ${seedData.areas.length} areas inserted`);
    }

    // 2. Insert Owners
    if (seedData.owners?.length) {
        console.log("   → Inserting owners...");
        for (const o of seedData.owners) {
            const [inserted] = await db
                .insert(owner)
                .values({
                    authUserId: o.authUserId,
                    fullName: o.fullName,
                    email: o.email,
                    role: o.role,
                    areaId: getRealId(o.areaRefId, "owner.areaRefId"),
                    isActive: o.isActive ?? true,
                })
                .returning({ ownerKey: owner.ownerKey });
            refIdMap[o.refId] = inserted.ownerKey;
        }
        console.log(`     ✓ ${seedData.owners.length} owners inserted`);
    }

    // 2b. Update Areas with leadOwnerId
    if (seedData.areas?.length) {
        console.log("   → Updating area lead owners...");
        for (const a of seedData.areas) {
            if (a.leadOwnerRefId) {
                const { eq } = await import("drizzle-orm");
                await db
                    .update(area)
                    .set({ leadOwnerId: getRealId(a.leadOwnerRefId, "area.leadOwnerRefId") })
                    .where(eq(area.areaKey, refIdMap[a.refId]));
            }
        }
        console.log("     ✓ Lead owners updated");
    }

    // 3. Insert Cycles
    if (seedData.cycles?.length) {
        console.log("   → Inserting cycles...");
        for (const c of seedData.cycles) {
            const [inserted] = await db
                .insert(okrCycle)
                .values({
                    name: c.name,
                    startDate: c.startDate,
                    endDate: c.endDate,
                    status: c.status ?? "draft",
                    notes: c.notes,
                })
                .returning({ cycleId: okrCycle.cycleId });
            refIdMap[c.refId] = inserted.cycleId;
        }
        console.log(`     ✓ ${seedData.cycles.length} cycles inserted`);
    }

    // 4. Insert Objectives
    if (seedData.objectives?.length) {
        console.log("   → Inserting objectives...");
        for (const o of seedData.objectives) {
            const [inserted] = await db
                .insert(objective)
                .values({
                    cycleId: getRealId(o.cycleRefId, "objective.cycleRefId")!,
                    areaId: getRealId(o.areaRefId, "objective.areaRefId"),
                    ownerId: getRealId(o.ownerRefId, "objective.ownerRefId")!,
                    title: o.title,
                    description: o.description,
                    objectiveType: o.objectiveType ?? "tactical",
                    priority: o.priority ?? "medium",
                    status: o.status ?? "not_started",
                    confidence: o.confidence ?? 50,
                })
                .returning({ objectiveKey: objective.objectiveKey });
            refIdMap[o.refId] = inserted.objectiveKey;
        }
        console.log(`     ✓ ${seedData.objectives.length} objectives inserted`);
    }

    // 5. Insert Key Results
    if (seedData.keyResults?.length) {
        console.log("   → Inserting key results...");
        for (const kr of seedData.keyResults) {
            const [inserted] = await db
                .insert(keyResult)
                .values({
                    objectiveId: getRealId(kr.objectiveRefId, "keyResult.objectiveRefId")!,
                    title: kr.title,
                    metricName: kr.metricName,
                    baselineValue: kr.baselineValue,
                    targetValue: kr.targetValue,
                    currentValue: kr.currentValue,
                    unit: kr.unit,
                    scoringMethod: kr.scoringMethod ?? "percentage",
                    status: kr.status ?? "not_started",
                    confidence: kr.confidence ?? 50,
                })
                .returning({ krKey: keyResult.krKey });
            refIdMap[kr.refId] = inserted.krKey;
        }
        console.log(`     ✓ ${seedData.keyResults.length} key results inserted`);
    }

    // 6. Insert Initiatives
    if (seedData.initiatives?.length) {
        console.log("   → Inserting initiatives...");
        for (const i of seedData.initiatives) {
            const [inserted] = await db
                .insert(initiative)
                .values({
                    cycleId: getRealId(i.cycleRefId, "initiative.cycleRefId")!,
                    ownerId: getRealId(i.ownerRefId, "initiative.ownerRefId")!,
                    areaId: getRealId(i.areaRefId, "initiative.areaRefId"),
                    name: i.name,
                    problemStatement: i.problemStatement,
                    expectedOutcome: i.expectedOutcome,
                    startDate: i.startDate,
                    dueDate: i.dueDate,
                    status: i.status ?? "not_started",
                    priority: i.priority ?? "medium",
                    effort: i.effort ?? "medium",
                    impact: i.impact ?? "medium",
                    notes: i.notes,
                })
                .returning({ initiativeKey: initiative.initiativeKey });
            refIdMap[i.refId] = inserted.initiativeKey;
        }
        console.log(`     ✓ ${seedData.initiatives.length} initiatives inserted`);
    }

    // 7. Insert Objective-Initiative Links
    if (seedData.objectiveInitiatives?.length) {
        console.log("   → Inserting objective-initiative links...");
        for (const oi of seedData.objectiveInitiatives) {
            await db.insert(objectiveInitiative).values({
                objectiveId: getRealId(oi.objectiveRefId, "objectiveInitiative.objectiveRefId")!,
                initiativeId: getRealId(oi.initiativeRefId, "objectiveInitiative.initiativeRefId")!,
                relationType: oi.relationType ?? "primary",
                weight: oi.weight ?? 1.0,
            });
        }
        console.log(`     ✓ ${seedData.objectiveInitiatives.length} links inserted`);
    }

    // 8. Insert Work Items
    if (seedData.workItems?.length) {
        console.log("   → Inserting work items...");
        for (const wi of seedData.workItems) {
            const [inserted] = await db
                .insert(workItem)
                .values({
                    initiativeId: getRealId(wi.initiativeRefId, "workItem.initiativeRefId")!,
                    title: wi.title,
                    type: wi.type ?? "task",
                    ownerId: getRealId(wi.ownerRefId, "workItem.ownerRefId"),
                    status: wi.status ?? "not_started",
                    priority: wi.priority ?? "medium",
                    startDate: wi.startDate,
                    dueDate: wi.dueDate,
                    estimateHours: wi.estimateHours,
                    actualHours: wi.actualHours,
                    linkToTool: wi.linkToTool,
                    acceptanceCriteria: wi.acceptanceCriteria,
                })
                .returning({ workitemKey: workItem.workitemKey });
            refIdMap[wi.refId] = inserted.workitemKey;
        }
        console.log(`     ✓ ${seedData.workItems.length} work items inserted`);
    }

    // 9. Insert KR Check-ins
    if (seedData.keyResultCheckIns?.length) {
        console.log("   → Inserting KR check-ins...");
        for (const ci of seedData.keyResultCheckIns) {
            const [inserted] = await db
                .insert(keyResultCheckIn)
                .values({
                    krId: getRealId(ci.krRefId, "keyResultCheckIn.krRefId")!,
                    value: ci.value,
                    previousValue: ci.previousValue,
                    comment: ci.comment,
                })
                .returning({ id: keyResultCheckIn.id });
            refIdMap[ci.refId] = inserted.id;
        }
        console.log(`     ✓ ${seedData.keyResultCheckIns.length} KR check-ins inserted`);
    }

    // 10. Insert Check-in Evidence
    if (seedData.checkInEvidence?.length) {
        console.log("   → Inserting check-in evidence...");
        for (const e of seedData.checkInEvidence) {
            await db.insert(checkInEvidence).values({
                checkInId: getRealId(e.checkInRefId, "checkInEvidence.checkInRefId")!,
                url: e.url,
                name: e.name,
                description: e.description,
            });
        }
        console.log(`     ✓ ${seedData.checkInEvidence.length} check-in evidence inserted`);
    }

    // 11. Insert General Check-ins
    if (seedData.checkins?.length) {
        console.log("   → Inserting general check-ins...");
        for (const c of seedData.checkins) {
            await db.insert(checkin).values({
                entityType: c.entityType,
                entityId: getRealId(c.entityRefId, "checkin.entityRefId")!,
                ownerId: getRealId(c.ownerRefId, "checkin.ownerRefId")!,
                checkinDate: c.checkinDate,
                status: c.status,
                confidence: c.confidence,
                progressNote: c.progressNote,
                nextActions: c.nextActions,
                blockers: c.blockers,
            });
        }
        console.log(`     ✓ ${seedData.checkins.length} general check-ins inserted`);
    }

    // 12. Insert Evidence
    if (seedData.evidence?.length) {
        console.log("   → Inserting evidence...");
        for (const e of seedData.evidence) {
            await db.insert(evidence).values({
                entityType: e.entityType,
                entityId: getRealId(e.entityRefId, "evidence.entityRefId")!,
                title: e.title,
                url: e.url,
                type: e.type ?? "link",
                uploadedBy: getRealId(e.uploadedByRefId, "evidence.uploadedByRefId"),
            });
        }
        console.log(`     ✓ ${seedData.evidence.length} evidence inserted`);
    }

    // 13. Insert Dependencies
    if (seedData.dependencies?.length) {
        console.log("   → Inserting dependencies...");
        for (const d of seedData.dependencies) {
            await db.insert(dependency).values({
                fromType: d.fromType,
                fromId: getRealId(d.fromRefId, "dependency.fromRefId")!,
                toType: d.toType,
                toId: getRealId(d.toRefId, "dependency.toRefId")!,
                dependencyType: d.dependencyType,
                notes: d.notes,
            });
        }
        console.log(`     ✓ ${seedData.dependencies.length} dependencies inserted`);
    }

    // 14. Insert Risks
    if (seedData.risks?.length) {
        console.log("   → Inserting risks...");
        for (const r of seedData.risks) {
            await db.insert(risk).values({
                entityType: r.entityType,
                entityId: getRealId(r.entityRefId, "risk.entityRefId")!,
                title: r.title,
                description: r.description,
                probability: r.probability,
                impact: r.impact,
                mitigation: r.mitigation,
                ownerId: getRealId(r.ownerRefId, "risk.ownerRefId"),
                status: r.status ?? "open",
            });
        }
        console.log(`     ✓ ${seedData.risks.length} risks inserted`);
    }

    // 15. Insert Budget Items
    if (seedData.budgetItems?.length) {
        console.log("   → Inserting budget items...");
        for (const b of seedData.budgetItems) {
            await db.insert(budgetItem).values({
                initiativeId: getRealId(b.initiativeRefId, "budgetItem.initiativeRefId")!,
                category: b.category,
                plannedAmount: b.plannedAmount,
                actualAmount: b.actualAmount,
                currency: b.currency ?? "USD",
                vendor: b.vendor,
                spendDate: b.spendDate,
                notes: b.notes,
            });
        }
        console.log(`     ✓ ${seedData.budgetItems.length} budget items inserted`);
    }

    // 16. Insert Decision Logs
    if (seedData.decisionLogs?.length) {
        console.log("   → Inserting decision logs...");
        for (const d of seedData.decisionLogs) {
            await db.insert(decisionLog).values({
                entityType: d.entityType,
                entityId: d.entityRefId ? getRealId(d.entityRefId, "decisionLog.entityRefId") : undefined,
                decisionDate: d.decisionDate,
                title: d.title,
                context: d.context,
                decision: d.decision,
                ownerId: getRealId(d.ownerRefId, "decisionLog.ownerRefId"),
                evidenceUrl: d.evidenceUrl,
            });
        }
        console.log(`     ✓ ${seedData.decisionLogs.length} decision logs inserted`);
    }

    console.log("\n✅ Database seeding completed successfully!");
}

// Run the script
seedDatabase()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Error during seeding:", error.message);
        process.exit(1);
    });
