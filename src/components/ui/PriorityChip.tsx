"use client";

import { Chip } from "@heroui/react";

type Priority = "low" | "medium" | "high" | "critical";

interface PriorityChipProps {
    priority: Priority;
    size?: "sm" | "md" | "lg";
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
    low: {
        label: "Baja",
        className: "bg-default-100 text-default-600",
    },
    medium: {
        label: "Media",
        className: "bg-primary/20 text-primary",
    },
    high: {
        label: "Alta",
        className: "bg-warning/20 text-warning",
    },
    critical: {
        label: "Crítica",
        className: "bg-danger/20 text-danger",
    },
};

export function PriorityChip({ priority, size = "sm" }: PriorityChipProps) {
    const config = priorityConfig[priority];

    return (
        <Chip className={`${config.className} font-medium`} size={size}>
            {config.label}
        </Chip>
    );
}
