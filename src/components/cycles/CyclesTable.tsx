"use client";

import { useTransition } from "react";
import { Card, Button } from "@heroui/react";
import { Edit, Trash2, Play, CheckCircle } from "lucide-react";
import { CycleStatus } from "./CycleStatus";
import type { OkrCycle } from "@/db/schema/okr";
import { deleteCycle, activateCycle, completeCycle } from "@/app/actions/cycles";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CyclesTableProps {
    cycles: OkrCycle[];
    onEdit: (cycle: OkrCycle) => void;
}

export function CyclesTable({ cycles, onEdit }: CyclesTableProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (cycleId: string, name: string) => {
        if (confirm(`¿Estás seguro de que quieres eliminar el ciclo "${name}"? Esta acción no se puede deshacer.`)) {
            startTransition(async () => {
                try {
                    await deleteCycle(cycleId);
                    toast.success("Ciclo eliminado correctamente");
                } catch (error) {
                    toast.error("Error al eliminar el ciclo");
                    console.error(error);
                }
            });
        }
    };

    const handleActivate = (cycleId: string) => {
        startTransition(async () => {
            try {
                await activateCycle(cycleId);
                toast.success("Ciclo marcado como activo");
            } catch (error) {
                toast.error("Error al activar el ciclo");
                console.error(error);
            }
        });
    }

    const handleComplete = (cycleId: string) => {
        startTransition(async () => {
            try {
                await completeCycle(cycleId);
                toast.success("Ciclo marcado como completado");
            } catch (error) {
                toast.error("Error al completar el ciclo");
                console.error(error);
            }
        });
    }

    if (cycles.length === 0) {
        return (
            <Card className="p-8 text-center">
                <div className="text-default-500">
                    No se encontraron ciclos. Crea uno nuevo para comenzar.
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
                            <th className="px-4 py-3 text-left font-medium text-default-600">Nombre</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Estado</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Inicia</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Termina</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Notas</th>
                            <th className="px-4 py-3 text-right font-medium text-default-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-default-100">
                        {cycles.map((cycle) => (
                            <tr key={cycle.cycleId} className="hover:bg-default-50">
                                <td className="px-4 py-3 font-medium">{cycle.name}</td>
                                <td className="px-4 py-3">
                                    <CycleStatus status={cycle.status as any} />
                                </td>
                                <td className="px-4 py-3 text-default-600">
                                    {format(new Date(cycle.startDate), "d 'de' MMMM, yyyy", { locale: es })}
                                </td>
                                <td className="px-4 py-3 text-default-600">
                                    {format(new Date(cycle.endDate), "d 'de' MMMM, yyyy", { locale: es })}
                                </td>
                                <td className="px-4 py-3 text-default-500 max-w-xs truncate">
                                    {cycle.notes || "-"}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {(cycle.status === 'draft' || cycle.status === 'archived') && (
                                            <Button
                                                isIconOnly
                                                variant="ghost"
                                                size="sm"
                                                onPress={() => handleActivate(cycle.cycleId)}
                                                isDisabled={isPending}
                                                aria-label="Activar"
                                            >
                                                <Play className="h-4 w-4 text-success" />
                                            </Button>
                                        )}

                                        {cycle.status === 'active' && (
                                            <Button
                                                isIconOnly
                                                variant="ghost"
                                                size="sm"
                                                onPress={() => handleComplete(cycle.cycleId)}
                                                isDisabled={isPending}
                                                aria-label="Completar"
                                            >
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                            </Button>
                                        )}

                                        <Button
                                            isIconOnly
                                            variant="ghost"
                                            size="sm"
                                            onPress={() => onEdit(cycle)}
                                            aria-label="Editar"
                                            isDisabled={isPending}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            isIconOnly
                                            variant="ghost"
                                            size="sm"
                                            onPress={() => handleDelete(cycle.cycleId, cycle.name)}
                                            aria-label="Eliminar"
                                            isDisabled={isPending}
                                            className="text-danger"
                                        >
                                            <Trash2 className="h-4 w-4" />
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
