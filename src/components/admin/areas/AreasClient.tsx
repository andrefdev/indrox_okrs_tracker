"use client";

import { useState } from "react";
import { Button, Card } from "@heroui/react";
import { Plus } from "lucide-react";
import { AreasTable } from "./AreasTable";
import { AreaFormModal } from "./AreaFormModal";
import type { Area, Owner } from "@/db/schema/core";

interface AreasClientProps {
    areas: (Area & { leadOwner: Owner | null })[];
    owners: Owner[];
}

export function AreasClient({ areas, owners }: AreasClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);

    const handleCreate = () => {
        setSelectedArea(null);
        setIsModalOpen(true);
    };

    const handleEdit = (area: Area) => {
        setSelectedArea(area);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedArea(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Áreas</h1>
                <Button variant="primary" onPress={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Área
                </Button>
            </div>

            <Card>
                <div className="p-4">
                    <AreasTable areas={areas} onEdit={handleEdit} />
                </div>
            </Card>

            <AreaFormModal
                isOpen={isModalOpen}
                onClose={handleClose}
                areaToEdit={selectedArea}
                owners={owners}
            />
        </div>
    );
}
