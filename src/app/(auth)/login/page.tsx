"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Input, Button, Link, Label, Spinner } from "@heroui/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const supabase = createClientSupabaseClient();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Login error:", error);
                toast.error(error.message);
                setIsLoading(false);
                return;
            }

            console.log("Login successful");
            toast.success("Bienvenido");
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Unexpected error:", error);
            toast.error("Ocurrió un error inesperado al iniciar sesión");
            setIsLoading(false);
        }
    };

    return (
        <Card className="p-6 shadow-xl w-full max-w-md">
            <Card.Header className="flex-col items-start gap-1 pb-4">
                <Card.Title className="text-xl">Iniciar Sesión</Card.Title>
                <Card.Description>
                    Ingresa tus credenciales para acceder al sistema
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@empresa.com"
                                className="pl-9 w-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-default-400" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pl-9 pr-10 w-full"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-default-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 rounded border-default-300"
                            />
                            <span>Recordarme</span>
                        </label>
                        <Link href="/reset" className="text-sm text-primary">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <Button type="submit" fullWidth isPending={isLoading}>
                        {({ isPending }) => (
                            <>
                                {isPending && <Spinner color="current" size="sm" />}
                                {isPending ? "Ingresando..." : "Ingresar"}
                            </>
                        )}
                    </Button>
                </form>
            </Card.Content>
        </Card>
    );
}
