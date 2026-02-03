import { Card, Button, Chip } from "@heroui/react";
import {
    Target,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Plus,
    ArrowUpRight,
    Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/ui";

// Placeholder stats - replace with actual data fetching
const stats = [
    {
        label: "Objetivos Activos",
        value: "12",
        change: "+2 este mes",
        trend: "up" as const,
        icon: Target,
    },
    {
        label: "On Track",
        value: "8",
        change: "67%",
        trend: "up" as const,
        icon: TrendingUp,
    },
    {
        label: "En Riesgo",
        value: "3",
        change: "25%",
        trend: "down" as const,
        icon: AlertCircle,
    },
    {
        label: "Completados",
        value: "24",
        change: "Q1 2026",
        trend: "neutral" as const,
        icon: CheckCircle2,
    },
];

export default function DashboardPage() {
    return (
        <div>
            <PageHeader
                title="Dashboard"
                description="Visión general de tus OKRs y métricas clave"
                breadcrumbs={[{ label: "Dashboard" }]}
                actions={
                    <Button>
                        <Plus className="h-4 w-4" />
                        Nuevo Objetivo
                    </Button>
                }
            />

            {/* Stats Grid */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="p-4">
                            <Card.Content className="p-0">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-default-500">{stat.label}</p>
                                        <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                                        <p className="mt-1 text-xs text-default-400">{stat.change}</p>
                                    </div>
                                    <div className={`rounded-lg p-2 ${stat.trend === "up"
                                            ? "bg-success/10 text-success"
                                            : stat.trend === "down"
                                                ? "bg-danger/10 text-danger"
                                                : "bg-default-100 text-default-500"
                                        }`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="mb-4 text-lg font-semibold">Acciones Rápidas</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="group cursor-pointer transition-shadow hover:shadow-md">
                        <Card.Content className="flex items-center gap-4 p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Target className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">Crear Objetivo</h3>
                                <p className="text-sm text-default-500">Define un nuevo objetivo</p>
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-default-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Card.Content>
                    </Card>

                    <Card className="group cursor-pointer transition-shadow hover:shadow-md">
                        <Card.Content className="flex items-center gap-4 p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                                <Calendar className="h-6 w-6 text-secondary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">Nuevo Check-in</h3>
                                <p className="text-sm text-default-500">Registra progreso</p>
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-default-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Card.Content>
                    </Card>

                    <Card className="group cursor-pointer transition-shadow hover:shadow-md">
                        <Card.Content className="flex items-center gap-4 p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                                <AlertCircle className="h-6 w-6 text-warning" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">Ver Riesgos</h3>
                                <p className="text-sm text-default-500">3 riesgos abiertos</p>
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-default-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Card.Content>
                    </Card>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">Objetivos Prioritarios</h2>
                <Card>
                    <Card.Content className="divide-y divide-default-100 p-0">
                        {[
                            { title: "Incrementar MRR en 30%", status: "on_track" as const, owner: "María García" },
                            { title: "Lanzar producto v2.0", status: "at_risk" as const, owner: "Carlos López" },
                            { title: "Reducir churn a <5%", status: "on_track" as const, owner: "Ana Martín" },
                        ].map((objective, i) => (
                            <div key={i} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <Target className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{objective.title}</p>
                                        <p className="text-sm text-default-500">{objective.owner}</p>
                                    </div>
                                </div>
                                <Chip
                                    variant={objective.status === "on_track" ? "primary" : "soft"}
                                    className={objective.status === "at_risk" ? "bg-warning/20 text-warning" : ""}
                                >
                                    {objective.status === "on_track" ? "On Track" : "En Riesgo"}
                                </Chip>
                            </div>
                        ))}
                    </Card.Content>
                </Card>
            </div>
        </div>
    );
}
