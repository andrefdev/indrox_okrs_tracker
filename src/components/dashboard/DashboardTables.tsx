"use client";

import { Card, CardHeader } from "@heroui/react";
import Link from "next/link";
import { StatusChip, PriorityChip } from "@/components/ui";

interface DashboardTablesProps {
    blocked: {
        objectives: any[];
        initiatives: any[];
    };
    noEvidence: any[]; // Initiatives
    priorities: {
        objectives: any[];
        initiatives: any[];
    };
}

export function DashboardTables({ blocked, noEvidence, priorities }: DashboardTablesProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blocked Items */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <h3 className="font-bold text-lg text-danger">Bloqueados / En Riesgo</h3>
                </CardHeader>
                <div className="p-4">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="border-b bg-default-100 uppercase text-xs font-semibold text-default-500">
                                <tr>
                                    <th className="px-4 py-3">TIPO</th>
                                    <th className="px-4 py-3">TÍTULO</th>
                                    <th className="px-4 py-3">OWNER</th>
                                    <th className="px-4 py-3">STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-default-200">
                                {[
                                    ...blocked.objectives.map((o) => ({ ...o, type: "Objective", link: `/objectives/${o.objectiveKey}` })),
                                    ...blocked.initiatives.map((i) => ({ ...i, type: "Initiative", title: i.name, link: `/initiatives/${i.initiativeKey}` })),
                                ].length === 0 ? (
                                    <tr><td colSpan={4} className="px-4 py-3 text-center">No hay items bloqueados.</td></tr>
                                ) : (
                                    [
                                        ...blocked.objectives.map((o) => ({ ...o, type: "Objective", link: `/objectives/${o.objectiveKey}` })),
                                        ...blocked.initiatives.map((i) => ({ ...i, type: "Initiative", title: i.name, link: `/initiatives/${i.initiativeKey}` })),
                                    ].map((item: any) => (
                                        <tr key={item.objectiveKey || item.initiativeKey} className="hover:bg-default-50">
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-default-100 text-default-600">
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link href={item.link} className="font-medium hover:underline">
                                                    {item.title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.owner ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase">
                                                            {item.owner.fullName.charAt(0)}
                                                        </div>
                                                        <div className="text-sm font-medium">{item.owner.fullName}</div>
                                                    </div>
                                                ) : "-"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusChip status={item.status} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>

            {/* High Priority Items */}
            <Card>
                <CardHeader>
                    <h3 className="font-bold text-lg">Prioridad Alta</h3>
                </CardHeader>
                <div className="p-4">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="border-b bg-default-100 uppercase text-xs font-semibold text-default-500">
                                <tr>
                                    <th className="px-4 py-3">TIPO</th>
                                    <th className="px-4 py-3">ITEM</th>
                                    <th className="px-4 py-3">PRIORIDAD</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-default-200">
                                {[
                                    ...priorities.objectives.map((o) => ({ ...o, type: "Objective", link: `/objectives/${o.objectiveKey}` })),
                                    ...priorities.initiatives.map((i) => ({ ...i, type: "Initiative", title: i.name, link: `/initiatives/${i.initiativeKey}` })),
                                ].length === 0 ? (
                                    <tr><td colSpan={3} className="px-4 py-3 text-center">No hay items de prioridad alta/crítica.</td></tr>
                                ) : (
                                    [
                                        ...priorities.objectives.map((o) => ({ ...o, type: "Objective", link: `/objectives/${o.objectiveKey}` })),
                                        ...priorities.initiatives.map((i) => ({ ...i, type: "Initiative", title: i.name, link: `/initiatives/${i.initiativeKey}` })),
                                    ].map((item: any) => (
                                        <tr key={item.objectiveKey || item.initiativeKey} className="hover:bg-default-50">
                                            <td className="px-4 py-3">
                                                <span className="text-xs text-default-500 uppercase">{item.type}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link href={item.link} className="whitespace-normal block min-w-[150px] hover:underline">
                                                    {item.title}
                                                </Link>
                                                {item.dueDate && (
                                                    <span className="text-xs text-default-400 block">Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <PriorityChip priority={item.priority} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>

            {/* No Recent Evidence */}
            <Card>
                <CardHeader>
                    <h3 className="font-bold text-lg text-warning">Sin Evidencia Reciente (+7 días)</h3>
                </CardHeader>
                <div className="p-4">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="border-b bg-default-100 uppercase text-xs font-semibold text-default-500">
                                <tr>
                                    <th className="px-4 py-3">INICIATIVA</th>
                                    <th className="px-4 py-3">OWNER</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-default-200">
                                {noEvidence.length === 0 ? (
                                    <tr><td colSpan={2} className="px-4 py-3 text-center">Todo actualizado.</td></tr>
                                ) : (
                                    noEvidence.map((item: any) => (
                                        <tr key={item.initiativeKey} className="hover:bg-default-50">
                                            <td className="px-4 py-3">
                                                <Link href={`/initiatives/${item.initiativeKey}`} className="font-medium hover:underline">
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.owner ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase">
                                                            {item.owner.fullName.charAt(0)}
                                                        </div>
                                                        <div className="text-sm font-medium">{item.owner.fullName}</div>
                                                    </div>
                                                ) : "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>

        </div>
    );
}
