"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { InitiativesTable } from "./InitiativesTable";
import { InitiativeModal } from "./InitiativeModal";
import type { Initiative, OkrCycle } from "@/db/schema/okr";
import type { Owner, Area } from "@/db/schema/core";

// Extended type as used in queries
interface InitiativeWithRelations extends Initiative {
    cycle: { cycleId: string; name: string } | null;
    owner: { ownerKey: string; fullName: string } | null;
    area: { areaKey: string; name: string } | null;
}

interface InitiativesClientProps {
    initiatives: InitiativeWithRelations[];
    cycles: OkrCycle[];
    owners: Owner[];
    areas: Area[];
}

export function InitiativesClient({ initiatives, cycles, owners, areas }: InitiativesClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);

    const handleCreate = () => {
        setSelectedInitiative(null);
        setIsModalOpen(true);
    };

    const handleEdit = (initiative: Initiative) => {
        setSelectedInitiative(initiative);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedInitiative(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    onPress={handleCreate}
                    className="bg-primary text-primary-foreground"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Iniciativa
                </Button>
            </div>

            <InitiativesTable initiatives={initiatives} onEdit={handleEdit} />

            <InitiativeModal
                isOpen={isModalOpen}
                onClose={handleClose}
                initiative={selectedInitiative}
                cycles={cycles}
                owners={owners}
                areas={areas}
            />
        </div>
    );
}
