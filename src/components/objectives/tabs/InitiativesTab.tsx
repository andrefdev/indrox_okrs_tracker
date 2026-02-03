"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@heroui/react";
import { Plus, Link2, Unlink } from "lucide-react";
import { StatusChip, PriorityChip } from "@/components/ui";
import { LinkInitiativeModal } from "../LinkInitiativeModal";
import { unlinkInitiativeFromObjective } from "@/app/actions/initiatives";
import { toast } from "sonner";

interface InitiativesTabProps {
    objectiveId: string;
    initiatives: any[];
}

export function InitiativesTab({ objectiveId, initiatives }: InitiativesTabProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

    const handleUnlink = (initiativeId: string) => {
        if (!confirm("¿Desvincular esta iniciativa del objetivo?")) return;

        startTransition(async () => {
            try {
                await unlinkInitiativeFromObjective(initiativeId, objectiveId);
                toast.success("Iniciativa desvinculada");
                router.refresh();
            } catch (error) {
                toast.error("Error al desvincular");
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                    Iniciativas Vinculadas ({initiatives.length})
                </h3>
                <Button onPress={() => setIsLinkModalOpen(true)}>
                    <Link2 className="h-4 w-4" />
                    Vincular Iniciativa
                </Button>
            </div>

            {initiatives.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-default-500">
                        No hay iniciativas vinculadas a este objetivo.
                    </p>
                    <Button className="mt-4" onPress={() => setIsLinkModalOpen(true)}>
                        <Link2 className="h-4 w-4" />
                        Vincular primera iniciativa
                    </Button>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-default-200 bg-default-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Nombre</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Relación</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Peso</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Estado</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Prioridad</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Owner</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-default-100">
                                {initiatives.map(({ initiative, relationType, weight, initiativeOwner }) => (
                                    <tr key={initiative.initiativeKey} className="hover:bg-default-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{initiative.name}</p>
                                            {initiative.expectedOutcome && (
                                                <p className="text-xs text-default-400 truncate max-w-xs">
                                                    {initiative.expectedOutcome}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs ${relationType === "primary"
                                                        ? "bg-primary/20 text-primary"
                                                        : "bg-default-100 text-default-600"
                                                    }`}
                                            >
                                                {relationType === "primary" ? "Primaria" : "Secundaria"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium">{(weight * 100).toFixed(0)}%</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusChip status={initiative.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <PriorityChip priority={initiative.priority} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm">{initiativeOwner?.fullName || "-"}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Button
                                                isIconOnly
                                                variant="ghost"
                                                size="sm"
                                                onPress={() => handleUnlink(initiative.initiativeKey)}
                                                isPending={isPending}
                                                aria-label="Desvincular"
                                            >
                                                <Unlink className="h-4 w-4 text-danger" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <LinkInitiativeModal
                isOpen={isLinkModalOpen}
                onClose={() => setIsLinkModalOpen(false)}
                objectiveId={objectiveId}
                linkedInitiativeIds={initiatives.map((i) => i.initiative.initiativeKey)}
            />
        </div>
    );
}
