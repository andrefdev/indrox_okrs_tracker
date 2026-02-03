"use client";

import { useState } from "react";
import { Button, Card, CardContent } from "@heroui/react";
import { Plus } from "lucide-react";
import { OwnersTable } from "./OwnersTable";
import { OwnerFormModal } from "./OwnerFormModal";
import type { Owner, Area } from "@/db/schema/core";

interface OwnersClientProps {
    owners: (Owner & { area: Area | null })[];
    areas: Area[];
}

export function OwnersClient({ owners, areas }: OwnersClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

    const handleCreate = () => {
        setSelectedOwner(null);
        setIsModalOpen(true);
    };

    const handleEdit = (owner: Owner) => {
        setSelectedOwner(owner);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedOwner(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Owners</h1>
                <Button variant="primary" onPress={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Owner
                </Button>
            </div>

            <Card>
                <CardContent>
                    <OwnersTable owners={owners} onEdit={handleEdit} />
                </CardContent>
            </Card>

            <OwnerFormModal
                isOpen={isModalOpen}
                onClose={handleClose}
                ownerToEdit={selectedOwner}
                areas={areas}
            />
        </div>
    );
}
