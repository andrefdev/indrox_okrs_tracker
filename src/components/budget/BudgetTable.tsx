"use client";

import {
    Card,
    Chip,
    Button,
    Tooltip,
} from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import type { BudgetItem } from "@/db/schema/okr-related";

interface BudgetItemWithRelations extends BudgetItem {
    initiative?: { name: string } | null;
}

interface BudgetTableProps {
    budgetItems: BudgetItemWithRelations[];
    onEdit: (item: BudgetItem) => void;
    onDelete?: (item: BudgetItem) => void;
}

export function BudgetTable({ budgetItems, onEdit, onDelete }: BudgetTableProps) {
    if (budgetItems.length === 0) {
        return (
            <Card className="flex min-h-[200px] items-center justify-center border-2 border-dashed border-default-200 p-8 shadow-none">
                <div className="flex flex-col items-center gap-2 text-center text-default-500">
                    <p className="text-lg font-medium">No hay partidas presupuestarias registradas</p>
                    <p className="text-sm">Registra los gastos y presupuestos de tus iniciativas.</p>
                </div>
            </Card>
        );
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount);
    };

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="border-b border-default-200 bg-default-50 text-default-600 font-medium">
                        <tr>
                            <th className="px-4 py-3">Concepto/Categoría</th>
                            <th className="px-4 py-3">Iniciativa</th>
                            <th className="px-4 py-3 text-right">Planificado</th>
                            <th className="px-4 py-3 text-right">Real</th>
                            <th className="px-4 py-3 text-right">Diferencia</th>
                            <th className="px-4 py-3">Proveedor / Notas</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-default-100">
                        {budgetItems.map((item) => {
                            const variance = (item.actualAmount || 0) - item.plannedAmount;
                            const isOverBudget = variance > 0;

                            return (
                                <tr key={item.budgetKey} className="hover:bg-default-50">
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium capitalize">{item.category}</p>
                                            {item.vendor && (
                                                <p className="text-xs text-default-500">{item.vendor}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-default-600">
                                        <span className="truncate max-w-[200px] block" title={item.initiative?.name}>
                                            {item.initiative?.name || "Desconocida"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        {formatCurrency(item.plannedAmount, item.currency)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {item.actualAmount ? formatCurrency(item.actualAmount, item.currency) : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {item.actualAmount ? (
                                            <span className={isOverBudget ? "text-danger" : "text-success"}>
                                                {isOverBudget ? "+" : ""}{formatCurrency(variance, item.currency)}
                                            </span>
                                        ) : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-default-500">
                                        {item.notes ? (
                                            <span className="truncate max-w-[200px] block">{item.notes}</span>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => onEdit(item)} title="Editar">
                                                <Edit className="h-4 w-4" />
                                            </span>
                                            {onDelete && (
                                                <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => onDelete(item)} title="Eliminar">
                                                    <Trash2 className="h-4 w-4" />
                                                </span>
                                            )}
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
