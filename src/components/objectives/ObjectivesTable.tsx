"use client";

import { useRouter } from "next/navigation";
import { Card, Button } from "@heroui/react";
import { Eye, Edit } from "lucide-react";
import { StatusChip, PriorityChip, ConfidenceBadge } from "@/components/ui";
import type { Objective } from "@/db/schema/okr";

interface ObjectiveWithRelations {
    objective: Objective;
    owner: { ownerKey: string; fullName: string; email: string | null; role: string } | null;
    area: { areaKey: string; name: string; code: string } | null;
    cycle: { cycleId: string; name: string } | null;
}

interface ObjectivesTableProps {
    objectives: ObjectiveWithRelations[];
    onEdit: (objective: Objective) => void;
}

export function ObjectivesTable({ objectives, onEdit }: ObjectivesTableProps) {
    const router = useRouter();

    const handleView = (objectiveId: string) => {
        router.push(`/objectives/${objectiveId}`);
    };

    if (objectives.length === 0) {
        return (
            <Card className="p-8 text-center">
                <div className="text-default-500">
                    No se encontraron objetivos con los filtros seleccionados.
                </div>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b border-default-200 bg-default-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Título</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Tipo</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Estado</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Confianza</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Owner</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Área</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Prioridad</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-default-100">
                        {objectives.map(({ objective, owner, area }) => (
                            <tr key={objective.objectiveKey} className="hover:bg-default-50">
                                <td className="px-4 py-3">
                                    <div className="max-w-xs">
                                        <p className="font-medium truncate">{objective.title}</p>
                                        {objective.description && (
                                            <p className="text-xs text-default-400 truncate">
                                                {objective.description}
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-sm capitalize">
                                        {objective.objectiveType}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <StatusChip status={objective.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <ConfidenceBadge value={objective.confidence || 0} />
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-sm">{owner?.fullName || "-"}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-sm">{area?.name || "-"}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <PriorityChip priority={objective.priority} />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            isIconOnly
                                            variant="ghost"
                                            size="sm"
                                            onPress={() => handleView(objective.objectiveKey)}
                                            aria-label="Ver detalle"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            variant="ghost"
                                            size="sm"
                                            onPress={() => onEdit(objective)}
                                            aria-label="Editar"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
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
