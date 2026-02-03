"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Button, Input, Select, ListBoxItem } from "@heroui/react";
import { Plus, Search } from "lucide-react";
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
    { value: "", label: "Todas las prioridades" },
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
    const [editingObjective, setEditingObjective] = useState<Objective | null>(
        null
    );
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

    // Filter by search query
    const filteredObjectives = objectives.filter((obj) =>
        obj.objective.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-default-400" />
                        <Input
                            type="search"
                            placeholder="Buscar objetivos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Cycle Filter */}
                    <Select
                        selectedKey={currentFilters.cycleId || "all"}
                        onSelectionChange={(key) =>
                            handleFilterChange("cycleId", key === "all" ? "" : String(key))
                        }
                        className="w-40"
                    >
                        <Select.Trigger />
                        <Select.Popover>
                            <ListBoxItem key="all" id="all">
                                Todos los ciclos
                            </ListBoxItem>
                            {cycles.map((cycle) => (
                                <ListBoxItem key={cycle.cycleId} id={cycle.cycleId}>
                                    {cycle.name}
                                </ListBoxItem>
                            ))}
                        </Select.Popover>
                    </Select>

                    {/* Status Filter */}
                    <Select
                        selectedKey={currentFilters.status || "all"}
                        onSelectionChange={(key) =>
                            handleFilterChange("status", key === "all" ? "" : String(key))
                        }
                        className="w-40"
                    >
                        <Select.Trigger />
                        <Select.Popover>
                            {statusOptions.map((opt) => (
                                <ListBoxItem
                                    key={opt.value || "all"}
                                    id={opt.value || "all"}
                                >
                                    {opt.label}
                                </ListBoxItem>
                            ))}
                        </Select.Popover>
                    </Select>

                    {/* Priority Filter */}
                    <Select
                        selectedKey={currentFilters.priority || "all"}
                        onSelectionChange={(key) =>
                            handleFilterChange("priority", key === "all" ? "" : String(key))
                        }
                        className="w-40"
                    >
                        <Select.Trigger />
                        <Select.Popover>
                            {priorityOptions.map((opt) => (
                                <ListBoxItem
                                    key={opt.value || "all"}
                                    id={opt.value || "all"}
                                >
                                    {opt.label}
                                </ListBoxItem>
                            ))}
                        </Select.Popover>
                    </Select>

                    {/* Create Button */}
                    <Button onPress={handleCreate}>
                        <Plus className="h-4 w-4" />
                        Nuevo Objetivo
                    </Button>
                </div>
            </Card>

            {/* Table */}
            <ObjectivesTable objectives={filteredObjectives} onEdit={handleEdit} />

            {/* Create/Edit Modal */}
            <ObjectiveModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                objective={editingObjective}
                cycles={cycles}
            />
        </div>
    );
}
