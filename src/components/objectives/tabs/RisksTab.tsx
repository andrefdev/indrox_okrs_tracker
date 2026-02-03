"use client";

import { Card, Button } from "@heroui/react";
import { Plus, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { RiskModal } from "@/components/risks/RiskModal";
import type { Owner } from "@/db/schema/core";

interface RisksTabProps {
    entityType: string;
    entityId: string;
    risks: any[];
    owners: Owner[];
}

const statusLabels: Record<string, { label: string; className: string }> = {
    open: { label: "Abierto", className: "bg-danger/20 text-danger" },
    mitigating: { label: "Mitigando", className: "bg-warning/20 text-warning" },
    mitigated: { label: "Mitigado", className: "bg-success/20 text-success" },
    accepted: { label: "Aceptado", className: "bg-primary/20 text-primary" },
    closed: { label: "Cerrado", className: "bg-default-100 text-default-600" },
};

function getRiskScore(probability: number, impact: number) {
    const score = probability * impact;
    if (score >= 15) return { label: "Crítico", className: "bg-danger/20 text-danger" };
    if (score >= 9) return { label: "Alto", className: "bg-warning/20 text-warning" };
    if (score >= 4) return { label: "Medio", className: "bg-primary/20 text-primary" };
    return { label: "Bajo", className: "bg-success/20 text-success" };
}

export function RisksTab({ entityType, entityId, risks, owners }: RisksTabProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRisk, setSelectedRisk] = useState<any>(null);

    const handleCreateRisk = () => {
        setSelectedRisk(null);
        setIsModalOpen(true);
    };

    const handleEditRisk = (risk: any) => {
        setSelectedRisk(risk);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Riesgos ({risks.length})</h3>
                <Button onPress={handleCreateRisk}>
                    <Plus className="h-4 w-4" />
                    Nuevo Riesgo
                </Button>
            </div>

            {risks.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-default-500">No hay riesgos identificados.</p>
                    <Button className="mt-4" onPress={handleCreateRisk}>
                        <Plus className="h-4 w-4" />
                        Registrar primer riesgo
                    </Button>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-default-200 bg-default-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Riesgo</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Prob.</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Impacto</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Score</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Estado</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Owner</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-default-100">
                                {risks.map(({ risk, owner }) => {
                                    const riskScore = getRiskScore(risk.probability, risk.impact);
                                    const statusConfig = statusLabels[risk.status] || statusLabels.open;

                                    return (
                                        <tr
                                            key={risk.riskKey}
                                            className="hover:bg-default-50 cursor-pointer transition-colors"
                                            onClick={() => handleEditRisk(risk)}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-start gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                                                    <div>
                                                        <p className="font-medium">{risk.title}</p>
                                                        {risk.description && (
                                                            <p className="text-xs text-default-400 max-w-xs truncate">
                                                                {risk.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-medium">{risk.probability}/5</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-medium">{risk.impact}/5</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${riskScore.className}`}
                                                >
                                                    {riskScore.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.className}`}
                                                >
                                                    {statusConfig.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm">{owner?.fullName || "-"}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <RiskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                risk={selectedRisk}
                owners={owners}
                entityType={entityType as any}
                entityId={entityId}
            />
        </div>
    );
}
