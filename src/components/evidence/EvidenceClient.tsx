"use client";

import {
    Card,
    Button,
} from "@heroui/react";
import { Plus, ExternalLink, FileText, Image, Video, Link2 } from "lucide-react";
import { toast } from "sonner";

interface EvidenceItem {
    id: string;
    type: string;
    title: string;
    context: string;
    uploadedBy: string | null;
    date: Date;
    url: string | null;
}

interface EvidenceClientProps {
    data: EvidenceItem[];
}

const typeIcons: Record<string, React.ReactNode> = {
    document: <FileText className="h-4 w-4" />,
    link: <Link2 className="h-4 w-4" />,
    screenshot: <Image className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    other: <ExternalLink className="h-4 w-4" />,
};

const typeLabels: Record<string, string> = {
    document: "Documento",
    link: "Enlace",
    screenshot: "Captura",
    video: "Video",
    other: "Otro",
};

export function EvidenceClient({ data }: EvidenceClientProps) {
    const handleRegister = () => {
        toast.info("Funcionalidad de registro global en desarrollo. Por favor registra evidencia desde un Objetivo o Key Result.");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    className="bg-primary text-primary-foreground"
                    onPress={handleRegister}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Evidencia
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="border-b border-default-200 bg-default-50 text-default-600 font-medium">
                            <tr>
                                <th className="px-4 py-3">Tipo</th>
                                <th className="px-4 py-3">Título</th>
                                <th className="px-4 py-3">Contexto</th>
                                <th className="px-4 py-3">Subido por</th>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-default-100">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-default-500">
                                        No hay evidencia registrada.
                                    </td>
                                </tr>
                            ) : (
                                data.map((ev) => (
                                    <TableRowItem key={ev.id} ev={ev} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

function TableRowItem({ ev }: { ev: EvidenceItem }) {
    return (
        <tr className="hover:bg-default-50">
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-default-500">
                        {typeIcons[ev.type] || typeIcons.other}
                    </span>
                    <span className="text-sm">{typeLabels[ev.type] || "Otro"}</span>
                </div>
            </td>
            <td className="px-4 py-3">
                <p className="font-medium">{ev.title}</p>
            </td>
            <td className="px-4 py-3">
                <span className="text-default-600">{ev.context}</span>
            </td>
            <td className="px-4 py-3">
                <span className="text-sm text-default-600">{ev.uploadedBy || "-"}</span>
            </td>
            <td className="px-4 py-3">
                <span className="text-sm text-default-400">
                    {new Date(ev.date).toLocaleDateString("es-ES")}
                </span>
            </td>
            <td className="px-4 py-3 text-right">
                {ev.url && (
                    <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        onPress={() => window.open(ev.url!, '_blank')}
                        className="text-default-400"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                )}
            </td>
        </tr>
    );
}
