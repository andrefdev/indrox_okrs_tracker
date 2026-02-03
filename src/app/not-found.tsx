"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        // Redirigir al dashboard después de un breve momento
        const timeout = setTimeout(() => {
            router.push("/dashboard");
        }, 1500);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-4xl font-bold text-primary">404</h1>
                <p className="text-xl font-medium">Página no encontrada</p>
                <p className="text-default-500">
                    Redirigiendo al dashboard...
                </p>
            </div>
            <Spinner size="lg" color="accent" />
        </div>
    );
}
