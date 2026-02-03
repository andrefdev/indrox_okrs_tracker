"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { CyclesTable } from "./CyclesTable";
import { CycleModal } from "./CycleModal";
import type { OkrCycle } from "@/db/schema/okr";

interface CyclesClientProps {
    cycles: OkrCycle[];
}

export function CyclesClient({ cycles }: CyclesClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<OkrCycle | null>(null);

    const handleCreate = () => {
        setSelectedCycle(null);
        setIsModalOpen(true);
    };

    const handleEdit = (cycle: OkrCycle) => {
        setSelectedCycle(cycle);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedCycle(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    onPress={handleCreate}
                    className="bg-primary text-primary-foreground"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Ciclo
                </Button>
            </div>

            <CyclesTable cycles={cycles} onEdit={handleEdit} />

            <CycleModal
                isOpen={isModalOpen}
                onClose={handleClose}
                cycle={selectedCycle}
            />
        </div>
    );
}
