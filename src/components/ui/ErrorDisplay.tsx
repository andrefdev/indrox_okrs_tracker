"use client";

import { Button } from "@heroui/react";

interface ErrorDisplayProps {
    error?: any;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
    const isDevelopment = process.env.NODE_ENV === "development";

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center p-4">
            <div className="max-w-md text-center space-y-4">
                <h1 className="text-2xl font-bold text-danger">Error de Aplicación</h1>
                <p className="text-default-500">
                    Hubo un problema al cargar tu información. Por favor, intenta recargar la página o contacta a soporte si el problema persiste.
                </p>
                <Button
                    className="bg-primary text-primary-foreground"
                    onPress={() => window.location.reload()}
                >
                    Recargar página
                </Button>
                {isDevelopment && error && (
                    <pre className="mt-4 p-4 bg-default-100 rounded text-left text-xs overflow-auto max-h-40">
                        {error instanceof Error ? error.message : String(error)}
                    </pre>
                )}
            </div>
        </div>
    );
}
