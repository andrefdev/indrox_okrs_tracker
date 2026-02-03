"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Chip,
    Button,
    Card,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import { WorkItemWithRelations } from "@/db/queries/work-items";
import { StatusChip, PriorityChip, TypeChip } from "@/components/ui";
import { deleteWorkItem } from "@/app/actions/work-items";
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

    const handleDelete = (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este item?")) return;

        startTransition(async () => {
            try {
                await deleteWorkItem(id);
                toast.success("Item eliminado");
                router.refresh();
            } catch (error) {
                toast.error("Error al eliminar item");
                console.error(error);
            }
        });
    };

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-default-200 bg-default-50 text-default-600 font-medium">
                        <tr>
                            <th className="px-4 py-3">Título</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Prioridad</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Asignado</th>
                            <th className="px-4 py-3">Entrega</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-default-100">
                        {workItems.map((item) => (
                            <tr
                                key={item.workItem.workitemKey}
                                className="hover:bg-default-50 transition-colors"
                            >
                                <td className="px-4 py-4 font-medium text-default-900">
                                    {item.workItem.title}
                                </td>
                                <td className="px-4 py-4">
                                    <StatusChip status={item.workItem.status} />
                                </td>
                                <td className="px-4 py-4">
                                    <PriorityChip priority={item.workItem.priority} />
                                </td>
                                <td className="px-4 py-4">
                                    <TypeChip type={item.workItem.type} />
                                </td>
                                <td className="px-4 py-4">
                                    {item.owner ? (
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-default-200 text-xs font-medium text-default-600">
                                                {item.owner.fullName
                                                    .split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("")
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </div>
                                            <span className="text-xs text-default-600">
                                                {item.owner.fullName}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-default-400">Sin asignar</span>
                                    )}
                                </td>
                                <td className="px-4 py-4 text-default-600">
                                    {item.workItem.dueDate ? (
                                        <span>
                                            {format(new Date(item.workItem.dueDate), "d MMM", {
                                                locale: es,
                                            })}
                                        </span>
                                    ) : (
                                        <span className="text-default-400">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        {(userRole === "DEV" ||
                                            userRole === "DEVOPS" ||
                                            userRole === "UI_DESIGNER") &&
                                            item.workItem.ownerId !== currentOwnerId ? (
                                            <div className="opacity-50 cursor-not-allowed">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="ghost"
                                                    isDisabled
                                                    aria-label="Solo puedes editar tus propios items"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="ghost"
                                                onPress={() => onEdit(item)}
                                                aria-label="Editar"
                                            >
                                                <Edit className="h-4 w-4 text-default-600" />
                                            </Button>
                                        )}

                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="ghost"
                                            className="text-danger"
                                            isDisabled
                                            aria-label="Eliminar (No implementado)"
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
