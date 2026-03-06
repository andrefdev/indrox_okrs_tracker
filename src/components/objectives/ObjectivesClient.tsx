"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Select, ListBox, ListBoxItem } from "@heroui/react";
import { Plus, Search, FilterX } from "lucide-react";
import { ObjectivesTable } from "./ObjectivesTable";
import { ObjectiveModal } from "./ObjectiveModal";
import type { Objective, OkrCycle } from "@/db/schema/okr";

interface ObjectiveWithRelations {
    objective: Objective;
    owner: {
        ownerKey: string;
        fullName: string;
        email: string | null;
        role: string;
    } | null;
    area: { areaKey: string; name: string; code: string } | null;
    cycle: { cycleId: string; name: string } | null;
}

interface ObjectivesClientProps {
    objectives: ObjectiveWithRelations[];
    cycles: OkrCycle[];
    currentFilters: {
        cycleId?: string;
        areaId?: string;
        ownerId?: string;
        status?: string;
        priority?: string;
    };
}

const statusOptions = [
    { value: "", label: "Todos los estados" },
    { value: "not_started", label: "Sin iniciar" },
    { value: "on_track", label: "On Track" },
    { value: "at_risk", label: "En Riesgo" },
    { value: "off_track", label: "Off Track" },
    { value: "completed", label: "Completado" },
    { value: "cancelled", label: "Cancelado" },
];

const priorityOptions = [
    { value: "", label: "Todas" },
    { value: "low", label: "Baja" },
    { value: "medium", label: "Media" },
    { value: "high", label: "Alta" },
    { value: "critical", label: "Crítica" },
];

export function ObjectivesClient({
    objectives,
    cycles,
    currentFilters,
}: ObjectivesClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/objectives?${params.toString()}`);
    };

    const hasFilters = currentFilters.cycleId || currentFilters.status || currentFilters.priority || searchQuery;

    const clearFilters = () => {
        setSearchQuery("");
        router.push("/objectives");
    };

    const handleEdit = (objective: Objective) => {
        setEditingObjective(objective);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingObjective(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingObjective(null);
    };

    const filteredObjectives = objectives.filter((obj) =>
        obj.objective.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[180px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-default-400" />
                    <Input
                        type="search"
                        placeholder="Buscar objetivos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"

                    />
                </div>

                <Select
                    aria-label="Ciclo"
                    selectedKey={currentFilters.cycleId || "all"}
                    onSelectionChange={(key) =>
                        handleFilterChange("cycleId", key === "all" ? "" : String(key))
                    }
                    className="w-36"

                >
                    <Select.Trigger>
                        <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            <ListBoxItem key="all" id="all">Todos los ciclos</ListBoxItem>
                            {cycles.map((cycle) => (
                                <ListBoxItem key={cycle.cycleId} id={cycle.cycleId}>
                                    {cycle.name}
                                </ListBoxItem>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>

                <Select
                    aria-label="Estado"
                    selectedKey={currentFilters.status || "all"}
                    onSelectionChange={(key) =>
                        handleFilterChange("status", key === "all" ? "" : String(key))
                    }
                    className="w-36"

                >
                    <Select.Trigger>
                        <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            {statusOptions.map((opt) => (
                                <ListBoxItem key={opt.value || "all"} id={opt.value || "all"}>
                                    {opt.label}
                                </ListBoxItem>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>

                <Select
                    aria-label="Prioridad"
                    selectedKey={currentFilters.priority || "all"}
                    onSelectionChange={(key) =>
                        handleFilterChange("priority", key === "all" ? "" : String(key))
                    }
                    className="w-28"

                >
                    <Select.Trigger>
                        <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            {priorityOptions.map((opt) => (
                                <ListBoxItem key={opt.value || "all"} id={opt.value || "all"}>
                                    {opt.label}
                                </ListBoxItem>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>

                {hasFilters && (
                    <Button isIconOnly variant="ghost" onPress={clearFilters} size="sm">
                        <FilterX className="h-4 w-4 text-default-500" />
                    </Button>
                )}

                <Button onPress={handleCreate} size="sm" className="bg-primary text-primary-foreground ml-auto">
                    <Plus className="h-4 w-4" />
                    Nuevo
                </Button>
            </div>

            <ObjectivesTable objectives={filteredObjectives} onEdit={handleEdit} />

            <ObjectiveModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                objective={editingObjective}
                cycles={cycles}
            />
        </div>
    );
}
