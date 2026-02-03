"use client";

import { Chip } from "@heroui/react";

type Status = "not_started" | "on_track" | "at_risk" | "off_track" | "completed" | "cancelled";

interface StatusChipProps {
    status: Status;
    size?: "sm" | "md" | "lg";
}

const statusConfig: Record<Status, { label: string; className: string }> = {
    not_started: {
        label: "Sin iniciar",
        className: "bg-default-100 text-default-600",
    },
    on_track: {
        label: "On Track",
        className: "bg-success/20 text-success",
    },
    at_risk: {
        label: "En Riesgo",
        className: "bg-warning/20 text-warning",
    },
    off_track: {
        label: "Off Track",
        className: "bg-danger/20 text-danger",
    },
    completed: {
        label: "Completado",
        className: "bg-primary/20 text-primary",
    },
    cancelled: {
        label: "Cancelado",
        className: "bg-default-200 text-default-500",
    },
};

export function StatusChip({ status, size = "sm" }: StatusChipProps) {
    const config = statusConfig[status];

    return (
        <Chip className={`${config.className} font-medium`} size={size}>
            {config.label}
        </Chip>
    );
}
