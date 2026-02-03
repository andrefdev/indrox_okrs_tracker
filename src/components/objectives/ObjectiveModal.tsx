"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Modal,
    Button,
    Input,
    TextArea,
    Select,
    ListBox,
    ListBoxItem,
    Label,
    Slider,
} from "@heroui/react";
import { createObjective, updateObjective } from "@/app/actions/objectives";
import type { Objective, OkrCycle } from "@/db/schema/okr";
import { toast } from "sonner";

interface ObjectiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    objective?: Objective | null;
    cycles: OkrCycle[];
}

const objectiveTypes = [
    { value: "strategic", label: "Estratégico" },
    { value: "tactical", label: "Táctico" },
    { value: "operational", label: "Operacional" },
];

const statusOptions = [
    { value: "not_started", label: "Sin iniciar" },
    { value: "on_track", label: "On Track" },
    { value: "at_risk", label: "En Riesgo" },
    { value: "off_track", label: "Off Track" },
    { value: "completed", label: "Completado" },
    { value: "cancelled", label: "Cancelado" },
];

const priorityOptions = [
    { value: "low", label: "Baja" },
    { value: "medium", label: "Media" },
    { value: "high", label: "Alta" },
    { value: "critical", label: "Crítica" },
];

export function ObjectiveModal({
    isOpen,
    onClose,
    objective,
    cycles,
}: ObjectiveModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const isEditing = !!objective;

    // Form state
    const [title, setTitle] = useState(objective?.title || "");
    const [description, setDescription] = useState(objective?.description || "");
    const [cycleId, setCycleId] = useState(objective?.cycleId || "");
    const [objectiveType, setObjectiveType] = useState<string>(
        objective?.objectiveType || "tactical"
    );
    const [priority, setPriority] = useState<string>(objective?.priority || "medium");
    const [status, setStatus] = useState<string>(objective?.status || "not_started");
    const [confidence, setConfidence] = useState(objective?.confidence || 50);

    // Reset form when objective changes
    useState(() => {
        if (objective) {
            setTitle(objective.title);
            setDescription(objective.description || "");
            setCycleId(objective.cycleId);
            setObjectiveType(objective.objectiveType);
            setPriority(objective.priority);
            setStatus(objective.status);
            setConfidence(objective.confidence || 50);
        } else {
            setTitle("");
            setDescription("");
            setCycleId("");
            setObjectiveType("tactical");
            setPriority("medium");
            setStatus("not_started");
            setConfidence(50);
        }
    });

    const handleSubmit = () => {
        if (!title.trim() || !cycleId) {
            toast.error("Por favor completa los campos obligatorios");
            return;
        }

        startTransition(async () => {
            try {
                if (isEditing && objective) {
                    await updateObjective(objective.objectiveKey, {
                        title,
                        description: description || null,
                        cycleId,
                        objectiveType: objectiveType as any,
                        priority: priority as any,
                        status: status as any,
                        confidence,
                    });
                    toast.success("Objetivo actualizado correctamente");
                } else {
                    // For now, use a placeholder ownerId - in real app, get from auth context
                    await createObjective({
                        title,
                        description: description || null,
                        cycleId,
                        objectiveType: objectiveType as any,
                        priority: priority as any,
                        status: status as any,
                        confidence,
                        ownerId: "00000000-0000-0000-0000-000000000000", // Placeholder
                    });
                    toast.success("Objetivo creado correctamente");
                }
                router.refresh();
                onClose();
            } catch (error) {
                toast.error("Error al guardar el objetivo");
                console.error(error);
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Heading>
                                {isEditing ? "Editar Objetivo" : "Nuevo Objetivo"}
                            </Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="space-y-4 p-1">
                            {/* Title */}
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="title">Título *</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Incrementar MRR en 30%"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="description">Descripción</Label>
                                <TextArea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Descripción detallada del objetivo..."
                                    rows={3}
                                />
                            </div>

                            {/* Cycle */}
                            <div className="flex flex-col gap-1">
                                <Label>Ciclo *</Label>
                                <Select
                                    selectedKey={cycleId}
                                    onSelectionChange={(key) => setCycleId(String(key))}
                                >
                                    <Select.Trigger>
                                        <Select.Value />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox>
                                            {cycles.map((cycle) => (
                                                <ListBoxItem key={cycle.cycleId} id={cycle.cycleId}>
                                                    {cycle.name}
                                                </ListBoxItem>
                                            ))}
                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                            </div>

                            {/* Type & Priority */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <Label>Tipo</Label>
                                    <Select
                                        selectedKey={objectiveType}
                                        onSelectionChange={(key) => setObjectiveType(String(key))}
                                    >
                                        <Select.Trigger>
                                            <Select.Value />
                                        </Select.Trigger>
                                        <Select.Popover>
                                            <ListBox>
                                                {objectiveTypes.map((opt) => (
                                                    <ListBoxItem key={opt.value} id={opt.value}>
                                                        {opt.label}
                                                    </ListBoxItem>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label>Prioridad</Label>
                                    <Select
                                        selectedKey={priority}
                                        onSelectionChange={(key) => setPriority(String(key))}
                                    >
                                        <Select.Trigger>
                                            <Select.Value />
                                        </Select.Trigger>
                                        <Select.Popover>
                                            <ListBox>
                                                {priorityOptions.map((opt) => (
                                                    <ListBoxItem key={opt.value} id={opt.value}>
                                                        {opt.label}
                                                    </ListBoxItem>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex flex-col gap-1">
                                <Label>Estado</Label>
                                <Select
                                    selectedKey={status}
                                    onSelectionChange={(key) => setStatus(String(key))}
                                >
                                    <Select.Trigger>
                                        <Select.Value />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox>
                                            {statusOptions.map((opt) => (
                                                <ListBoxItem key={opt.value} id={opt.value}>
                                                    {opt.label}
                                                </ListBoxItem>
                                            ))}
                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                            </div>

                            {/* Confidence */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <Label>Confianza</Label>
                                    <span className="text-sm font-medium">{confidence}%</span>
                                </div>
                                <Slider
                                    value={confidence}
                                    onChange={(val) => setConfidence(val as number)}
                                    minValue={0}
                                    maxValue={100}
                                    step={5}
                                    aria-label="Confianza"
                                />
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="ghost" onPress={onClose} isDisabled={isPending}>
                                Cancelar
                            </Button>
                            <Button onPress={handleSubmit} isPending={isPending}>
                                {isEditing ? "Guardar Cambios" : "Crear Objetivo"}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
