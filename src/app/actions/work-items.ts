"use server";

import { db } from "@/db";
import { workItem } from "@/db/schema/okr-related";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createWorkItem(data: {
    initiativeId: string;
    title: string;
    type: "task" | "bug" | "feature" | "spike" | "other";
    ownerId?: string;
    status?: "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled";
    priority?: "low" | "medium" | "high" | "critical";
    startDate?: string | null;
    dueDate?: string | null;
    estimateHours?: number | null;
    actualHours?: number | null;
    linkToTool?: string | null;
    acceptanceCriteria?: string | null;
}) {
    try {
        await db.insert(workItem).values({
            initiativeId: data.initiativeId,
            title: data.title,
            type: data.type,
            ownerId: data.ownerId,
            status: data.status || "not_started",
            priority: data.priority || "medium",
            startDate: data.startDate || null,
            dueDate: data.dueDate || null,
            estimateHours: data.estimateHours || null,
            actualHours: data.actualHours || null,
            linkToTool: data.linkToTool || null,
            acceptanceCriteria: data.acceptanceCriteria || null,
        });
        revalidatePath("/work-items");
        revalidatePath(`/initiatives/${data.initiativeId}`);
        return { success: true };
    } catch (error) {
        console.error("Error creating work item:", error);
        throw new Error("Failed to create work item");
    }
}

export async function updateWorkItem(
    workitemKey: string,
    data: {
        title?: string;
        type?: "task" | "bug" | "feature" | "spike" | "other";
        ownerId?: string | null;
        status?: "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled";
        priority?: "low" | "medium" | "high" | "critical";
        startDate?: string | null;
        dueDate?: string | null;
        estimateHours?: number | null;
        actualHours?: number | null;
        linkToTool?: string | null;
        acceptanceCriteria?: string | null;
    }
) {
    try {
        const updateData: any = { ...data, updatedAt: new Date() };

        // If status is completed, set completedAt
        if (data.status === "completed") {
            updateData.completedAt = new Date();
        } else if (data.status) {
            updateData.completedAt = null;
        }

        await db
            .update(workItem)
            .set(updateData)
            .where(eq(workItem.workitemKey, workitemKey));

        revalidatePath("/work-items");
        revalidatePath(`/work-items/${workitemKey}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating work item:", error);
        throw new Error("Failed to update work item");
    }
}

export async function deleteWorkItem(workitemKey: string) {
    try {
        await db.delete(workItem).where(eq(workItem.workitemKey, workitemKey));
        revalidatePath("/work-items");
        return { success: true };
    } catch (error) {
        console.error("Error deleting work item:", error);
        throw new Error("Failed to delete work item");
    }
}

export async function updateWorkItemStatus(
    workitemKey: string,
    status: "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled"
) {
    try {
        const updateData: any = { status, updatedAt: new Date() };

        if (status === "completed") {
            updateData.completedAt = new Date();
        } else {
            updateData.completedAt = null;
        }

        await db
            .update(workItem)
            .set(updateData)
            .where(eq(workItem.workitemKey, workitemKey));

        revalidatePath("/work-items");
        revalidatePath(`/work-items/${workitemKey}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating work item status:", error);
        throw new Error("Failed to update status");
    }
}

export async function updateWorkItemHours(
    workitemKey: string,
    actualHours: number
) {
    try {
        await db
            .update(workItem)
            .set({ actualHours, updatedAt: new Date() })
            .where(eq(workItem.workitemKey, workitemKey));

        revalidatePath("/work-items");
        revalidatePath(`/work-items/${workitemKey}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating work item hours:", error);
        throw new Error("Failed to update hours");
    }
}
