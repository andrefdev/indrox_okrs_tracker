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
    Chip,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import type { Owner, Area } from "@/db/schema/core";
import { deleteOwnerAction } from "@/app/actions/owners";
import { toast } from "sonner";

interface OwnersTableProps {
    owners: (Owner & { area: Area | null })[];
    onEdit: (owner: Owner) => void;
}

export function OwnersTable({ owners, onEdit }: OwnersTableProps) {
    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este owner?")) {
            const result = await deleteOwnerAction(id);
            if (result.success) {
                toast.success("Owner eliminado");
            } else {
                toast.error("Error al eliminar el owner");
            }
        }
    };

    return (
        <Table aria-label="Tabla de owners">
            <TableHeader>
                <TableColumn>NOMBRE</TableColumn>
                <TableColumn>ROL</TableColumn>
                <TableColumn>ÁREA</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No hay owners registrados."}>
                {owners.map((owner) => (
                    <TableRow key={owner.ownerKey}>
                        <TableCell>
                            <User
                                name={owner.fullName}
                                description={owner.email}
                                avatarProps={{
                                    name: owner.fullName.charAt(0),
                                }}
                            />
                        </TableCell>
                        <TableCell>
                            <Chip size="sm" variant="flat" color="primary">
                                {owner.role}
                            </Chip>
                        </TableCell>
                        <TableCell>{owner.area?.name || "-"}</TableCell>
                        <TableCell>
                            <Chip
                                size="sm"
                                variant="dot"
                                color={owner.isActive ? "success" : "danger"}
                            >
                                {owner.isActive ? "Activo" : "Inactivo"}
                            </Chip>
                        </TableCell>
                        <TableCell>
                            <div className="relative flex items-center gap-2">
                                <Tooltip content="Editar owner">
                                    <span
                                        className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                        onClick={() => onEdit(owner)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </span>
                                </Tooltip>
                                <Tooltip color="danger" content="Eliminar owner">
                                    <span
                                        className="text-lg text-danger cursor-pointer active:opacity-50"
                                        onClick={() => handleDelete(owner.ownerKey)}
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
