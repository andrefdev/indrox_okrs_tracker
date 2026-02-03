import { AppShell } from "@/components/layout";
import { NotEnabledState } from "@/components/auth";
import { requireOwner, getUser } from "@/lib/auth";

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
        console.error("Error loading AppLayout:", error);
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center p-4">
                <div className="max-w-md text-center space-y-4">
                    <h1 className="text-2xl font-bold text-danger">Error de Aplicación</h1>
                    <p className="text-default-500">
                        Hubo un problema al cargar tu información. Por favor, intenta recargar la página o contacta a soporte si el problema persiste.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                    >
                        Recargar página
                    </button>
                    {process.env.NODE_ENV === "development" && (
                        <pre className="mt-4 p-4 bg-default-100 rounded text-left text-xs overflow-auto max-h-40">
                            {error instanceof Error ? error.message : String(error)}
                        </pre>
                    )}
                </div>
            </div>
        );
    }
}
