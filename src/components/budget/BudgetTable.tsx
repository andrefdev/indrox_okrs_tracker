"use client";

import {
    Card,
    Button,
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

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(amount);
};

export function BudgetTable({ budgetItems, onEdit, onDelete }: BudgetTableProps) {
    if (budgetItems.length === 0) {
        return (
            <Card className="p-8 text-center text-default-400 shadow-none border border-dashed border-default-200">
                <p className="text-sm font-medium">No hay partidas presupuestarias</p>
                <p className="text-xs mt-1">Registra los gastos y presupuestos de tus iniciativas.</p>
            </Card>
        );
    }

    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="border-b border-default-200 bg-default-50 text-default-600 font-medium">
                        <tr>
                            <th className="px-3 py-2.5">Concepto</th>
                            <th className="px-3 py-2.5">Iniciativa</th>
                            <th className="px-3 py-2.5 text-right">Planificado</th>
                            <th className="px-3 py-2.5 text-right">Real</th>
                            <th className="px-3 py-2.5 text-right">Var.</th>
                            <th className="px-3 py-2.5 text-right w-20"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-default-100">
                        {budgetItems.map((item) => {
                            const variance = (item.actualAmount || 0) - item.plannedAmount;
                            const isOverBudget = variance > 0;

                            return (
                                <tr key={item.budgetKey} className="hover:bg-default-50">
                                    <td className="px-3 py-2.5">
                                        <p className="font-medium capitalize text-sm">{item.category}</p>
                                        {item.vendor && (
                                            <p className="text-xs text-default-400">{item.vendor}</p>
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-default-600">
                                        <span className="text-xs truncate max-w-[150px] block">
                                            {item.initiative?.name || "-"}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-medium text-sm">
                                        {formatCurrency(item.plannedAmount, item.currency)}
                                    </td>
                                    <td className="px-3 py-2.5 text-right text-sm">
                                        {item.actualAmount ? formatCurrency(item.actualAmount, item.currency) : "-"}
                                    </td>
                                    <td className="px-3 py-2.5 text-right text-sm">
                                        {item.actualAmount ? (
                                            <span className={isOverBudget ? "text-danger" : "text-success"}>
                                                {isOverBudget ? "+" : ""}{formatCurrency(variance, item.currency)}
                                            </span>
                                        ) : "-"}
                                    </td>
                                    <td className="px-3 py-2.5 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="ghost"
                                                onPress={() => onEdit(item)}
                                                aria-label="Editar"
                                            >
                                                <Edit className="h-3.5 w-3.5 text-default-400" />
                                            </Button>
                                            {onDelete && (
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="ghost"
                                                    onPress={() => onDelete(item)}
                                                    aria-label="Eliminar"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 text-danger" />
                                                </Button>
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
