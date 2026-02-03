import { Card, Button } from "@heroui/react";
import { UserX, Mail } from "lucide-react";

interface NotEnabledStateProps {
    email?: string;
}

/**
 * Component shown when a user is authenticated but has no owner record
 * This means they haven't been enabled in the system yet
 */
export function NotEnabledState({ email }: NotEnabledStateProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-default-50 via-background to-warning-50/30 p-4 dark:from-default-100 dark:via-background dark:to-warning-100/10">
            <Card className="max-w-md p-6 text-center shadow-xl">
                <Card.Content className="py-8">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-warning/10">
                            <UserX className="h-10 w-10 text-warning" />
                        </div>
                    </div>

                    <h1 className="mb-2 text-2xl font-bold text-foreground">
                        Usuario no habilitado
                    </h1>

                    <p className="mb-6 text-default-500">
                        Tu cuenta <strong>{email}</strong> aún no está habilitada en el
                        sistema. Contacta a tu administrador (PM/CTO) para que te agregue
                        como usuario.
                    </p>

                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            fullWidth
                            onPress={() => {
                                window.location.href = "mailto:admin@empresa.com?subject=Solicitud de acceso al sistema OKRs";
                            }}
                        >
                            <Mail className="h-4 w-4" />
                            Contactar Administrador
                        </Button>

                        <form action="/api/auth/signout" method="POST">
                            <Button variant="ghost" fullWidth type="submit">
                                Cerrar sesión
                            </Button>
                        </form>
                    </div>
                </Card.Content>
            </Card>
        </div>
    );
}
