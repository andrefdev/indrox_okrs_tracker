"use client";

import {
    Card,
    Chip,
    Button,
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

const entityTypeLabel: Record<string, string> = {
    objective: "Objetivo",
    initiative: "Iniciativa",
    key_result: "Key Result",
};

export function DependenciesTable({ dependencies, onEdit, onDelete }: DependenciesTableProps) {
    if (dependencies.length === 0) {
        return (
            <Card className="p-8 text-center text-default-400 shadow-none border border-dashed border-default-200">
                <p className="text-sm font-medium">No hay dependencias registradas</p>
                <p className="text-xs mt-1">Registra las dependencias entre OKRs e Iniciativas.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-2">
            {dependencies.map((dep) => (
                <Card key={dep.dependencyKey} className="p-3">
                    <div className="flex items-center gap-3">
                        <Chip
                            size="sm"
                            variant="soft"
                            color={typeColorMap[dep.dependencyType] || "default"}
                        >
                            {typeLabelMap[dep.dependencyType] || dep.dependencyType}
                        </Chip>

                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-sm">
                                <span className="text-xs text-default-400">{entityTypeLabel[dep.fromType] || dep.fromType}</span>
                            </span>
                            <ArrowRight className="h-3 w-3 text-default-400 shrink-0" />
                            <span className="text-sm">
                                <span className="text-xs text-default-400">{entityTypeLabel[dep.toType] || dep.toType}</span>
                            </span>
                        </div>

                        {dep.notes && (
                            <span className="text-xs text-default-500 truncate max-w-[200px] hidden md:block">
                                {dep.notes}
                            </span>
                        )}

                        <div className="flex items-center gap-1 shrink-0">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="ghost"
                                onPress={() => onEdit(dep)}
                                aria-label="Editar"
                            >
                                <Edit className="h-3.5 w-3.5 text-default-400" />
                            </Button>
                            {onDelete && (
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="ghost"
                                    onPress={() => onDelete(dep)}
                                    aria-label="Eliminar"
                                >
                                    <Trash2 className="h-3.5 w-3.5 text-danger" />
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
