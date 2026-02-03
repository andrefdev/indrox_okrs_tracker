"use client";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    User,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import type { Area, Owner } from "@/db/schema/core";
import { deleteAreaAction } from "@/app/actions/areas";
import { toast } from "sonner";

interface AreasTableProps {
    areas: (Area & { leadOwner: Owner | null })[];
    onEdit: (area: Area) => void;
}

export function AreasTable({ areas, onEdit }: AreasTableProps) {
    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta área?")) {
            const result = await deleteAreaAction(id);
            if (result.success) {
                toast.success("Área eliminada");
            } else {
                toast.error("Error al eliminar el área");
            }
        }
    };

    return (
        <Table aria-label="Tabla de áreas">
            <TableHeader>
                <TableColumn>CÓDIGO</TableColumn>
                <TableColumn>NOMBRE</TableColumn>
                <TableColumn>LÍDER</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No hay áreas registradas."}>
                {areas.map((area) => (
                    <TableRow key={area.areaKey}>
                        <TableCell>{area.code}</TableCell>
                        <TableCell>{area.name}</TableCell>
                        <TableCell>
                            {area.leadOwner ? (
                                <User
                                    name={area.leadOwner.fullName}
                                    description={area.leadOwner.email}
                                    avatarProps={{
                                        src: undefined, // Add avatar url if available
                                        name: area.leadOwner.fullName.charAt(0),
                                    }}
                                />
                            ) : (
                                "-"
                            )}
                        </TableCell>
                        <TableCell>
                            <div className="relative flex items-center gap-2">
                                <Tooltip content="Editar área">
                                    <span
                                        className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                        onClick={() => onEdit(area)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </span>
                                </Tooltip>
                                <Tooltip color="danger" content="Eliminar área">
                                    <span
                                        className="text-lg text-danger cursor-pointer active:opacity-50"
                                        onClick={() => handleDelete(area.areaKey)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </span>
                                </Tooltip>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
