"use client";

import {
    Card,
    Button,
} from "@heroui/react";
import { MessageSquare, Calendar, Plus } from "lucide-react";
import { StatusChip } from "@/components/ui";
import { toast } from "sonner";

export type UnifiedCheckin = {
    id: string;
    type: "objective" | "key_result";
    title: string;
    date: Date;
    owner: string;
    status?: string;
    note?: string | null;
    value?: string;
    previousValue?: string | null;
    unit?: string | null;
    comment?: string | null;
    context: string;
};

interface CheckinsClientProps {
    data: UnifiedCheckin[];
}

export function CheckinsClient({ data }: CheckinsClientProps) {
    const handleRegister = () => {
        toast.info("Funcionalidad de registro global en desarrollo. Por favor registra check-ins entrando al Objetivo o Key Result correspondiente.");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    className="bg-primary text-primary-foreground"
                    onPress={handleRegister}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Check-in
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="border-b border-default-200 bg-default-50 text-default-600 font-medium">
                            <tr>
                                <th className="px-4 py-3">Tipo</th>
                                <th className="px-4 py-3">Contexto</th>
                                <th className="px-4 py-3">Título / Detalle</th>
                                <th className="px-4 py-3">Valor / Estado</th>
                                <th className="px-4 py-3">Owner</th>
                                <th className="px-4 py-3 text-right">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-default-100">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-default-500">
                                        No hay check-ins registrados.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <TableRowItem key={item.id} item={item} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

function TableRowItem({ item }: { item: UnifiedCheckin }) {
    return (
        <tr className="hover:bg-default-50">
            <td className="px-4 py-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.type === 'objective' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                    }`}>
                    {item.type === 'objective' ? <MessageSquare className="h-4 w-4" /> : <span className="font-bold text-[10px]">KR</span>}
                </div>
            </td>
            <td className="px-4 py-3">
                <span className="text-sm font-medium text-default-700">{item.context}</span>
            </td>
            <td className="px-4 py-3">
                <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    {(item.note || item.comment) && (
                        <p className="text-xs text-default-500 truncate max-w-[300px]">
                            {item.note || item.comment}
                        </p>
                    )}
                </div>
            </td>
            <td className="px-4 py-3">
                {item.type === 'objective' ? (
                    <StatusChip status={item.status as any} />
                ) : (
                    <div className="flex items-center gap-2 text-sm">
                        {item.previousValue && (
                            <>
                                <span className="text-default-400 line-through">{item.previousValue}</span>
                                <span className="text-default-300">→</span>
                            </>
                        )}
                        <span className="font-bold text-primary">{item.value} {item.unit}</span>
                    </div>
                )}
            </td>
            <td className="px-4 py-3 text-default-600">
                {item.owner}
            </td>
            <td className="px-4 py-3 text-right text-default-400">
                {new Date(item.date).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                })}
            </td>
        </tr>
    );
}
