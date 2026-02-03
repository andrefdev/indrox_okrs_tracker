"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { BudgetTable } from "./BudgetTable";
import { BudgetModal } from "./BudgetModal";
import { deleteBudgetItem } from "@/app/actions/budget";
import { toast } from "sonner";
import type { BudgetItem } from "@/db/schema/okr-related";
import type { Initiative } from "@/db/schema/okr";

interface BudgetClientProps {
    budgetItems: BudgetItem[];
    initiatives: Initiative[];
}

export function BudgetClient({ budgetItems, initiatives }: BudgetClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<BudgetItem | null>(null);

    const handleCreate = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: BudgetItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (item: BudgetItem) => {
        if (confirm("¿Estás seguro de que quieres eliminar esta partida presupuestaria?")) {
            const result = await deleteBudgetItem(item.budgetKey);
            if (result.success) {
                toast.success("Partida eliminada");
            } else {
                toast.error("Error al eliminar");
            }
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    className="bg-primary text-primary-foreground"
                    onPress={handleCreate}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Partida
                </Button>
            </div>

            <BudgetTable
                budgetItems={budgetItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <BudgetModal
                isOpen={isModalOpen}
                onClose={handleClose}
                budgetItem={selectedItem}
                initiatives={initiatives}
            />
        </div>
    );
}
