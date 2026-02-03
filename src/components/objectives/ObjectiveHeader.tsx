"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Slider } from "@heroui/react";
import { Edit, Plus, CheckCircle } from "lucide-react";
import { StatusChip, PriorityChip } from "@/components/ui";
import { ObjectiveModal } from "./ObjectiveModal";
import { updateObjectiveConfidence } from "@/app/actions/objectives";
import type { OkrCycle } from "@/db/schema/okr";
import { toast } from "sonner";

interface ObjectiveHeaderProps {
    objective: {
        objective: any;
        owner: any;
        area: any;
        cycle: any;
    };
    cycles: OkrCycle[];
}

export function ObjectiveHeader({ objective, cycles }: ObjectiveHeaderProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [confidence, setConfidence] = useState(objective.objective.confidence || 50);

    const handleConfidenceChange = (value: number) => {
        setConfidence(value);
    };

    const handleConfidenceSave = () => {
        startTransition(async () => {
            try {
                await updateObjectiveConfidence(objective.objective.objectiveKey, confidence);
                toast.success("Confianza actualizada");
                router.refresh();
            } catch (error) {
                toast.error("Error al actualizar confianza");
            }
        });
    };

    return (
        <>
            <Card className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    {/* Left: Status, Owner, Area */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusChip status={objective.objective.status} size="md" />
                            <PriorityChip priority={objective.objective.priority} size="md" />
                            <span className="rounded-lg bg-default-100 px-2 py-1 text-sm capitalize">
                                {objective.objective.objectiveType}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                                <span className="text-default-400">Owner: </span>
                                <span className="font-medium">
                                    {objective.owner?.fullName || "Sin asignar"}
                                </span>
                            </div>
                            <div>
                                <span className="text-default-400">Área: </span>
                                <span className="font-medium">
                                    {objective.area?.name || "Sin área"}
                                </span>
                            </div>
                            <div>
                                <span className="text-default-400">Ciclo: </span>
                                <span className="font-medium">
                                    {objective.cycle?.name || "-"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Confidence & Actions */}
                    <div className="flex flex-col items-end gap-4">
                        {/* Confidence Slider */}
                        <div className="w-48">
                            <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="text-default-400">Confianza</span>
                                <span
                                    className={`font-medium ${confidence >= 70
                                            ? "text-success"
                                            : confidence >= 40
                                                ? "text-warning"
                                                : "text-danger"
                                        }`}
                                >
                                    {confidence}%
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Slider
                                    value={confidence}
                                    onChange={(val) => handleConfidenceChange(val as number)}
                                    minValue={0}
                                    maxValue={100}
                                    step={5}
                                    className="flex-1"
                                    aria-label="Confianza"
                                />
                                {confidence !== objective.objective.confidence && (
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        onPress={handleConfidenceSave}
                                        isPending={isPending}
                                        aria-label="Guardar confianza"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button variant="outline" onPress={() => setIsEditModalOpen(true)}>
                                <Edit className="h-4 w-4" />
                                Editar
                            </Button>
                            <Button>
                                <Plus className="h-4 w-4" />
                                Nuevo Check-in
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <ObjectiveModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                objective={objective.objective}
                cycles={cycles}
            />
        </>
    );
}
