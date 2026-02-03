"use client";

import { useState } from "react";
import { Card, Input, Button, Link, Label, Spinner } from "@heroui/react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Implement actual reset logic with Supabase
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <Card className="p-6 text-center shadow-xl">
                <Card.Content className="py-8">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                            <CheckCircle2 className="h-8 w-8 text-success" />
                        </div>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold">Revisa tu correo</h2>
                    <p className="mb-6 text-default-500">
                        Te hemos enviado un enlace para restablecer tu contraseña.
                        Revisa tu bandeja de entrada.
                    </p>
                    <Link href="/login" className="inline-flex items-center gap-2 text-primary">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al login
                    </Link>
                </Card.Content>
            </Card>
        );
    }

    return (
        <Card className="p-6 shadow-xl">
            <Card.Header className="flex-col items-start gap-1 pb-4">
                <Card.Title className="text-xl">Restablecer Contraseña</Card.Title>
                <Card.Description>
                    Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
                </Card.Description>
            </Card.Header>

            <Card.Content>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-default-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@empresa.com"
                                className="pl-9"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" fullWidth isPending={isLoading}>
                        {({ isPending }) => (
                            <>
                                {isPending && <Spinner color="current" size="sm" />}
                                {isPending ? "Enviando..." : "Enviar enlace"}
                            </>
                        )}
                    </Button>
                </form>
            </Card.Content>

            <Card.Footer className="pt-4">
                <Link
                    href="/login"
                    className="flex items-center gap-2 text-sm text-default-500 hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al login
                </Link>
            </Card.Footer>
        </Card>
    );
}
