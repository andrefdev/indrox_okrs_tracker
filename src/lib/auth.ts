import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Owner } from "@/types/user";

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

    // Query core.owner table for the user's owner record
    const { data: owner, error } = await supabase
        .schema("core")
        .from("owner")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

    if (error || !owner) {
        // User is authenticated but has no owner record
        return null;
    }

    // Map DB record to Owner type
    return {
        ownerKey: owner.owner_key,
        authUserId: owner.auth_user_id,
        fullName: owner.full_name,
        email: owner.email || user.email || "",
        role: owner.role,
        areaId: owner.area_id,
        isActive: owner.is_active,
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
