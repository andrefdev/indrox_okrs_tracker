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
        <div className="w-full overflow-x-auto border rounded-lg">
            <table className="w-full text-sm text-left">
                <thead className="bg-default-100 uppercase text-xs font-semibold text-default-500">
                    <tr>
                        <th className="px-4 py-3">NOMBRE</th>
                        <th className="px-4 py-3">ROL</th>
                        <th className="px-4 py-3">ÁREA</th>
                        <th className="px-4 py-3">ESTADO</th>
                        <th className="px-4 py-3">ACCIONES</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-default-200">
                    {owners.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-3 text-center text-default-500">
                                No hay owners registrados.
                            </td>
                        </tr>
                    ) : (
                        owners.map((owner) => (
                            <tr key={owner.ownerKey} className="hover:bg-default-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase">
                                            {owner.fullName.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{owner.fullName}</span>
                                            <span className="text-xs text-default-500">{owner.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                                        {owner.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3">{owner.area?.name || "-"}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${owner.isActive
                                                ? "bg-success/20 text-success"
                                                : "bg-danger/20 text-danger"
                                            }`}
                                    >
                                        {owner.isActive ? "Activo" : "Inactivo"}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="relative flex items-center gap-2">
                                        <button
                                            title="Editar owner"
                                            className="text-default-400 hover:text-primary transition-colors"
                                            onClick={() => onEdit(owner)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            title="Eliminar owner"
                                            className="text-danger hover:text-danger-600 transition-colors"
                                            onClick={() => handleDelete(owner.ownerKey)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
