"use client";

import { Card, Button } from "@heroui/react";
import { Plus, ArrowRight, ArrowLeft, Link2 } from "lucide-react";

interface DependenciesTabProps {
    entityType: string;
    entityId: string;
    dependencies: any[];
}

const typeLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    blocks: { label: "Bloquea a", icon: <ArrowRight className="h-4 w-4" /> },
    blocked_by: { label: "Bloqueado por", icon: <ArrowLeft className="h-4 w-4" /> },
    relates_to: { label: "Relacionado con", icon: <Link2 className="h-4 w-4" /> },
};

export function DependenciesTab({
    entityType,
    entityId,
    dependencies,
}: DependenciesTabProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Dependencias ({dependencies.length})</h3>
                <Button>
                    <Plus className="h-4 w-4" />
                    Nueva Dependencia
                </Button>
            </div>

            {dependencies.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-default-500">No hay dependencias definidas.</p>
                    <Button className="mt-4">
                        <Plus className="h-4 w-4" />
                        Agregar primera dependencia
                    </Button>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-default-200 bg-default-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Tipo</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Entidad destino</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Notas</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-default-100">
                                {dependencies.map((dep) => {
                                    const typeConfig = typeLabels[dep.dependencyType] || typeLabels.relates_to;

                                    return (
                                        <tr key={dep.dependencyKey} className="hover:bg-default-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-default-500">{typeConfig.icon}</span>
                                                    <span className="text-sm">{typeConfig.label}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm capitalize">
                                                    {dep.toType}: {dep.toId.slice(0, 8)}...
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-default-500">
                                                    {dep.notes || "-"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-default-400">
                                                    {new Date(dep.createdAt).toLocaleDateString("es-ES")}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
