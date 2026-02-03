"use client";

import { Select, SelectItem } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import type { OkrCycle } from "@/db/schema/okr";

interface CycleSelectorProps {
    cycles: OkrCycle[];
    currentCycleId: string;
}

export function CycleSelector({ cycles, currentCycleId }: CycleSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (!value) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("cycleId", value);

        router.push(`/dashboard?${params.toString()}`);
    };

    return (
        <Select
            label="Ciclo"
            placeholder="Selecciona un ciclo"
            selectedKeys={[currentCycleId]}
            onChange={handleSelectionChange}
            className="max-w-xs"
        >
            {cycles.map((cycle) => (
                <SelectItem key={cycle.cycleId} value={cycle.cycleId} textValue={cycle.name}>
                    {cycle.name}
                </SelectItem>
            ))}
        </Select>
    );
}
