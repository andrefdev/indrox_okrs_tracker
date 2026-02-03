"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Button, Input, Select, ListBox, ListBoxItem } from "@heroui/react";
import { Plus, Search, FilterX } from "lucide-react";
import { WorkItemWithRelations } from "@/db/queries/work-items";
import { WorkItemsTable } from "./WorkItemsTable";
import { WorkItemModal } from "./WorkItemModal";

interface WorkItemsClientProps {
    workItems: WorkItemWithRelations[];
    initiatives: any[];
    owners: any[];
    currentOwner: any; // Owner object with role, key, etc.
}

export function WorkItemsClient({
    workItems,
    initiatives,
    owners,
    currentOwner,
}: WorkItemsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Filter handlers
    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        // If "all" is selected or empty value, remove filter
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.replace(`/work-items?${params.toString()}`);
    };

    const clearFilters = () => {
        router.replace("/work-items");
    };

    const handleCreate = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: WorkItemWithRelations) => {
        setEditingItem(item.workItem);
        setIsModalOpen(true);
    };

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
                            placeholder="Buscar..."
                            defaultValue={searchParams.get("search") || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleFilterChange("search", e.target.value)
                            }
                            className="pl-9"
                        />
                    </div>

                    <Select
                        aria-label="Filtrar por Iniciativa"
                        placeholder="Iniciativa"
                        className="w-40"
                        selectedKey={searchParams.get("initiativeId") || "all"}
                        onSelectionChange={(k) => handleFilterChange("initiativeId", String(k))}
                    >
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                <ListBoxItem key="all" id="all">
                                    Todas las iniciativas
                                </ListBoxItem>
                                {initiatives.map((init) => (
                                    <ListBoxItem key={init.initiativeKey} id={init.initiativeKey}>
                                        {init.name}
                                    </ListBoxItem>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>

                    <Select
                        aria-label="Filtrar por Estado"
                        placeholder="Estado"
                        className="w-40"
                        selectedKey={searchParams.get("status") || "all"}
                        onSelectionChange={(k) => handleFilterChange("status", String(k))}
                    >
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                <ListBoxItem key="all" id="all">
                                    Todos los estados
                                </ListBoxItem>
                                <ListBoxItem key="not_started" id="not_started">
                                    Sin iniciar
                                </ListBoxItem>
                                <ListBoxItem key="on_track" id="on_track">
                                    On Track
                                </ListBoxItem>
                                <ListBoxItem key="at_risk" id="at_risk">
                                    En Riesgo
                                </ListBoxItem>
                                <ListBoxItem key="off_track" id="off_track">
                                    Off Track
                                </ListBoxItem>
                                <ListBoxItem key="completed" id="completed">
                                    Completado
                                </ListBoxItem>
                            </ListBox>
                        </Select.Popover>
                    </Select>

                    <Select
                        aria-label="Filtrar por Tipo"
                        placeholder="Tipo"
                        className="w-40"
                        selectedKey={searchParams.get("type") || "all"}
                        onSelectionChange={(k) => handleFilterChange("type", String(k))}
                    >
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                <ListBoxItem key="all" id="all">
                                    Todos los tipos
                                </ListBoxItem>
                                <ListBoxItem key="task" id="task">
                                    Tarea
                                </ListBoxItem>
                                <ListBoxItem key="bug" id="bug">
                                    Bug
                                </ListBoxItem>
                                <ListBoxItem key="feature" id="feature">
                                    Feature
                                </ListBoxItem>
                                <ListBoxItem key="spike" id="spike">
                                    Spike
                                </ListBoxItem>
                            </ListBox>
                        </Select.Popover>
                    </Select>

                    {searchParams.toString().length > 0 && (
                        <Button isIconOnly variant="ghost" onPress={clearFilters} size="sm">
                            <FilterX className="h-4 w-4 text-default-500" />
                        </Button>
                    )}

                    {/* Create Button */}
                    <Button
                        onPress={handleCreate}
                        className="bg-primary text-primary-foreground flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Work Item
                    </Button>
                </div>
            </Card>

            <WorkItemsTable
                workItems={workItems}
                currentOwnerId={currentOwner ? currentOwner.ownerKey : null}
                userRole={currentOwner ? currentOwner.role : "GUEST"}
                onEdit={handleEdit}
            />

            <WorkItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                workItem={editingItem}
                initiatives={initiatives}
                owners={owners}
                currentOwnerId={currentOwner ? currentOwner.ownerKey : undefined}
            />
        </div>
    );
}
