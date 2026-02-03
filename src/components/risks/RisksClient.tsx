"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { RisksTable } from "./RisksTable";
import { RiskModal } from "./RiskModal";
import { deleteRisk } from "@/app/actions/risks";
import { toast } from "sonner";
import type { Risk } from "@/db/schema/okr-related";
import type { Owner } from "@/db/schema/core";

interface RisksClientProps {
    risks: Risk[];
    owners: Owner[];
}

export function RisksClient({ risks, owners }: RisksClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

    const handleCreate = () => {
        setSelectedRisk(null);
        setIsModalOpen(true);
    };

    const handleEdit = (risk: Risk) => {
        setSelectedRisk(risk);
        setIsModalOpen(true);
    };

    const handleDelete = async (risk: Risk) => {
        if (confirm(`¿Estás seguro de que quieres eliminar el riesgo "${risk.title}"?`)) {
            const result = await deleteRisk(risk.riskKey);
            if (result.success) {
                toast.success("Riesgo eliminado");
            } else {
                toast.error("Error al eliminar el riesgo");
            }
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedRisk(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    className="bg-primary text-primary-foreground"
                    onPress={handleCreate}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Riesgo
                </Button>
            </div>

            <RisksTable
                risks={risks}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <RiskModal
                isOpen={isModalOpen}
                onClose={handleClose}
                risk={selectedRisk}
                owners={owners}
                entityType="initiative" // Default for global page creation, maybe allow selection?
                // For global page, creating a risk might require selecting an entity if we enforce it.
                // The schema implies entityType/entityId are required.
                // For now I'll default to 'global' or handle it in the modal if needed.
                // Actually RiskModal has hidden logic for entityType/Id if provided. If not provided,
                // we probably need a way to select the entity effectively or just create a "General" risk attached to a dummy ID or make fields optional in schema (they are NotNull).
                // I will update RiskModal to handle this later if strict relation is needed, or just hardcode a system ID for now for global risks.
                entityId="global-risks" // Placeholder ID
            />
        </div>
    );
}
