"use client";

import {
    Card,
    Chip,
    Button,
    Tooltip,
} from "@heroui/react";
import { Edit, Trash2, ArrowRight } from "lucide-react";
import type { Dependency } from "@/db/schema/okr-related";

interface DependenciesTableProps {
    dependencies: Dependency[];
    onEdit: (dep: Dependency) => void;
    onDelete?: (dep: Dependency) => void;
}

const typeColorMap: Record<string, "danger" | "warning" | "default"> = {
    blocks: "danger",
    blocked_by: "warning",
    relates_to: "default",
};

const typeLabelMap: Record<string, string> = {
    blocks: "Bloquea a",
    blocked_by: "Bloqueado por",
    relates_to: "Relacionado con",
};

export function DependenciesTable({ dependencies, onEdit, onDelete }: DependenciesTableProps) {
    if (dependencies.length === 0) {
        return (
            <Card className="flex min-h-[200px] items-center justify-center border-2 border-dashed border-default-200 p-8 shadow-none">
                <div className="flex flex-col items-center gap-2 text-center text-default-500">
                    <p className="text-lg font-medium">No hay dependencias registradas</p>
                    <p className="text-sm">Registra las dependencias entre OKRs e Iniciativas.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="border-b border-default-200 bg-default-50 text-default-600 font-medium">
                        <tr>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Origen (Desde)</th>
                            <th className="px-4 py-3"></th>
                            <th className="px-4 py-3">Destino (Hacia)</th>
                            <th className="px-4 py-3">Notas</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-default-100">
                        {dependencies.map((dep) => (
                            <tr key={dep.dependencyKey} className="hover:bg-default-50">
                                <td className="px-4 py-3">
                                    <Chip
                                        size="sm"
                                        variant="soft"
                                        color={typeColorMap[dep.dependencyType] || "default"}
                                        className="capitalize"
                                    >
                                        {typeLabelMap[dep.dependencyType] || dep.dependencyType}
                                    </Chip>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-default-500 uppercase">{dep.fromType}</span>
                                        {/* Ideally we would resolve the name here, but schema stores ID only currently.
                                            For now showing ID or "Entity". A real app would join relation. */}
                                        <span className="font-medium truncate max-w-[150px]" title={dep.fromId}>
                                            {dep.fromId.substring(0, 8)}...
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center text-default-400">
                                    <ArrowRight className="h-4 w-4 mx-auto" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-default-500 uppercase">{dep.toType}</span>
                                        <span className="font-medium truncate max-w-[150px]" title={dep.toId}>
                                            {dep.toId.substring(0, 8)}...
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {dep.notes ? (
                                        <span className="text-default-500 truncate max-w-[200px] block">{dep.notes}</span>
                                    ) : (
                                        <span className="text-default-300">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => onEdit(dep)} title="Editar">
                                            <Edit className="h-4 w-4" />
                                        </span>
                                        {onDelete && (
                                            <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => onDelete(dep)} title="Eliminar">
                                                <Trash2 className="h-4 w-4" />
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
