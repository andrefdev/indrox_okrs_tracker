"use client";

import { Slider, Label } from "@heroui/react";

interface ConfidenceSliderProps {
    value: number;
    onChange?: (value: number) => void;
    disabled?: boolean;
    showLabel?: boolean;
    size?: "sm" | "md";
}

function getConfidenceColor(value: number): string {
    if (value >= 70) return "text-success";
    if (value >= 40) return "text-warning";
    return "text-danger";
}

function getSliderColor(value: number): "success" | "warning" | "danger" {
    if (value >= 70) return "success";
    if (value >= 40) return "warning";
    return "danger";
}

export function ConfidenceSlider({
    value,
    onChange,
    disabled = false,
    showLabel = true,
    size = "md",
}: ConfidenceSliderProps) {
    return (
        <div className="flex flex-col gap-1">
            {showLabel && (
                <div className="flex items-center justify-between">
                    <Label className="text-sm text-default-500">Confianza</Label>
                    <span className={`text-sm font-medium ${getConfidenceColor(value)}`}>
                        {value}%
                    </span>
                </div>
            )}
            <Slider
                value={value}
                onChange={(val) => onChange?.(val as number)}
                minValue={0}
                maxValue={100}
                step={5}
                isDisabled={disabled}
                className="w-full"
                aria-label="Confianza"
            />
        </div>
    );
}

/**
 * Compact confidence display (no slider, just value)
 */
export function ConfidenceBadge({ value }: { value: number }) {
    return (
        <div
            className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${value >= 70
                ? "bg-success/20 text-success"
                : value >= 40
                    ? "bg-warning/20 text-warning"
                    : "bg-danger/20 text-danger"
                }`}
        >
            {value}%
        </div>
    );
}
