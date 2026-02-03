import { AppShell } from "@/components/layout";
import { NotEnabledState } from "@/components/auth";
import { requireOwner, getUser } from "@/lib/auth";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
}
