"use client";

import { Chip } from "@heroui/react";
import { CheckSquare, Bug, Sparkles, Zap, HelpCircle } from "lucide-react";

type WorkItemType = "task" | "bug" | "feature" | "spike" | "other";

interface TypeChipProps {
    type: WorkItemType | string;
    size?: "sm" | "md" | "lg";
    showIcon?: boolean;
}

const typeConfig: Record<
    string,
    { label: string; className: string; icon: any }
> = {
    task: {
        label: "Tarea",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        icon: CheckSquare,
    },
    bug: {
        label: "Bug",
        className: "bg-danger/20 text-danger",
        icon: Bug,
    },
    feature: {
        label: "Feature",
        className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        icon: Sparkles,
    },
    spike: {
        label: "Spike",
        className: "bg-warning/20 text-warning",
        icon: Zap,
    },
    other: {
        label: "Otro",
        className: "bg-default-100 text-default-600",
        icon: HelpCircle,
    },
};

export function TypeChip({ type, size = "sm", showIcon = true }: TypeChipProps) {
    // Fallback for unknown types
    const config = typeConfig[type] || typeConfig["other"];
    const Icon = config.icon;

    return (
        <Chip
            className={`${config.className} font-medium border-0 gap-1`}
            size={size}
        >
            {showIcon && <Icon className="h-3 w-3" />}
            {config.label}
        </Chip>
    );
}
