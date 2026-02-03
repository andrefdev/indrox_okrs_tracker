"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@heroui/react";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import { StatusChip, ConfidenceBadge } from "@/components/ui";
import { KeyResultModal } from "../KeyResultModal";
import {
    deleteKeyResult,
    updateKeyResultProgress,
} from "@/app/actions/key-results";
import { toast } from "sonner";

interface KeyResultsTabProps {
    objectiveId: string;
    keyResults: any[];
}

export function KeyResultsTab({ objectiveId, keyResults }: KeyResultsTabProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKR, setEditingKR] = useState<any>(null);
    const [quickEditId, setQuickEditId] = useState<string | null>(null);
    const [quickEditValue, setQuickEditValue] = useState("");

    const handleCreate = () => {
        setEditingKR(null);
        setIsModalOpen(true);
    };

    const handleEdit = (kr: any) => {
        setEditingKR(kr);
        setIsModalOpen(true);
    };

    const handleDelete = (krKey: string) => {
        if (!confirm("¿Estás seguro de eliminar este Key Result?")) return;

        startTransition(async () => {
            try {
                await deleteKeyResult(krKey);
                toast.success("Key Result eliminado");
                router.refresh();
            } catch (error) {
                toast.error("Error al eliminar");
            }
        });
    };

    const handleQuickEdit = (kr: any) => {
        setQuickEditId(kr.krKey);
        setQuickEditValue(kr.currentValue || "");
    };

    const handleQuickSave = (krKey: string) => {
        startTransition(async () => {
            try {
                await updateKeyResultProgress(krKey, quickEditValue);
                toast.success("Valor actualizado");
                setQuickEditId(null);
                router.refresh();
            } catch (error) {
                toast.error("Error al actualizar");
            }
        });
    };

    const handleQuickCancel = () => {
        setQuickEditId(null);
        setQuickEditValue("");
    };

    // Calculate progress percentage
    const calculateProgress = (kr: any) => {
        const baseline = parseFloat(kr.baselineValue) || 0;
        const target = parseFloat(kr.targetValue) || 100;
        const current = parseFloat(kr.currentValue) || baseline;
        const range = target - baseline;
        if (range === 0) return 0;
        return Math.min(100, Math.max(0, ((current - baseline) / range) * 100));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                    Key Results ({keyResults.length})
                </h3>
                <Button onPress={handleCreate}>
                    <Plus className="h-4 w-4" />
                    Nuevo KR
                </Button>
            </div>

            {keyResults.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-default-500">
                        No hay Key Results definidos para este objetivo.
                    </p>
                    <Button className="mt-4" onPress={handleCreate}>
                        <Plus className="h-4 w-4" />
                        Crear primer KR
                    </Button>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-default-200 bg-default-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Título</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Métrica</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Progreso</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Estado</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Confianza</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-default-100">
                                {keyResults.map((kr) => (
                                    <tr key={kr.krKey} className="hover:bg-default-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{kr.title}</p>
                                            {kr.metricName && (
                                                <p className="text-xs text-default-400">{kr.metricName}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {quickEditId === kr.krKey ? (
                                                <div className="flex items-center gap-1">
                                                    <Input
                                                        value={quickEditValue}
                                                        onChange={(e) => setQuickEditValue(e.target.value)}
                                                        className="w-20 text-sm"
                                                    />
                                                    <span className="text-xs text-default-400">
                                                        / {kr.targetValue} {kr.unit}
                                                    </span>
                                                    <Button
                                                        isIconOnly
                                                        variant="ghost"
                                                        onPress={() => handleQuickSave(kr.krKey)}
                                                        isPending={isPending}
                                                        className="h-7 w-7 min-w-7"
                                                    >
                                                        <Check className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        variant="ghost"
                                                        onPress={handleQuickCancel}
                                                        className="h-7 w-7 min-w-7"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="cursor-pointer hover:text-primary"
                                                    onClick={() => handleQuickEdit(kr)}
                                                    role="button"
                                                    tabIndex={0}
                                                >
                                                    <span className="font-medium">
                                                        {kr.currentValue || kr.baselineValue || "0"}
                                                    </span>
                                                    <span className="text-default-400">
                                                        {" / "}
                                                        {kr.targetValue} {kr.unit}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-20 overflow-hidden rounded-full bg-default-200">
                                                    <div
                                                        className="h-full bg-primary transition-all"
                                                        style={{ width: `${calculateProgress(kr)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-default-500">
                                                    {Math.round(calculateProgress(kr))}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusChip status={kr.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <ConfidenceBadge value={kr.confidence || 0} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    isIconOnly
                                                    variant="ghost"
                                                    onPress={() => handleEdit(kr)}
                                                    className="h-8 w-8 min-w-8"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    isIconOnly
                                                    variant="ghost"
                                                    onPress={() => handleDelete(kr.krKey)}
                                                    className="h-8 w-8 min-w-8"
                                                >
                                                    <Trash2 className="h-4 w-4 text-danger" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <KeyResultModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingKR(null);
                }}
                objectiveId={objectiveId}
                keyResult={editingKR}
            />
        </div>
    );
}
