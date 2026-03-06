"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Button,
    Card,
    Checkbox,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import { WorkItemWithRelations } from "@/db/queries/work-items";
import { StatusChip, PriorityChip, TypeChip } from "@/components/ui";
import { deleteWorkItem, updateWorkItemStatus } from "@/app/actions/work-items";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface WorkItemsTableProps {
    workItems: WorkItemWithRelations[];
    currentOwnerId: string | null;
    userRole: string;
    onEdit: (item: WorkItemWithRelations) => void;
}

export function WorkItemsTable({
    workItems,
    currentOwnerId,
    userRole,
    onEdit,
}: WorkItemsTableProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleToggleComplete = (item: WorkItemWithRelations) => {
        const newStatus = item.workItem.status === "completed" ? "on_track" : "completed";
        startTransition(async () => {
            try {
                await updateWorkItemStatus(item.workItem.workitemKey, newStatus);
                toast.success(newStatus === "completed" ? "Completado" : "Reabierto");
                router.refresh();
            } catch {
                toast.error("Error al actualizar estado");
            }
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este item?")) return;

        startTransition(async () => {
            try {
                await deleteWorkItem(id);
                toast.success("Item eliminado");
                router.refresh();
            } catch {
                toast.error("Error al eliminar item");
            }
        });
    };

    if (workItems.length === 0) {
        return (
            <Card className="p-8 text-center text-default-400">
                <p className="text-sm">No se encontraron work items.</p>
            </Card>
        );
    }

    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-default-200 bg-default-50 text-default-600 font-medium">
                        <tr>
                            <th className="px-3 py-2.5 w-10"></th>
                            <th className="px-3 py-2.5">Título</th>
                            <th className="px-3 py-2.5">Prioridad</th>
                            <th className="px-3 py-2.5">Tipo</th>
                            <th className="px-3 py-2.5">Asignado</th>
                            <th className="px-3 py-2.5">Entrega</th>
                            <th className="px-3 py-2.5 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-default-100">
                        {workItems.map((item) => {
                            const isCompleted = item.workItem.status === "completed";

                            return (
                                <tr
                                    key={item.workItem.workitemKey}
                                    className={`hover:bg-default-50 transition-colors ${isCompleted ? "opacity-50" : ""}`}
                                >
                                    <td className="px-3 py-2.5">
                                        <Checkbox
                                            isSelected={isCompleted}
                                            onChange={() => handleToggleComplete(item)}
                                            aria-label={isCompleted ? "Desmarcar" : "Completar"}
                                            isDisabled={isPending}
                                        />
                                    </td>
                                    <td className={`px-3 py-2.5 font-medium ${isCompleted ? "line-through text-default-400" : "text-default-900"}`}>
                                        {item.workItem.title}
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <PriorityChip priority={item.workItem.priority} />
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <TypeChip type={item.workItem.type} />
                                    </td>
                                    <td className="px-3 py-2.5">
                                        {item.owner ? (
                                            <span className="text-xs text-default-600">{item.owner.fullName}</span>
                                        ) : (
                                            <span className="text-xs text-default-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-default-600">
                                        {item.workItem.dueDate ? (
                                            <span className="text-xs">
                                                {format(new Date(item.workItem.dueDate), "d MMM", { locale: es })}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-default-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="ghost"
                                                onPress={() => onEdit(item)}
                                                aria-label="Editar"
                                            >
                                                <Edit className="h-4 w-4 text-default-600" />
                                            </Button>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="ghost"
                                                className="text-danger"
                                                onPress={() => handleDelete(item.workItem.workitemKey)}
                                                isDisabled={isPending}
                                                aria-label="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
