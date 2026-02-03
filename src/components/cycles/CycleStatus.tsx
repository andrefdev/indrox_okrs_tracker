"use client";

import { Chip } from "@heroui/react";

type CycleStatusType = "draft" | "active" | "completed" | "archived";

interface CycleStatusProps {
    status: CycleStatusType;
    size?: "sm" | "md" | "lg";
}

const statusConfig: Record<CycleStatusType, { label: string; className: string }> = {
    draft: {
        label: "Borrador",
        className: "bg-default-100 text-default-600",
    },
    active: {
        label: "Activo",
        className: "bg-success/20 text-success",
    },
    completed: {
        label: "Completado",
        className: "bg-primary/20 text-primary",
    },
    archived: {
        label: "Archivado",
        className: "bg-default-200 text-default-500",
    },
};

export function CycleStatus({ status, size = "sm" }: CycleStatusProps) {
    const config = statusConfig[status] || statusConfig.draft;

    return (
        <Chip className={`${config.className} font-medium`} size={size}>
            {config.label}
        </Chip>
    );
}
