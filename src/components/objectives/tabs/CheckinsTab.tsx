"use client";

import { Card, Button } from "@heroui/react";
import { Plus, Calendar, MessageSquare } from "lucide-react";
import { StatusChip } from "@/components/ui";

interface CheckinsTabProps {
    entityType: string;
    entityId: string;
    checkins: any[];
    keyResults?: any[];
}

export function CheckinsTab({ entityType, entityId, checkins, keyResults = [] }: CheckinsTabProps) {
    // Flatten and normalize check-ins
    const krCheckins = keyResults.flatMap(kr =>
        (kr.checkIns || []).map((c: any) => ({
            id: c.id,
            type: 'key_result',
            date: c.createdAt,
            title: `Actualización: ${kr.title}`,
            value: c.value,
            previousValue: c.previousValue,
            unit: kr.unit,
            comment: c.comment,
            evidence: c.evidence,
        }))
    );

    const objCheckins = checkins.map(c => ({
        id: c.checkin.checkinKey,
        type: 'objective',
        date: c.checkin.checkinDate,
        title: "Check-in de Objetivo",
        owner: c.owner,
        status: c.checkin.status,
        confidence: c.checkin.confidence,
        note: c.checkin.progressNote,
        blockers: c.checkin.blockers,
        nextActions: c.checkin.nextActions,
    }));

    const allCheckins = [...krCheckins, ...objCheckins].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Check-ins ({allCheckins.length})</h3>
                <Button>
                    <Plus className="h-4 w-4" />
                    Nuevo Check-in
                </Button>
            </div>

            {allCheckins.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-default-500">No hay check-ins registrados.</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {allCheckins.map((item) => (
                        <Card key={item.id} className="p-4">
                            {item.type === 'objective' ? (
                                // Objective Check-in Render
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <MessageSquare className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{item.owner?.fullName || "Usuario"}</span>
                                                    <StatusChip status={item.status} />
                                                    {item.confidence && (
                                                        <span className="text-sm text-default-400">
                                                            Confianza: {item.confidence}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-1 flex items-center gap-1 text-xs text-default-400">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(item.date).toLocaleDateString("es-ES", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {item.note && (
                                        <div className="mt-3 text-sm text-default-600">
                                            <p className="font-medium text-default-500">Progreso:</p>
                                            <p>{item.note}</p>
                                        </div>
                                    )}
                                    {item.blockers && (
                                        <div className="mt-2 rounded-lg bg-danger/10 p-2 text-sm text-danger">
                                            <p className="font-medium">Bloqueadores:</p>
                                            <p>{item.blockers}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Key Result Check-in Render
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                                                <div className="text-xs font-bold">KR</div>
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{item.title}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {item.previousValue && (
                                                        <>
                                                            <span className="text-default-400 text-sm line-through">{item.previousValue}</span>
                                                            <span className="text-default-300">→</span>
                                                        </>
                                                    )}
                                                    <span className="text-primary font-bold">{item.value} {item.unit}</span>
                                                    <span className="text-xs text-default-400 ml-2">
                                                        {new Date(item.date).toLocaleDateString("es-ES", {
                                                            day: "numeric",
                                                            month: "long",
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {item.comment && (
                                        <div className="mt-3 text-sm text-default-600 bg-default-50 p-2 rounded">
                                            <p>{item.comment}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
