"use client";

import { Card } from "@heroui/react";
import { StatusChip, PriorityChip, ConfidenceBadge } from "@/components/ui";

interface OverviewTabProps {
    objective: {
        objective: any;
        owner: any;
        area: any;
        cycle: any;
    };
}

export function OverviewTab({ objective }: OverviewTabProps) {
    const { objective: obj, owner, area, cycle } = objective;

    return (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* Details Card */}
            <Card className="p-4">
                <h3 className="mb-4 text-lg font-semibold">Detalles</h3>
                <dl className="space-y-3">
                    <div className="flex justify-between">
                        <dt className="text-default-500">Título</dt>
                        <dd className="font-medium">{obj.title}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-default-500">Tipo</dt>
                        <dd className="capitalize">{obj.objectiveType}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-default-500">Estado</dt>
                        <dd>
                            <StatusChip status={obj.status} />
                        </dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-default-500">Prioridad</dt>
                        <dd>
                            <PriorityChip priority={obj.priority} />
                        </dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-default-500">Confianza</dt>
                        <dd>
                            <ConfidenceBadge value={obj.confidence || 0} />
                        </dd>
                    </div>
                </dl>
            </Card>

            {/* Assignment Card */}
            <Card className="p-4">
                <h3 className="mb-4 text-lg font-semibold">Asignación</h3>
                <dl className="space-y-3">
                    <div className="flex justify-between">
                        <dt className="text-default-500">Owner</dt>
                        <dd className="font-medium">{owner?.fullName || "Sin asignar"}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-default-500">Área</dt>
                        <dd>{area?.name || "Sin área"}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-default-500">Ciclo</dt>
                        <dd>{cycle?.name || "-"}</dd>
                    </div>
                </dl>
            </Card>

            {/* Description Card */}
            {obj.description && (
                <Card className="p-4 md:col-span-2">
                    <h3 className="mb-2 text-lg font-semibold">Descripción</h3>
                    <p className="text-default-600 whitespace-pre-wrap">
                        {obj.description}
                    </p>
                </Card>
            )}
        </div>
    );
}
