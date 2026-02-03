import { AppShell } from "@/components/layout";
import { NotEnabledState } from "@/components/auth";
import { requireOwner, getUser } from "@/lib/auth";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

export const dynamic = "force-dynamic";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        // Get the authenticated user
        const user = await getUser();

        // If not authenticated, middleware should have redirected
        // but we double-check here for safety
        if (!user) {
            return null;
        }

        // Get the owner record for this user
        const owner = await requireOwner();

        // If user is authenticated but has no owner record, show "Not enabled" state
        if (!owner) {
            return <NotEnabledState email={user.email} />;
        }

        // User is authenticated and has an owner record - render the app
        return <AppShell>{children}</AppShell>;
    } catch (error) {
        // Check if the error is specifically the Next.js Dynamic Usage error
        // If it is, we re-throw it so Next.js handles it (though force-dynamic should prevent it)
        if (error && typeof error === 'object' && 'digest' in error && error.digest === 'DYNAMIC_SERVER_USAGE') {
            throw error;
        }

        console.error("Error loading AppLayout:", error);
        return <ErrorDisplay error={error} />;
    }
}

