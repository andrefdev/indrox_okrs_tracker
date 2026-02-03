import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Owner } from "@/types/user";
import { db } from "@/db";
import { owner as ownerTable } from "@/db/schema/core";
import { eq } from "drizzle-orm";

/**
 * Get the current Supabase Auth user
 */
export async function getUser() {
    const supabase = await createServerSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user;
}

/**
 * Get the current owner from core.owner table, mapped by auth.uid()
 * Returns null if no owner record exists for the authenticated user
 */
export async function getCurrentOwner(): Promise<Owner | null> {
    const supabase = await createServerSupabaseClient();

    // First get the authenticated user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    // Query core.owner table for the user's owner record using Drizzle
    // This bypasses Supabase RLS policies and is more direct
    const [owner] = await db
        .select()
        .from(ownerTable)
        .where(eq(ownerTable.authUserId, user.id))
        .limit(1);

    if (!owner) {
        // User is authenticated but has no owner record
        return null;
    }

    // Map DB record to Owner type
    return {
        ownerKey: owner.ownerKey,
        authUserId: owner.authUserId,
        fullName: owner.fullName,
        email: owner.email || user.email || "",
        role: owner.role,
        areaId: owner.areaId,
        isActive: owner.isActive,
    };
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
    const user = await getUser();
    if (!user) {
        redirect("/login");
    }
    return user;
}

/**
 * Require an owner record - returns null if user exists but has no owner
 * Use this to check if user needs the "Not enabled" state
 */
export async function requireOwner(): Promise<Owner | null> {
    const user = await getUser();
    if (!user) {
        redirect("/login");
    }
    return getCurrentOwner();
}

/**
 * Require guest (not authenticated) - redirects to dashboard if authenticated
 */
export async function requireGuest() {
    const user = await getUser();
    if (user) {
        redirect("/dashboard");
    }
}
