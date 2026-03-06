"use client";

import { Card } from "@heroui/react";

interface StatusCount {
    status: string;
    count: number;
}

interface DashboardCardsProps {
    stats: {
        objectives: StatusCount[];
        keyResults: StatusCount[];
        initiatives: StatusCount[];
    };
}

export function DashboardCards({ stats }: DashboardCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard title="Objetivos" counts={stats.objectives} />
            <MetricCard title="Key Results" counts={stats.keyResults} />
            <MetricCard title="Iniciativas" counts={stats.initiatives} />
        </div>
    );
}

function MetricCard({ title, counts }: { title: string; counts: StatusCount[] }) {
    const total = counts.reduce((acc, curr) => acc + curr.count, 0);
    const completed = counts.find((s) => s.status === "completed")?.count || 0;
    const onTrack = counts.find((s) => s.status === "on_track")?.count || 0;
    const atRisk = counts.find((s) => s.status === "at_risk")?.count || 0;
    const offTrack = counts.find((s) => s.status === "off_track")?.count || 0;

    return (
        <Card className="p-4">
            <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-sm font-medium text-default-500">{title}</h3>
                <span className="text-2xl font-bold">{total}</span>
            </div>
            <div className="h-1.5 w-full flex rounded-full overflow-hidden bg-default-100 mb-3">
                {completed > 0 && (
                    <div className="bg-success h-full" style={{ width: `${(completed / total) * 100}%` }} />
                )}
                {onTrack > 0 && (
                    <div className="bg-primary h-full" style={{ width: `${(onTrack / total) * 100}%` }} />
                )}
                {atRisk > 0 && (
                    <div className="bg-warning h-full" style={{ width: `${(atRisk / total) * 100}%` }} />
                )}
                {offTrack > 0 && (
                    <div className="bg-danger h-full" style={{ width: `${(offTrack / total) * 100}%` }} />
                )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-default-500">
                <span><span className="inline-block w-1.5 h-1.5 rounded-full bg-success mr-1" />{completed} completados</span>
                <span><span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1" />{onTrack} on track</span>
                {(atRisk + offTrack) > 0 && (
                    <span><span className="inline-block w-1.5 h-1.5 rounded-full bg-danger mr-1" />{atRisk + offTrack} en riesgo</span>
                )}
            </div>
        </Card>
    );
}
