"use client";

import {
    Card,
    Chip,
    Button,
    Tooltip,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import type { Risk } from "@/db/schema/okr-related";

interface RisksTableProps {
    risks: Risk[];
    onEdit: (risk: Risk) => void;
    onDelete?: (risk: Risk) => void;
}

const statusColorMap: Record<string, "success" | "warning" | "danger" | "default" | "accent"> = {
    open: "warning",
    mitigating: "accent",
    mitigated: "success",
    accepted: "default",
    closed: "default",
};

const statusLabelMap: Record<string, string> = {
    open: "Abierto",
    mitigating: "Mitigando",
    mitigated: "Mitigado",
    accepted: "Aceptado",
    closed: "Cerrado",
};

export function RisksTable({ risks, onEdit, onDelete }: RisksTableProps) {
    if (risks.length === 0) {
        return (
            <Card className="flex min-h-[200px] items-center justify-center border-2 border-dashed border-default-200 p-8 shadow-none">
                <div className="flex flex-col items-center gap-2 text-center text-default-500">
                    <p className="text-lg font-medium">No hay riesgos registrados</p>
                    <p className="text-sm">Registra los riesgos potenciales para monitorearlos.</p>
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
                            <th className="px-4 py-3">Riesgo</th>
                            <th className="px-4 py-3">Prob.</th>
                            <th className="px-4 py-3">Impacto</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Dueño</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-default-100">
                        {risks.map((risk) => (
                            <tr key={risk.riskKey} className="hover:bg-default-50">
                                <td className="px-4 py-3">
                                    <div>
                                        <p className="font-medium">{risk.title}</p>
                                        {risk.description && (
                                            <p className="text-xs text-default-500 truncate max-w-[250px]">{risk.description}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <div className={`h-2 w-8 rounded-full ${getRiskLevelColor(risk.probability)}`}></div>
                                        <span className="text-xs">{risk.probability}/5</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <div className={`h-2 w-8 rounded-full ${getRiskLevelColor(risk.impact)}`}></div>
                                        <span className="text-xs">{risk.impact}/5</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <Chip
                                        size="sm"
                                        variant="soft"
                                        color={statusColorMap[risk.status] || "default"}
                                        className="capitalize"
                                    >
                                        {statusLabelMap[risk.status] || risk.status}
                                    </Chip>
                                </td>
                                <td className="px-4 py-3 text-default-600">
                                    {/* @ts-ignore owner relation populated */}
                                    {risk.owner?.fullName || "-"}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => onEdit(risk)} title="Editar riesgo">
                                            <Edit className="h-4 w-4" />
                                        </span>
                                        {onDelete && (
                                            <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => onDelete(risk)} title="Eliminar riesgo">
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

function getRiskLevelColor(level: number) {
    if (level >= 4) return "bg-danger";
    if (level === 3) return "bg-warning";
    return "bg-success";
}
