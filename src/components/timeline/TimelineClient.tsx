"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, Label, ListBox, ListBoxItem, Chip } from "@heroui/react";
import {
    ChevronRight,
    ChevronDown,
    Target,
    TrendingUp,
    Rocket,
    ListTodo,
    Calendar,
} from "lucide-react";
import {
    differenceInDays,
    format,
    eachMonthOfInterval,
    parseISO,
    isAfter,
    isBefore,
    startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { StatusChip } from "@/components/ui/StatusChip";
import type { OkrCycle } from "@/db/schema/okr";
import type { TimelineData } from "@/db/queries/timeline";

interface TimelineClientProps {
    data: TimelineData | null;
    cycles: OkrCycle[];
    currentCycleId: string;
}

type ExpandedState = Record<string, boolean>;

const statusColors: Record<string, string> = {
    not_started: "bg-default-300",
    on_track: "bg-success",
    at_risk: "bg-warning",
    off_track: "bg-danger",
    completed: "bg-primary",
    cancelled: "bg-default-400",
};

const statusBgLight: Record<string, string> = {
    not_started: "bg-default-100",
    on_track: "bg-success/15",
    at_risk: "bg-warning/15",
    off_track: "bg-danger/15",
    completed: "bg-primary/15",
    cancelled: "bg-default-100",
};

const statusBorder: Record<string, string> = {
    not_started: "border-default-200",
    on_track: "border-success/30",
    at_risk: "border-warning/30",
    off_track: "border-danger/30",
    completed: "border-primary/30",
    cancelled: "border-default-200",
};

type TimelineRow = {
    id: string;
    type: "objective" | "key_result" | "initiative" | "work_item";
    label: string;
    status: string;
    priority?: string;
    confidence?: number | null;
    owner?: string | null;
    depth: number;
    hasChildren: boolean;
    isExpanded: boolean;
    barStyle: { left: string; width: string } | null;
    progress?: number;
    startDate?: string | null;
    endDate?: string | null;
    href?: string;
};

const typeIcons = {
    objective: Target,
    key_result: TrendingUp,
    initiative: Rocket,
    work_item: ListTodo,
};

const typeLabels: Record<string, string> = {
    objective: "Objetivo",
    key_result: "Key Result",
    initiative: "Iniciativa",
    work_item: "Work Item",
};

const typeIconColors: Record<string, string> = {
    objective: "text-primary",
    key_result: "text-success",
    initiative: "text-secondary",
    work_item: "text-default-400",
};

export function TimelineClient({
    data,
    cycles,
    currentCycleId,
}: TimelineClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const timelineRef = useRef<HTMLDivElement>(null);

    const handleCycleChange = (key: React.Key | null) => {
        if (!key) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("cycleId", String(key));
        router.push(`/timeline?${params.toString()}`);
    };

    const toggleExpand = (id: string) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const expandAll = () => {
        if (!data) return;
        const all: ExpandedState = {};
        data.objectives.forEach((obj) => {
            all[obj.objective.objectiveKey] = true;
            obj.initiatives.forEach((init) => {
                all[init.initiative.initiativeKey] = true;
            });
        });
        setExpanded(all);
    };

    const collapseAll = () => setExpanded({});

    // Timeline calculations
    const timelineInfo = useMemo(() => {
        if (!data) return null;

        const cycleStart = parseISO(data.cycle.startDate);
        const cycleEnd = parseISO(data.cycle.endDate);
        const totalDays = differenceInDays(cycleEnd, cycleStart) || 1;
        const today = startOfDay(new Date());

        const months = eachMonthOfInterval({
            start: cycleStart,
            end: cycleEnd,
        });

        const todayPercent =
            isAfter(today, cycleStart) && isBefore(today, cycleEnd)
                ? (differenceInDays(today, cycleStart) / totalDays) * 100
                : null;

        return { cycleStart, cycleEnd, totalDays, months, todayPercent };
    }, [data]);

    if (!data || !timelineInfo) {
        return (
            <div className="rounded-xl border border-default-200 p-8 text-center text-default-500">
                No se encontraron datos para este ciclo.
            </div>
        );
    }

    const { cycleStart, totalDays, months, todayPercent } = timelineInfo;

    function getBarStyle(startDate: string | null, endDate: string | null) {
        if (!startDate && !endDate) return null;

        const start = startDate
            ? parseISO(startDate)
            : parseISO(data!.cycle.startDate);
        const end = endDate
            ? parseISO(endDate)
            : parseISO(data!.cycle.endDate);

        const left = Math.max(
            0,
            (differenceInDays(start, cycleStart) / totalDays) * 100
        );
        const width = Math.max(
            1,
            Math.min(
                100 - left,
                (differenceInDays(end, start) / totalDays) * 100
            )
        );

        return { left: `${left}%`, width: `${width}%` };
    }

    function buildTooltipText(row: TimelineRow): string {
        const parts = [row.label];
        if (row.owner) parts.push(`Responsable: ${row.owner}`);
        if (row.startDate)
            parts.push(
                `Inicio: ${format(parseISO(row.startDate), "d MMM yyyy", { locale: es })}`
            );
        if (row.endDate)
            parts.push(
                `Fin: ${format(parseISO(row.endDate), "d MMM yyyy", { locale: es })}`
            );
        if (row.progress !== undefined) parts.push(`${row.progress}% completado`);
        return parts.join("\n");
    }

    // Build flat rows for rendering
    const rows: TimelineRow[] = [];

    data.objectives.forEach((obj) => {
        const objId = obj.objective.objectiveKey;
        const hasChildren =
            obj.keyResults.length > 0 || obj.initiatives.length > 0;

        rows.push({
            id: objId,
            type: "objective",
            label: obj.objective.title,
            status: obj.objective.status,
            priority: obj.objective.priority,
            confidence: obj.objective.confidence,
            owner: obj.owner?.fullName,
            depth: 0,
            hasChildren,
            isExpanded: !!expanded[objId],
            barStyle: { left: "0%", width: "100%" },
            href: `/objectives/${objId}`,
        });

        if (expanded[objId]) {
            // Key Results
            obj.keyResults.forEach((kr) => {
                const current = parseFloat(kr.currentValue || "0");
                const target = parseFloat(kr.targetValue || "100");
                const progress =
                    target > 0
                        ? Math.min(100, Math.round((current / target) * 100))
                        : 0;

                rows.push({
                    id: kr.krKey,
                    type: "key_result",
                    label: kr.title,
                    status: kr.status,
                    confidence: kr.confidence,
                    depth: 1,
                    hasChildren: false,
                    isExpanded: false,
                    barStyle: { left: "0%", width: "100%" },
                    progress,
                });
            });

            // Initiatives
            obj.initiatives.forEach((init) => {
                const initId = init.initiative.initiativeKey;
                const hasWI = init.workItems.length > 0;

                rows.push({
                    id: initId,
                    type: "initiative",
                    label: init.initiative.name,
                    status: init.initiative.status,
                    priority: init.initiative.priority,
                    owner: init.owner?.fullName,
                    depth: 1,
                    hasChildren: hasWI,
                    isExpanded: !!expanded[initId],
                    barStyle: getBarStyle(
                        init.initiative.startDate,
                        init.initiative.dueDate
                    ),
                    startDate: init.initiative.startDate,
                    endDate: init.initiative.dueDate,
                    href: `/initiatives`,
                });

                if (expanded[initId]) {
                    init.workItems.forEach((wi) => {
                        rows.push({
                            id: wi.workItem.workitemKey,
                            type: "work_item",
                            label: wi.workItem.title,
                            status: wi.workItem.status,
                            priority: wi.workItem.priority,
                            owner: wi.owner?.fullName,
                            depth: 2,
                            hasChildren: false,
                            isExpanded: false,
                            barStyle: getBarStyle(
                                wi.workItem.startDate,
                                wi.workItem.dueDate
                            ),
                            startDate: wi.workItem.startDate,
                            endDate: wi.workItem.dueDate,
                        });
                    });
                }
            });
        }
    });

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap items-end gap-3">
                <Select
                    selectedKey={currentCycleId}
                    onSelectionChange={handleCycleChange}
                    className="max-w-xs"
                >
                    <Label>Ciclo</Label>
                    <Select.Trigger>
                        <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            {cycles.map((cycle) => (
                                <ListBoxItem
                                    key={cycle.cycleId}
                                    id={cycle.cycleId}
                                    textValue={cycle.name}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span>{cycle.name}</span>
                                        {cycle.status === "active" && (
                                            <Chip
                                                size="sm"
                                                className="bg-success/20 text-success"
                                            >
                                                Activo
                                            </Chip>
                                        )}
                                    </div>
                                </ListBoxItem>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>

                <div className="flex gap-2">
                    <button
                        onClick={expandAll}
                        className="rounded-lg border border-default-200 px-3 py-1.5 text-xs font-medium text-default-600 transition-colors hover:bg-default-100"
                    >
                        Expandir todo
                    </button>
                    <button
                        onClick={collapseAll}
                        className="rounded-lg border border-default-200 px-3 py-1.5 text-xs font-medium text-default-600 transition-colors hover:bg-default-100"
                    >
                        Colapsar todo
                    </button>
                </div>

                <div className="ml-auto flex items-center gap-4 text-xs text-default-500">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(parseISO(data.cycle.startDate), "d MMM yyyy", {
                            locale: es,
                        })}{" "}
                        -{" "}
                        {format(parseISO(data.cycle.endDate), "d MMM yyyy", {
                            locale: es,
                        })}
                    </span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-default-500">
                <span className="font-medium">Estado:</span>
                {Object.entries({
                    not_started: "Sin iniciar",
                    on_track: "On Track",
                    at_risk: "En Riesgo",
                    off_track: "Off Track",
                    completed: "Completado",
                }).map(([key, label]) => (
                    <span key={key} className="flex items-center gap-1">
                        <span
                            className={`inline-block h-2.5 w-2.5 rounded-sm ${statusColors[key]}`}
                        />
                        {label}
                    </span>
                ))}
                {todayPercent !== null && (
                    <span className="flex items-center gap-1">
                        <span className="inline-block h-2.5 w-0.5 bg-red-500" />
                        Hoy
                    </span>
                )}
            </div>

            {/* Timeline */}
            {rows.length === 0 ? (
                <div className="rounded-xl border border-default-200 p-12 text-center text-default-500">
                    No hay objetivos en este ciclo.
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-default-200 bg-background">
                    {/* Header */}
                    <div className="flex border-b border-default-200 bg-default-50">
                        <div className="w-[380px] min-w-[380px] border-r border-default-200 px-3 py-2 text-xs font-semibold text-default-600">
                            Elemento
                        </div>
                        <div
                            className="relative flex-1 overflow-hidden"
                            ref={timelineRef}
                        >
                            <div className="flex h-full">
                                {months.map((month, i) => {
                                    const monthStart = differenceInDays(
                                        month,
                                        parseISO(data.cycle.startDate)
                                    );
                                    const left =
                                        (monthStart / totalDays) * 100;

                                    return (
                                        <div
                                            key={i}
                                            className="absolute top-0 bottom-0 border-l border-default-200 px-2 py-2"
                                            style={{
                                                left: `${Math.max(0, left)}%`,
                                            }}
                                        >
                                            <span className="text-[10px] font-medium uppercase text-default-400 whitespace-nowrap">
                                                {format(month, "MMM yyyy", {
                                                    locale: es,
                                                })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-default-100">
                        {rows.map((row) => {
                            const Icon = typeIcons[row.type];
                            const paddingLeft = 12 + row.depth * 24;

                            return (
                                <div
                                    key={row.id}
                                    className={`flex transition-colors hover:bg-default-50 ${
                                        row.type === "objective"
                                            ? "bg-default-50/50"
                                            : ""
                                    }`}
                                >
                                    {/* Left Panel */}
                                    <div
                                        className="flex w-[380px] min-w-[380px] items-center gap-2 border-r border-default-200 py-2 pr-2"
                                        style={{
                                            paddingLeft: `${paddingLeft}px`,
                                        }}
                                    >
                                        {/* Expand/Collapse */}
                                        {row.hasChildren ? (
                                            <button
                                                onClick={() =>
                                                    toggleExpand(row.id)
                                                }
                                                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded transition-colors hover:bg-default-200"
                                            >
                                                {row.isExpanded ? (
                                                    <ChevronDown className="h-3.5 w-3.5 text-default-500" />
                                                ) : (
                                                    <ChevronRight className="h-3.5 w-3.5 text-default-500" />
                                                )}
                                            </button>
                                        ) : (
                                            <span className="w-5 flex-shrink-0" />
                                        )}

                                        {/* Icon */}
                                        <span title={typeLabels[row.type]}>
                                            <Icon
                                                className={`h-3.5 w-3.5 flex-shrink-0 ${typeIconColors[row.type]}`}
                                            />
                                        </span>

                                        {/* Label */}
                                        <div className="flex min-w-0 flex-1 items-center gap-1.5">
                                            {row.href ? (
                                                <a
                                                    href={row.href}
                                                    className={`truncate text-sm hover:text-primary hover:underline ${
                                                        row.type ===
                                                        "objective"
                                                            ? "font-semibold"
                                                            : "font-medium"
                                                    }`}
                                                    title={row.label}
                                                >
                                                    {row.label}
                                                </a>
                                            ) : (
                                                <span
                                                    className={`truncate text-sm ${
                                                        row.type ===
                                                        "objective"
                                                            ? "font-semibold"
                                                            : row.type ===
                                                                "key_result"
                                                              ? "text-default-600"
                                                              : "font-medium"
                                                    }`}
                                                    title={row.label}
                                                >
                                                    {row.label}
                                                </span>
                                            )}
                                        </div>

                                        {/* Status */}
                                        <StatusChip
                                            status={row.status as any}
                                            size="sm"
                                        />
                                    </div>

                                    {/* Right Panel - Timeline Bar */}
                                    <div className="relative flex-1 py-2">
                                        {/* Month grid lines */}
                                        {months.map((month, i) => {
                                            const monthStart =
                                                differenceInDays(
                                                    month,
                                                    parseISO(
                                                        data.cycle.startDate
                                                    )
                                                );
                                            const left =
                                                (monthStart / totalDays) * 100;
                                            return (
                                                <div
                                                    key={i}
                                                    className="absolute top-0 bottom-0 border-l border-default-100"
                                                    style={{
                                                        left: `${Math.max(0, left)}%`,
                                                    }}
                                                />
                                            );
                                        })}

                                        {/* Today marker */}
                                        {todayPercent !== null && (
                                            <div
                                                className="absolute top-0 bottom-0 z-10 w-0.5 bg-red-500/60"
                                                style={{
                                                    left: `${todayPercent}%`,
                                                }}
                                            />
                                        )}

                                        {/* Bar */}
                                        {row.barStyle && (
                                            <div className="relative mx-2 h-full">
                                                {row.type === "key_result" ? (
                                                    <div
                                                        className="absolute top-1/2 h-4 -translate-y-1/2 rounded-full bg-default-100 overflow-hidden cursor-default"
                                                        style={{
                                                            left: row.barStyle
                                                                .left,
                                                            width: row.barStyle
                                                                .width,
                                                        }}
                                                        title={`${row.progress ?? 0}% completado`}
                                                    >
                                                        <div
                                                            className={`h-full rounded-full transition-all ${statusColors[row.status]} opacity-70`}
                                                            style={{
                                                                width: `${row.progress ?? 0}%`,
                                                            }}
                                                        />
                                                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground/70">
                                                            {row.progress ?? 0}%
                                                        </span>
                                                    </div>
                                                ) : row.type === "objective" ? (
                                                    <div
                                                        className={`absolute top-1/2 h-5 -translate-y-1/2 rounded ${statusBgLight[row.status]} border ${statusBorder[row.status]} cursor-default`}
                                                        style={{
                                                            left: row.barStyle
                                                                .left,
                                                            width: row.barStyle
                                                                .width,
                                                        }}
                                                        title={buildTooltipText(
                                                            row
                                                        )}
                                                    >
                                                        <div
                                                            className={`h-full w-1 rounded-l ${statusColors[row.status]}`}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={`absolute top-1/2 h-4 -translate-y-1/2 rounded-full ${statusColors[row.status]} opacity-75 transition-opacity hover:opacity-100 cursor-default`}
                                                        style={{
                                                            left: row.barStyle
                                                                .left,
                                                            width: row.barStyle
                                                                .width,
                                                            minWidth: "4px",
                                                        }}
                                                        title={buildTooltipText(
                                                            row
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {/* No dates indicator */}
                                        {!row.barStyle &&
                                            row.type !== "key_result" && (
                                                <div className="flex h-full items-center px-4">
                                                    <span className="text-[10px] italic text-default-400">
                                                        Sin fechas
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary footer */}
                    <div className="flex items-center gap-4 border-t border-default-200 bg-default-50 px-4 py-2 text-xs text-default-500">
                        <span>
                            {data.objectives.length} objetivo
                            {data.objectives.length !== 1 ? "s" : ""}
                        </span>
                        <span>
                            {data.objectives.reduce(
                                (acc, o) => acc + o.keyResults.length,
                                0
                            )}{" "}
                            key results
                        </span>
                        <span>
                            {data.objectives.reduce(
                                (acc, o) => acc + o.initiatives.length,
                                0
                            )}{" "}
                            iniciativas
                        </span>
                        <span>
                            {data.objectives.reduce(
                                (acc, o) =>
                                    acc +
                                    o.initiatives.reduce(
                                        (a, i) => a + i.workItems.length,
                                        0
                                    ),
                                0
                            )}{" "}
                            work items
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
