"use client";

import { Card } from "@heroui/react";
import Link from "next/link";
import { StatusChip, PriorityChip } from "@/components/ui";
import { AlertTriangle, Clock } from "lucide-react";

interface DashboardTablesProps {
    blocked: {
        objectives: any[];
        initiatives: any[];
    };
    noEvidence: any[];
    priorities: {
        objectives: any[];
        initiatives: any[];
    };
}

export function DashboardTables({ blocked, noEvidence, priorities }: DashboardTablesProps) {
    const blockedItems = [
        ...blocked.objectives.map((o) => ({
            key: o.objectiveKey,
            title: o.title,
            type: "Objetivo" as const,
            link: `/objectives/${o.objectiveKey}`,
            owner: o.owner?.fullName,
            status: o.status,
            priority: o.priority,
        })),
        ...blocked.initiatives.map((i) => ({
            key: i.initiativeKey,
            title: i.name,
            type: "Iniciativa" as const,
            link: `/initiatives`,
            owner: i.owner?.fullName,
            status: i.status,
            priority: i.priority,
        })),
    ];

    const highPriorityItems = [
        ...priorities.objectives.map((o) => ({
            key: o.objectiveKey,
            title: o.title,
            type: "Objetivo" as const,
            link: `/objectives/${o.objectiveKey}`,
            priority: o.priority,
        })),
        ...priorities.initiatives.map((i) => ({
            key: i.initiativeKey,
            title: i.name,
            type: "Iniciativa" as const,
            link: `/initiatives`,
            priority: i.priority,
        })),
    ];

    const hasAlerts = blockedItems.length > 0 || highPriorityItems.length > 0 || noEvidence.length > 0;

    if (!hasAlerts) {
        return (
            <Card className="p-6 text-center text-default-400">
                <p className="text-sm">No hay alertas activas. Todo va bien.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Blocked / At Risk */}
            {blockedItems.length > 0 && (
                <Card className="p-4">
                    <h3 className="text-sm font-semibold text-danger flex items-center gap-1.5 mb-3">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        En Riesgo / Bloqueados ({blockedItems.length})
                    </h3>
                    <div className="space-y-2">
                        {blockedItems.map((item) => (
                            <div key={item.key} className="flex items-center justify-between gap-3 py-1.5 px-2 rounded-lg hover:bg-default-50">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-[10px] uppercase font-medium text-default-400 w-16 shrink-0">
                                        {item.type}
                                    </span>
                                    <Link href={item.link} className="text-sm font-medium truncate hover:underline">
                                        {item.title}
                                    </Link>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {item.owner && <span className="text-xs text-default-400">{item.owner}</span>}
                                    <StatusChip status={item.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* High Priority + No Evidence in a row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {highPriorityItems.length > 0 && (
                    <Card className="p-4">
                        <h3 className="text-sm font-semibold flex items-center gap-1.5 mb-3">
                            Prioridad Alta ({highPriorityItems.length})
                        </h3>
                        <div className="space-y-2">
                            {highPriorityItems.map((item) => (
                                <div key={item.key} className="flex items-center justify-between gap-3 py-1.5 px-2 rounded-lg hover:bg-default-50">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-[10px] uppercase font-medium text-default-400 w-16 shrink-0">
                                            {item.type}
                                        </span>
                                        <Link href={item.link} className="text-sm truncate hover:underline">
                                            {item.title}
                                        </Link>
                                    </div>
                                    <PriorityChip priority={item.priority} />
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {noEvidence.length > 0 && (
                    <Card className="p-4">
                        <h3 className="text-sm font-semibold text-warning flex items-center gap-1.5 mb-3">
                            <Clock className="h-3.5 w-3.5" />
                            Sin evidencia reciente ({noEvidence.length})
                        </h3>
                        <div className="space-y-2">
                            {noEvidence.map((item: any) => (
                                <div key={item.initiativeKey} className="flex items-center justify-between gap-3 py-1.5 px-2 rounded-lg hover:bg-default-50">
                                    <span className="text-sm truncate">{item.name}</span>
                                    {item.owner && (
                                        <span className="text-xs text-default-400 shrink-0">{item.owner.fullName}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
