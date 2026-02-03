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
import { createCycle, updateCycle } from "@/app/actions/cycles";
import type { OkrCycle } from "@/db/schema/okr";
import { toast } from "sonner";
import { cycleStatusEnum } from "@/db/schema/okr";

interface CycleModalProps {
    isOpen: boolean;
    onClose: () => void;
    cycle?: OkrCycle | null;
}

const statusOptions = [
    { value: "draft", label: "Borrador" },
    { value: "active", label: "Activo" },
    { value: "completed", label: "Completado" },
    { value: "archived", label: "Archivado" },
];

export function CycleModal({ isOpen, onClose, cycle }: CycleModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const isEditing = !!cycle;

    // Form state
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState<string>("draft");
    const [notes, setNotes] = useState("");

    // Reset form when cycle changes or modal opens
    useEffect(() => {
        if (cycle) {
            setName(cycle.name);
            // Ensure dates are formatted as YYYY-MM-DD for input type="date"
            setStartDate(formatDateForInput(cycle.startDate));
            setEndDate(formatDateForInput(cycle.endDate));
            setStatus(cycle.status);
            setNotes(cycle.notes || "");
        } else {
            setName("");
            setStartDate("");
            setEndDate("");
            setStatus("draft");
            setNotes("");
        }
    }, [cycle, isOpen]);

    const formatDateForInput = (dateStr: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toISOString().split('T')[0];
    };

    const handleClose = () => {
        onClose();
        // Delay reset slightly to avoid UI flicker during close animation
        setTimeout(() => {
            if (!cycle) {
                setName("");
                setStartDate("");
                setEndDate("");
                setStatus("draft");
                setNotes("");
            }
        });
    };

    const handleSubmit = () => {
        if (!name.trim() || !startDate || !endDate) {
            toast.error("Por favor completa los campos obligatorios");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error("La fecha de inicio debe ser anterior a la fecha de fin");
            return;
        }

        startTransition(async () => {
            try {
                if (isEditing && cycle) {
                    await updateCycle(cycle.cycleId, {
                        name,
                        startDate,
                        endDate,
                        status: status as any,
                        notes: notes || null,
                    });
                    toast.success("Ciclo actualizado correctamente");
                } else {
                    await createCycle({
                        name,
                        startDate,
                        endDate,
                        status: status as any,
                        notes: notes || null,
                    });
                    toast.success("Ciclo creado correctamente");
                }
                router.refresh();
                handleClose();
            } catch (error) {
                toast.error("Error al guardar el ciclo");
                console.error(error);
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={handleClose}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Heading>
                                {isEditing ? "Editar Ciclo" : "Nuevo Ciclo"}
                            </Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="space-y-4 p-1">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="name">Nombre *</Label>
                                <Input
                                    id="name"
                                    placeholder="ej. Q1 2026"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="startDate">Fecha Inicio *</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        placeholder="Seleccionar fecha"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="endDate">Fecha Fin *</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        placeholder="Seleccionar fecha"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label>Estado</Label>
                                <Select
                                    selectedKey={status}
                                    onSelectionChange={(key) => setStatus(String(key))}
                                    className="w-full"
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

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="notes">Notas</Label>
                                <TextArea
                                    id="notes"
                                    placeholder="Notas adicionales sobre este ciclo..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="w-full"
                                />
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="ghost" onPress={handleClose} isDisabled={isPending}>
                                Cancelar
                            </Button>
                            <Button onPress={handleSubmit} isPending={isPending}>
                                {isEditing ? "Guardar Cambios" : "Crear Ciclo"}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
