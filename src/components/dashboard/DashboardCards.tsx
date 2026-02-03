"use client";

import { Card, CardBody } from "@heroui/react";

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
    const countTotal = (counts: StatusCount[]) =>
        counts.reduce((acc, curr) => acc + curr.count, 0);

    const getStatusCount = (counts: StatusCount[], status: string) =>
        counts.find((c) => c.status === status)?.count || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
                title="Objetivos"
                total={countTotal(stats.objectives)}
                completed={getStatusCount(stats.objectives, "completed")}
                onTrack={getStatusCount(stats.objectives, "on_track")}
                atRisk={getStatusCount(stats.objectives, "at_risk") + getStatusCount(stats.objectives, "off_track")}
            />
            <StatCard
                title="Resultados Clave (KRs)"
                total={countTotal(stats.keyResults)}
                completed={getStatusCount(stats.keyResults, "completed")}
                onTrack={getStatusCount(stats.keyResults, "on_track")}
                atRisk={getStatusCount(stats.keyResults, "at_risk") + getStatusCount(stats.keyResults, "off_track")}
            />
            <StatCard
                title="Iniciativas"
                total={countTotal(stats.initiatives)}
                completed={getStatusCount(stats.initiatives, "completed")}
                onTrack={getStatusCount(stats.initiatives, "on_track")}
                atRisk={getStatusCount(stats.initiatives, "at_risk") + getStatusCount(stats.initiatives, "off_track")}
            />
        </div>
    );
}

function StatCard({
    title,
    total,
    completed,
    onTrack,
    atRisk,
}: {
    title: string;
    total: number;
    completed: number;
    onTrack: number;
    atRisk: number;
}) {
    return (
        <Card>
            <CardBody className="gap-4">
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
            </CardBody>
        </Card>
    );
}
