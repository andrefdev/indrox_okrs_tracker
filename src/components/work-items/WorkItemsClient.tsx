"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Button, Input, Select, ListBox, ListBoxItem, Switch } from "@heroui/react";
import { Plus, Search, FilterX } from "lucide-react";
import { WorkItemWithRelations } from "@/db/queries/work-items";
import { WorkItemsTable } from "./WorkItemsTable";
import { WorkItemModal } from "./WorkItemModal";

interface WorkItemsClientProps {
    workItems: WorkItemWithRelations[];
    initiatives: any[];
    owners: any[];
    currentOwner: any;
}

export function WorkItemsClient({
    workItems,
    initiatives,
    owners,
    currentOwner,
}: WorkItemsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [hideCompleted, setHideCompleted] = useState(true);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
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

    const filteredItems = hideCompleted
        ? workItems.filter((item) => item.workItem.status !== "completed")
        : workItems;

    const completedCount = workItems.filter((item) => item.workItem.status === "completed").length;

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[180px]">
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
                    aria-label="Iniciativa"
                    placeholder="Iniciativa"
                    className="w-36"
                    selectedKey={searchParams.get("initiativeId") || "all"}
                    onSelectionChange={(k) => handleFilterChange("initiativeId", String(k))}
                >
                    <Select.Trigger>
                        <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            <ListBoxItem key="all" id="all">Todas</ListBoxItem>
                            {initiatives.map((init) => (
                                <ListBoxItem key={init.initiativeKey} id={init.initiativeKey}>
                                    {init.name}
                                </ListBoxItem>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>

                <Select
                    aria-label="Tipo"
                    placeholder="Tipo"
                    className="w-32"
                    selectedKey={searchParams.get("type") || "all"}
                    onSelectionChange={(k) => handleFilterChange("type", String(k))}
                >
                    <Select.Trigger>
                        <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            <ListBoxItem key="all" id="all">Todos</ListBoxItem>
                            <ListBoxItem key="task" id="task">Tarea</ListBoxItem>
                            <ListBoxItem key="bug" id="bug">Bug</ListBoxItem>
                            <ListBoxItem key="feature" id="feature">Feature</ListBoxItem>
                            <ListBoxItem key="spike" id="spike">Spike</ListBoxItem>
                        </ListBox>
                    </Select.Popover>
                </Select>

                {searchParams.toString().length > 0 && (
                    <Button isIconOnly variant="ghost" onPress={clearFilters} size="sm">
                        <FilterX className="h-4 w-4 text-default-500" />
                    </Button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                    <Switch
                        isSelected={hideCompleted}
                        onChange={() => setHideCompleted(!hideCompleted)}
                    />
                    <label className="text-xs text-default-500 cursor-pointer" onClick={() => setHideCompleted(!hideCompleted)}>
                        Ocultar completados{completedCount > 0 && ` (${completedCount})`}
                    </label>
                </div>

                <Button
                    onPress={handleCreate}
                    size="sm"
                    className="bg-primary text-primary-foreground"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo
                </Button>
            </div>

            <WorkItemsTable
                workItems={filteredItems}
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
