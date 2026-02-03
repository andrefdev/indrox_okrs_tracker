"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { DecisionsTable } from "./DecisionsTable";
import { DecisionModal } from "./DecisionModal";
import { deleteDecision } from "@/app/actions/decisions";
import { toast } from "sonner";
import type { DecisionLog } from "@/db/schema/okr-related";
import type { Owner } from "@/db/schema/core";

interface DecisionsClientProps {
    decisions: DecisionLog[];
    owners: Owner[];
}

export function DecisionsClient({ decisions, owners }: DecisionsClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDecision, setSelectedDecision] = useState<DecisionLog | null>(null);

    const handleCreate = () => {
        setSelectedDecision(null);
        setIsModalOpen(true);
    };

    const handleEdit = (decision: DecisionLog) => {
        setSelectedDecision(decision);
        setIsModalOpen(true);
    };

    const handleDelete = async (decision: DecisionLog) => {
        if (confirm("¿Estás seguro de que quieres eliminar esta decisión?")) {
            const result = await deleteDecision(decision.decisionKey);
            if (result.success) {
                toast.success("Decisión eliminada");
            } else {
                toast.error("Error al eliminar");
            }
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedDecision(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    className="bg-primary text-primary-foreground"
                    onPress={handleCreate}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Decisión
                </Button>
            </div>

            <DecisionsTable
                decisions={decisions}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <DecisionModal
                isOpen={isModalOpen}
                onClose={handleClose}
                decision={selectedDecision}
                owners={owners}
            />
        </div>
    );
}
