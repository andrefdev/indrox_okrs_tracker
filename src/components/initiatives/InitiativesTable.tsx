"use client";

import { useTransition } from "react";
import { Card, Button } from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import { StatusChip, PriorityChip } from "@/components/ui";
import { deleteInitiative } from "@/app/actions/initiatives";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Initiative } from "@/db/schema/okr";
import type { Owner, Area } from "@/db/schema/core";
import { useRouter } from "next/navigation";

// Extended type to include relations
interface InitiativeWithRelations extends Initiative {
    cycle: { cycleId: string; name: string } | null;
    owner: { ownerKey: string; fullName: string } | null;
    area: { areaKey: string; name: string } | null;
}

interface InitiativesTableProps {
    initiatives: InitiativeWithRelations[];
    onEdit: (initiative: Initiative) => void;
}

export function InitiativesTable({ initiatives, onEdit }: InitiativesTableProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = (id: string, name: string) => {
        if (confirm(`¿Estás seguro de que quieres eliminar la iniciativa "${name}"?`)) {
            startTransition(async () => {
                try {
                    await deleteInitiative(id);
                    toast.success("Iniciativa eliminada correctamente");
                } catch (error) {
                    toast.error("Error al eliminar la iniciativa");
                    console.error(error);
                }
            });
        }
    };

    const handleView = (id: string) => {
        router.push(`/initiatives/${id}`);
    }

    if (initiatives.length === 0) {
        return (
            <Card className="p-8 text-center">
                <div className="text-default-500">
                    No se encontraron iniciativas. Crea una nueva para comenzar.
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
                            <th className="px-4 py-3 text-left font-medium text-default-600">Prioridad</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Owner</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Ciclo</th>
                            <th className="px-4 py-3 text-left font-medium text-default-600">Fechas</th>
                            <th className="px-4 py-3 text-right font-medium text-default-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-default-100">
                        {initiatives.map((item) => (
                            <tr key={item.initiativeKey} className="hover:bg-default-50">
                                <td className="px-4 py-3 font-medium">
                                    <div
                                        className="cursor-pointer hover:text-primary transition-colors"
                                        onClick={() => handleView(item.initiativeKey)}
                                    >
                                        {item.name}
                                    </div>
                                    {item.area && (
                                        <div className="text-xs text-default-400">
                                            {item.area.name}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <StatusChip status={item.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <PriorityChip priority={item.priority} />
                                </td>
                                <td className="px-4 py-3 text-default-600">
                                    {item.owner?.fullName || "-"}
                                </td>
                                <td className="px-4 py-3 text-default-600">
                                    {item.cycle?.name || "-"}
                                </td>
                                <td className="px-4 py-3 text-default-600 text-xs">
                                    <div>
                                        {item.startDate ? format(new Date(item.startDate), "d MMM", { locale: es }) : "-"}
                                        <span className="mx-1">→</span>
                                        {item.dueDate ? format(new Date(item.dueDate), "d MMM", { locale: es }) : "-"}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            isIconOnly
                                            variant="ghost"
                                            size="sm"
                                            onPress={() => onEdit(item)}
                                            aria-label="Editar"
                                            isDisabled={isPending}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            isIconOnly
                                            variant="ghost"
                                            size="sm"
                                            onPress={() => handleDelete(item.initiativeKey, item.name)}
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
