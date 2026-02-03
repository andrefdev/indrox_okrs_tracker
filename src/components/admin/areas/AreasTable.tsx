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
        <div className="w-full overflow-x-auto border rounded-lg">
            <table className="w-full text-sm text-left">
                <thead className="bg-default-100 uppercase text-xs font-semibold text-default-500">
                    <tr>
                        <th className="px-4 py-3">CÓDIGO</th>
                        <th className="px-4 py-3">NOMBRE</th>
                        <th className="px-4 py-3">LÍDER</th>
                        <th className="px-4 py-3">ACCIONES</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-default-200">
                    {areas.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-3 text-center text-default-500">
                                No hay áreas registradas.
                            </td>
                        </tr>
                    ) : (
                        areas.map((area) => (
                            <tr key={area.areaKey} className="hover:bg-default-50">
                                <td className="px-4 py-3">{area.code}</td>
                                <td className="px-4 py-3">{area.name}</td>
                                <td className="px-4 py-3">
                                    {area.leadOwner ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase">
                                                {area.leadOwner.fullName.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{area.leadOwner.fullName}</span>
                                                <span className="text-xs text-default-500">{area.leadOwner.email}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="relative flex items-center gap-2">
                                        <button
                                            title="Editar área"
                                            className="text-default-400 hover:text-primary transition-colors"
                                            onClick={() => onEdit(area)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            title="Eliminar área"
                                            className="text-danger hover:text-danger-600 transition-colors"
                                            onClick={() => handleDelete(area.areaKey)}
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
