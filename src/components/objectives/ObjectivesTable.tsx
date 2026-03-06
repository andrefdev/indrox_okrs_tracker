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
            <Card className="p-8 text-center text-default-400">
                <p className="text-sm">No se encontraron objetivos con los filtros seleccionados.</p>
            </Card>
        );
    }

    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b border-default-200 bg-default-50">
                        <tr>
                            <th className="px-3 py-2.5 text-left font-medium text-default-600">Título</th>
                            <th className="px-3 py-2.5 text-left font-medium text-default-600">Estado</th>
                            <th className="px-3 py-2.5 text-left font-medium text-default-600">Confianza</th>
                            <th className="px-3 py-2.5 text-left font-medium text-default-600">Prioridad</th>
                            <th className="px-3 py-2.5 text-left font-medium text-default-600">Owner</th>
                            <th className="px-3 py-2.5 text-right font-medium text-default-600 w-20"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-default-100">
                        {objectives.map(({ objective, owner, area }) => (
                            <tr
                                key={objective.objectiveKey}
                                className="hover:bg-default-50 cursor-pointer"
                                onClick={() => handleView(objective.objectiveKey)}
                            >
                                <td className="px-3 py-2.5">
                                    <p className="font-medium truncate max-w-xs">{objective.title}</p>
                                    {area && (
                                        <p className="text-xs text-default-400">{area.name}</p>
                                    )}
                                </td>
                                <td className="px-3 py-2.5">
                                    <StatusChip status={objective.status} />
                                </td>
                                <td className="px-3 py-2.5">
                                    <ConfidenceBadge value={objective.confidence || 0} />
                                </td>
                                <td className="px-3 py-2.5">
                                    <PriorityChip priority={objective.priority} />
                                </td>
                                <td className="px-3 py-2.5">
                                    <span className="text-xs text-default-600">{owner?.fullName || "-"}</span>
                                </td>
                                <td className="px-3 py-2.5 text-right">
                                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            isIconOnly
                                            variant="ghost"
                                            size="sm"
                                            onPress={() => onEdit(objective)}
                                            aria-label="Editar"
                                        >
                                            <Edit className="h-4 w-4 text-default-400" />
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
