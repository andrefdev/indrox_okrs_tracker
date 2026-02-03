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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard title="Objetivos (Objectives)" counts={stats.objectives} />
            <DashboardCard title="Resultados Clave (KRs)" counts={stats.keyResults} />
            <DashboardCard title="Iniciativas" counts={stats.initiatives} />
        </div>
    );
}

function DashboardCard({ title, counts }: { title: string; counts: StatusCount[] }) {
    const total = counts.reduce((acc, curr) => acc + curr.count, 0);
    const completed = counts.find((s) => s.status === "completed")?.count || 0;
    const onTrack = counts.find((s) => s.status === "on_track")?.count || 0;
    const atRisk = counts
        .filter((s) => ["at_risk", "off_track"].includes(s.status))
        .reduce((acc, curr) => acc + curr.count, 0);

    return (
        <Card>
            <div className="p-4 gap-4 flex flex-col">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <span className="text-2xl font-bold">{total}</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-success">Completados</span>
                        <span>{completed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-primary">On Track</span>
                        <span>{onTrack}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-danger">Riesgo / Blocked</span>
                        <span>{atRisk}</span>
                    </div>
                </div>
                {/* Simple visual bar */}
                <div className="h-2 w-full flex rounded-full overflow-hidden bg-default-100">
                    <div
                        className="bg-success h-full"
                        style={{ width: `${(completed / (total || 1)) * 100}%` }}
                    />
                    <div
                        className="bg-primary h-full"
                        style={{ width: `${(onTrack / (total || 1)) * 100}%` }}
                    />
                    <div
                        className="bg-danger h-full"
                        style={{ width: `${(atRisk / (total || 1)) * 100}%` }}
                    />
                </div>
            </div>
        </Card>
    );
}
