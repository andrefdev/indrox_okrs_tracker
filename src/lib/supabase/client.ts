import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for browser/client component usage
 */
export function createClientSupabaseClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
