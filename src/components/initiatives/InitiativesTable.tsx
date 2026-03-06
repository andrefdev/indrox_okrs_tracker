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
import { useRouter } from "next/navigation";

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
        if (confirm(`¿Eliminar "${name}"?`)) {
            startTransition(async () => {
                try {
                    await deleteInitiative(id);
                    toast.success("Iniciativa eliminada");
                } catch {
                    toast.error("Error al eliminar");
                }
            });
        }
    };

    if (initiatives.length === 0) {
        return (
            <Card className="p-8 text-center text-default-400">
                <p className="text-sm">No se encontraron iniciativas.</p>
            </Card>
        );
    }

    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b border-default-200 bg-default-50">
                        <tr>
                            <th className="px-3 py-2.5 text-left font-medium text-default-600">Nombre</th>
                            <th className="px-3 py-2.5 text-left font-medium text-default-600">Estado</th>
                            <th className="px-3 py-2.5 text-left font-medium text-default-600">Prioridad</th>
                            <th className="px-3 py-2.5 text-left font-medium text-default-600">Owner</th>
                            <th className="px-3 py-2.5 text-left font-medium text-default-600">Entrega</th>
                            <th className="px-3 py-2.5 text-right font-medium text-default-600 w-20"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-default-100">
                        {initiatives.map((item) => (
                            <tr key={item.initiativeKey} className="hover:bg-default-50">
                                <td className="px-3 py-2.5">
                                    <p className="font-medium truncate max-w-xs">{item.name}</p>
                                    {item.area && (
                                        <p className="text-xs text-default-400">{item.area.name}</p>
                                    )}
                                </td>
                                <td className="px-3 py-2.5">
                                    <StatusChip status={item.status} />
                                </td>
                                <td className="px-3 py-2.5">
                                    <PriorityChip priority={item.priority} />
                                </td>
                                <td className="px-3 py-2.5">
                                    <span className="text-xs text-default-600">
                                        {item.owner?.fullName || "-"}
                                    </span>
                                </td>
                                <td className="px-3 py-2.5">
                                    <span className="text-xs text-default-600">
                                        {item.dueDate ? format(new Date(item.dueDate), "d MMM", { locale: es }) : "-"}
                                    </span>
                                </td>
                                <td className="px-3 py-2.5 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            isIconOnly
                                            variant="ghost"
                                            size="sm"
                                            onPress={() => onEdit(item)}
                                            aria-label="Editar"
                                            isDisabled={isPending}
                                        >
                                            <Edit className="h-4 w-4 text-default-400" />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            variant="ghost"
                                            size="sm"
                                            onPress={() => handleDelete(item.initiativeKey, item.name)}
                                            aria-label="Eliminar"
                                            isDisabled={isPending}
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
    );
}
