"use client";

import { Card, Button } from "@heroui/react";
import { Plus, Calendar, MessageSquare } from "lucide-react";
import { StatusChip } from "@/components/ui";

interface CheckinsTabProps {
    entityType: string;
    entityId: string;
    checkins: any[];
}

export function CheckinsTab({ entityType, entityId, checkins }: CheckinsTabProps) {
    return (
        <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Check-ins ({checkins.length})</h3>
                <Button>
                    <Plus className="h-4 w-4" />
                    Nuevo Check-in
                </Button>
            </div>

            {checkins.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-default-500">No hay check-ins registrados.</p>
                    <Button className="mt-4">
                        <Plus className="h-4 w-4" />
                        Registrar primer check-in
                    </Button>
                </Card>
            ) : (
                <div className="space-y-3">
                    {checkins.map(({ checkin, owner }) => (
                        <Card key={checkin.checkinKey} className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{owner?.fullName || "Usuario"}</span>
                                            <StatusChip status={checkin.status} />
                                            {checkin.confidence && (
                                                <span className="text-sm text-default-400">
                                                    Confianza: {checkin.confidence}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1 flex items-center gap-1 text-xs text-default-400">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(checkin.checkinDate).toLocaleDateString("es-ES", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {checkin.progressNote && (
                                <div className="mt-3 text-sm text-default-600">
                                    <p className="font-medium text-default-500">Progreso:</p>
                                    <p>{checkin.progressNote}</p>
                                </div>
                            )}

                            {checkin.blockers && (
                                <div className="mt-2 rounded-lg bg-danger/10 p-2 text-sm text-danger">
                                    <p className="font-medium">Bloqueadores:</p>
                                    <p>{checkin.blockers}</p>
                                </div>
                            )}

                            {checkin.nextActions && (
                                <div className="mt-2 text-sm text-default-600">
                                    <p className="font-medium text-default-500">Próximas acciones:</p>
                                    <p>{checkin.nextActions}</p>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
