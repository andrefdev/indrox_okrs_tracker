"use client";

import { Select, Label, ListBox, ListBoxItem } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import type { OkrCycle } from "@/db/schema/okr";

interface CycleSelectorProps {
    cycles: OkrCycle[];
    currentCycleId: string;
}

export function CycleSelector({ cycles, currentCycleId }: CycleSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSelectionChange = (key: React.Key | null) => {
        if (!key) return;
        const value = String(key);

        const params = new URLSearchParams(searchParams.toString());
        params.set("cycleId", value);

        router.push(`/dashboard?${params.toString()}`);
    };

    return (
        <Select
            selectedKey={currentCycleId}
            onSelectionChange={handleSelectionChange}
            className="max-w-xs"
        >
            <Label>Ciclo</Label>
            <Select.Trigger>
                <Select.Value />
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {cycles.map((cycle) => (
                        <ListBoxItem key={cycle.cycleId} id={cycle.cycleId} textValue={cycle.name}>
                            {cycle.name}
                        </ListBoxItem>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}
