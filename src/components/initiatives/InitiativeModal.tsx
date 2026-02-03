"use client";

import { useState, useTransition, useEffect } from "react";
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
} from "@heroui/react";
import { createInitiative, updateInitiative } from "@/app/actions/initiatives";
import type { Initiative, OkrCycle } from "@/db/schema/okr";
import type { Owner, Area } from "@/db/schema/core";
import { toast } from "sonner";
import { format } from "date-fns";

interface InitiativeModalProps {
    isOpen: boolean;
    onClose: () => void;
    initiative?: Initiative | null;
    cycles: OkrCycle[];
    owners: Owner[];
    areas: Area[];
}

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

const effortImpactOptions = [
    { value: "low", label: "Bajo" },
    { value: "medium", label: "Medio" },
    { value: "high", label: "Alto" },
];

export function InitiativeModal({
    isOpen,
    onClose,
    initiative,
    cycles,
    owners,
    areas,
}: InitiativeModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const isEditing = !!initiative;

    // Form state
    const [name, setName] = useState("");
    const [cycleId, setCycleId] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [areaId, setAreaId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState<string>("not_started");
    const [priority, setPriority] = useState<string>("medium");
    const [effort, setEffort] = useState<string>("medium");
    const [impact, setImpact] = useState<string>("medium");
    const [problemStatement, setProblemStatement] = useState("");
    const [expectedOutcome, setExpectedOutcome] = useState("");

    const formatDateForInput = (dateStr: string | null) => {
        if (!dateStr) return "";
        return new Date(dateStr).toISOString().split('T')[0];
    };

    // Reset form
    useEffect(() => {
        if (initiative) {
            setName(initiative.name);
            setCycleId(initiative.cycleId);
            setOwnerId(initiative.ownerId);
            setAreaId(initiative.areaId || "");
            setStartDate(formatDateForInput(initiative.startDate));
            setDueDate(formatDateForInput(initiative.dueDate));
            setStatus(initiative.status);
            setPriority(initiative.priority);
            setEffort(initiative.effort || "medium");
            setImpact(initiative.impact || "medium");
            setProblemStatement(initiative.problemStatement || "");
            setExpectedOutcome(initiative.expectedOutcome || "");
        } else {
            setName("");
            setCycleId(cycles.find(c => c.status === 'active')?.cycleId || "");
            setOwnerId("");
            setAreaId("");
            setStartDate("");
            setDueDate("");
            setStatus("not_started");
            setPriority("medium");
            setEffort("medium");
            setImpact("medium");
            setProblemStatement("");
            setExpectedOutcome("");
        }
    }, [initiative, isOpen, cycles]);

    const handleSubmit = () => {
        if (!name.trim() || !cycleId || !ownerId) {
            toast.error("Por favor completa los campos obligatorios");
            return;
        }

        startTransition(async () => {
            try {
                const data = {
                    name,
                    cycleId,
                    ownerId,
                    areaId: areaId || null,
                    startDate: startDate || null,
                    dueDate: dueDate || null,
                    status: status as any,
                    priority: priority as any,
                    effort: effort as any,
                    impact: impact as any,
                    problemStatement: problemStatement || null,
                    expectedOutcome: expectedOutcome || null,
                };

                if (isEditing && initiative) {
                    await updateInitiative(initiative.initiativeKey, data);
                    toast.success("Iniciativa actualizada correctamente");
                } else {
                    await createInitiative(data);
                    toast.success("Iniciativa creada correctamente");
                }
                router.refresh();
                onClose();
            } catch (error) {
                toast.error("Error al guardar la iniciativa");
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
                                {isEditing ? "Editar Iniciativa" : "Nueva Iniciativa"}
                            </Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4 p-1">
                                <h3 className="text-lg font-semibold">Información Básica</h3>
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="name">Nombre *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Nombre de la iniciativa"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <Label>Ciclo *</Label>
                                        <Select
                                            placeholder="Seleccionar ciclo"
                                            selectedKey={cycleId}
                                            onSelectionChange={(key) => setCycleId(String(key))}
                                        >
                                            <Select.Trigger>
                                                <Select.Value />
                                            </Select.Trigger>
                                            <Select.Popover>
                                                <ListBox>
                                                    {cycles.map((c) => (
                                                        <ListBoxItem key={c.cycleId} id={c.cycleId}>
                                                            {c.name}
                                                        </ListBoxItem>
                                                    ))}
                                                </ListBox>
                                            </Select.Popover>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Label>Owner *</Label>
                                        <Select
                                            placeholder="Seleccionar owner"
                                            selectedKey={ownerId}
                                            onSelectionChange={(key) => setOwnerId(String(key))}
                                        >
                                            <Select.Trigger>
                                                <Select.Value />
                                            </Select.Trigger>
                                            <Select.Popover>
                                                <ListBox>
                                                    {owners.map((o) => (
                                                        <ListBoxItem key={o.ownerKey} id={o.ownerKey}>
                                                            {o.fullName}
                                                        </ListBoxItem>
                                                    ))}
                                                </ListBox>
                                            </Select.Popover>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Label>Área</Label>
                                        <Select
                                            placeholder="Seleccionar área"
                                            selectedKey={areaId}
                                            onSelectionChange={(key) => setAreaId(String(key))}
                                        >
                                            <Select.Trigger>
                                                <Select.Value />
                                            </Select.Trigger>
                                            <Select.Popover>
                                                <ListBox>
                                                    {areas.map((a) => (
                                                        <ListBoxItem key={a.areaKey} id={a.areaKey}>
                                                            {a.name}
                                                        </ListBoxItem>
                                                    ))}
                                                </ListBox>
                                            </Select.Popover>
                                        </Select>
                                    </div>

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
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-4 p-1">
                                <h3 className="text-lg font-semibold">Detalles y Fechas</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="startDate">Fecha Inicio</Label>
                                        <Input
                                            id="startDate"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="dueDate">Fecha Fin Estimada</Label>
                                        <Input
                                            id="dueDate"
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                        />
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

                                    <div className="flex flex-col gap-1">
                                        <Label>Esfuerzo</Label>
                                        <Select
                                            selectedKey={effort}
                                            onSelectionChange={(key) => setEffort(String(key))}
                                        >
                                            <Select.Trigger>
                                                <Select.Value />
                                            </Select.Trigger>
                                            <Select.Popover>
                                                <ListBox>
                                                    {effortImpactOptions.map((opt) => (
                                                        <ListBoxItem key={opt.value} id={opt.value}>
                                                            {opt.label}
                                                        </ListBoxItem>
                                                    ))}
                                                </ListBox>
                                            </Select.Popover>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Context */}
                            <div className="space-y-4 p-1">
                                <h3 className="text-lg font-semibold">Contexto</h3>
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="problem">Problema a Resolver</Label>
                                    <TextArea
                                        id="problem"
                                        placeholder="¿Qué problema intenta resolver esta iniciativa?"
                                        value={problemStatement}
                                        onChange={(e) => setProblemStatement(e.target.value)}
                                        rows={2}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="outcome">Resultado Esperado</Label>
                                    <TextArea
                                        id="outcome"
                                        placeholder="¿Qué esperamos lograr?"
                                        value={expectedOutcome}
                                        onChange={(e) => setExpectedOutcome(e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="ghost" onPress={onClose} isDisabled={isPending}>
                                Cancelar
                            </Button>
                            <Button onPress={handleSubmit} isPending={isPending}>
                                {isEditing ? "Guardar Cambios" : "Crear Iniciativa"}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
