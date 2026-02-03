import { db } from "@/db";
import { initiative } from "@/db/schema/okr";
import { eq, desc } from "drizzle-orm";

export async function getInitiatives() {
    return await db
        .select()
        .from(initiative)
        .where(eq(initiative.status, "on_track"))
        .orderBy(desc(initiative.createdAt));
}
