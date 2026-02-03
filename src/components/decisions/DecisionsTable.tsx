"use client";

import {
    Card,
    Chip,
    Button,
    Tooltip,
} from "@heroui/react";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import type { DecisionLog } from "@/db/schema/okr-related";

interface DecisionsTableProps {
    decisions: DecisionLog[];
    onEdit: (decision: DecisionLog) => void;
    onDelete?: (decision: DecisionLog) => void;
}

export function DecisionsTable({ decisions, onEdit, onDelete }: DecisionsTableProps) {
    if (decisions.length === 0) {
        return (
            <Card className="flex min-h-[200px] items-center justify-center border-2 border-dashed border-default-200 p-8 shadow-none">
                <div className="flex flex-col items-center gap-2 text-center text-default-500">
                    <p className="text-lg font-medium">No hay decisiones registradas</p>
                    <p className="text-sm">Documenta las decisiones importantes del proyecto.</p>
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
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Título / Decisión</th>
                            <th className="px-4 py-3">Contexto</th>
                            <th className="px-4 py-3">Responsable</th>
                            <th className="px-4 py-3">Evidencia</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-default-100">
                        {decisions.map((item) => (
                            <tr key={item.decisionKey} className="hover:bg-default-50">
                                <td className="px-4 py-3 text-default-600 whitespace-nowrap">
                                    {new Date(item.decisionDate).toLocaleDateString("es-ES", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </td>
                                <td className="px-4 py-3">
                                    <div>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-xs text-default-500 truncate max-w-[300px]">
                                            {item.decision}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {item.context ? (
                                        <span className="text-default-500 truncate max-w-[200px] block">{item.context}</span>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="px-4 py-3 text-default-600">
                                    {/* @ts-ignore owner relation populated */}
                                    {item.owner?.fullName || "-"}
                                </td>
                                <td className="px-4 py-3">
                                    {item.evidenceUrl ? (
                                        <a
                                            href={item.evidenceUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center text-primary hover:underline text-xs"
                                        >
                                            <ExternalLink className="h-3 w-3 mr-1" />
                                            Ver
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => onEdit(item)} title="Editar">
                                            <Edit className="h-4 w-4" />
                                        </span>
                                        {onDelete && (
                                            <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => onDelete(item)} title="Eliminar">
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
