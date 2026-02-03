"use client";

import { Card, Button } from "@heroui/react";
import { Plus, FileCheck, ExternalLink } from "lucide-react";

interface DecisionsTabProps {
    entityType: string;
    entityId: string;
    decisions: any[];
}

export function DecisionsTab({ entityType, entityId, decisions }: DecisionsTabProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Decisiones ({decisions.length})</h3>
                <Button>
                    <Plus className="h-4 w-4" />
                    Nueva Decisión
                </Button>
            </div>

            {decisions.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-default-500">No hay decisiones registradas.</p>
                    <Button className="mt-4">
                        <Plus className="h-4 w-4" />
                        Registrar primera decisión
                    </Button>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-default-200 bg-default-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Fecha</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Título</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Decisión</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Responsable</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Evidencia</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-default-100">
                                {decisions.map(({ decision, owner }) => (
                                    <tr key={decision.decisionKey} className="hover:bg-default-50">
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-default-400">
                                                {new Date(decision.decisionDate).toLocaleDateString("es-ES", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-start gap-2">
                                                <FileCheck className="h-4 w-4 text-primary mt-0.5" />
                                                <div>
                                                    <p className="font-medium">{decision.title}</p>
                                                    {decision.context && (
                                                        <p className="text-xs text-default-400 max-w-xs truncate">
                                                            {decision.context}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm max-w-xs">{decision.decision}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm">{owner?.fullName || "-"}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {decision.evidenceUrl ? (
                                                <a
                                                    href={decision.evidenceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-default-100 transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            ) : (
                                                <span className="text-default-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
