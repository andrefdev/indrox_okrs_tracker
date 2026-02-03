import { Target } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-default-50 via-background to-primary-50 p-4 dark:from-default-100 dark:via-background dark:to-primary-100/10">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
                    <Target className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">Indrox OKRs</span>
            </div>

            {/* Auth Content */}
            <div className="w-full max-w-md">
                {children}
            </div>

            {/* Footer */}
            <p className="mt-8 text-sm text-default-400">
                © 2026 Indrox. Todos los derechos reservados.
            </p>
        </div>
    );
}
