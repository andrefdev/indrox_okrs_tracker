"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { DependenciesTable } from "./DependenciesTable";
import { DependencyModal } from "./DependencyModal";
import { deleteDependency } from "@/app/actions/dependencies";
import { toast } from "sonner";
import type { Dependency } from "@/db/schema/okr-related";
import type { Initiative, Objective } from "@/db/schema/okr";

interface DependenciesClientProps {
    dependencies: Dependency[];
    initiatives: Initiative[];
    objectives: Objective[];
}

export function DependenciesClient({ dependencies, initiatives, objectives }: DependenciesClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDependency, setSelectedDependency] = useState<Dependency | null>(null);

    const handleCreate = () => {
        setSelectedDependency(null);
        setIsModalOpen(true);
    };

    const handleEdit = (dep: Dependency) => {
        setSelectedDependency(dep);
        setIsModalOpen(true);
    };

    const handleDelete = async (dep: Dependency) => {
        if (confirm("¿Estás seguro de que quieres eliminar esta dependencia?")) {
            const result = await deleteDependency(dep.dependencyKey);
            if (result.success) {
                toast.success("Dependencia eliminada");
            } else {
                toast.error("Error al eliminar");
            }
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedDependency(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    className="bg-primary text-primary-foreground"
                    onPress={handleCreate}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Dependencia
                </Button>
            </div>

            <DependenciesTable
                dependencies={dependencies}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <DependencyModal
                isOpen={isModalOpen}
                onClose={handleClose}
                dependency={selectedDependency}
                initiatives={initiatives}
                objectives={objectives}
            />
        </div>
    );
}
