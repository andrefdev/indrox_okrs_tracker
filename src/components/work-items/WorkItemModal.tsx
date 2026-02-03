"use client";

import { useState, useEffect } from "react";
import {
    Modal,
    Button,
    Input,
    Select,
    ListBoxItem,
    TextArea,
} from "@heroui/react";
import { createWorkItem, updateWorkItem } from "@/app/actions/work-items";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WorkItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    workItem?: any; // If null, creating new
    initiatives: any[];
    owners: any[];
    currentOwnerId?: string; // Pre-select current user if creating
}

export function WorkItemModal({
    isOpen,
    onClose,
    workItem,
    initiatives,
    owners,
    currentOwnerId,
}: WorkItemModalProps) {
    const router = useRouter();
    const isEditing = !!workItem;

    // Form states
    const [title, setTitle] = useState("");
    const [type, setType] = useState<string>("task");
    const [initiativeId, setInitiativeId] = useState<string>("");
    const [ownerId, setOwnerId] = useState<string>("");
    const [status, setStatus] = useState<string>("not_started");
    const [priority, setPriority] = useState<string>("medium");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [estimateHours, setEstimateHours] = useState("");
    const [actualHours, setActualHours] = useState("");
    const [linkToTool, setLinkToTool] = useState("");
    const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form when opening
    useEffect(() => {
        if (isOpen) {
            if (workItem) {
                setTitle(workItem.title);
                setType(workItem.type);
                setInitiativeId(workItem.initiativeId);
                setOwnerId(workItem.ownerId || "");
                setStatus(workItem.status);
                setPriority(workItem.priority);
                // Format dates to YYYY-MM-DD for input type="date"
                setStartDate(workItem.startDate ? new Date(workItem.startDate).toISOString().split('T')[0] : "");
                setDueDate(workItem.dueDate ? new Date(workItem.dueDate).toISOString().split('T')[0] : "");
                setEstimateHours(workItem.estimateHours?.toString() || "");
                setActualHours(workItem.actualHours?.toString() || "");
                setLinkToTool(workItem.linkToTool || "");
                setAcceptanceCriteria(workItem.acceptanceCriteria || "");
            } else {
                // Reset for create
                setTitle("");
                setType("task");
                setInitiativeId(initiatives.length > 0 ? initiatives[0].initiativeKey : "");
                setOwnerId(currentOwnerId || "");
                setStatus("not_started");
                setPriority("medium");
                setStartDate("");
                setDueDate("");
                setEstimateHours("");
                setActualHours("");
                setLinkToTool("");
                setAcceptanceCriteria("");
            }
        }
    }, [isOpen, workItem, currentOwnerId, initiatives]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!initiativeId) {
            toast.error("Selecciona una iniciativa");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = {
                title,
                type: type as any,
                initiativeId,
                ownerId: ownerId || undefined,
                status: status as any,
                priority: priority as any,
                startDate: startDate || null,
                dueDate: dueDate || null,
                estimateHours: estimateHours ? parseFloat(estimateHours) : null,
                actualHours: actualHours ? parseFloat(actualHours) : null,
                linkToTool: linkToTool || null,
                acceptanceCriteria: acceptanceCriteria || null,
            };

            if (isEditing) {
                await updateWorkItem(workItem.workitemKey, data);
                toast.success("Work item actualizado");
            } else {
                await createWorkItem(data);
                toast.success("Work item creado");
            }

            router.refresh();
            onClose();
        } catch (error) {
            toast.error(isEditing ? "Error al actualizar" : "Error al crear");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Heading>{isEditing ? "Editar Work Item" : "Nuevo Work Item"}</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <form id="work-item-form" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-sm font-medium">Título</label>
                                        <Input
                                            placeholder="Ej: Implementar login"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Tipo</label>
                                        <Select
                                            selectedKey={type}
                                            onSelectionChange={(k) => setType(String(k))}
                                        >
                                            <Select.Trigger />
                                            <Select.Popover>
                                                <ListBoxItem key="task" id="task">Tarea</ListBoxItem>
                                                <ListBoxItem key="bug" id="bug">Bug</ListBoxItem>
                                                <ListBoxItem key="feature" id="feature">Feature</ListBoxItem>
                                                <ListBoxItem key="spike" id="spike">Spike</ListBoxItem>
                                                <ListBoxItem key="other" id="other">Otro</ListBoxItem>
                                            </Select.Popover>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Iniciativa</label>
                                        <Select
                                            selectedKey={initiativeId}
                                            onSelectionChange={(k) => setInitiativeId(String(k))}
                                            isRequired
                                        >
                                            <Select.Trigger />
                                            <Select.Popover>
                                                {initiatives.map((init) => (
                                                    <ListBoxItem key={init.initiativeKey} id={init.initiativeKey} textValue={init.name}>
                                                        {init.name}
                                                    </ListBoxItem>
                                                ))}
                                            </Select.Popover>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Asignado a</label>
                                        <Select
                                            selectedKey={ownerId}
                                            onSelectionChange={(k) => setOwnerId(String(k))}
                                        >
                                            <Select.Trigger />
                                            <Select.Popover>
                                                {owners.map((owner) => (
                                                    <ListBoxItem key={owner.ownerKey} id={owner.ownerKey} textValue={owner.fullName}>
                                                        {owner.fullName}
                                                    </ListBoxItem>
                                                ))}
                                            </Select.Popover>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Estado</label>
                                        <Select
                                            selectedKey={status}
                                            onSelectionChange={(k) => setStatus(String(k))}
                                        >
                                            <Select.Trigger />
                                            <Select.Popover>
                                                <ListBoxItem key="not_started" id="not_started">Sin iniciar</ListBoxItem>
                                                <ListBoxItem key="on_track" id="on_track">On Track</ListBoxItem>
                                                <ListBoxItem key="at_risk" id="at_risk">En Riesgo</ListBoxItem>
                                                <ListBoxItem key="off_track" id="off_track">Off Track</ListBoxItem>
                                                <ListBoxItem key="completed" id="completed">Completado</ListBoxItem>
                                                <ListBoxItem key="cancelled" id="cancelled">Cancelado</ListBoxItem>
                                            </Select.Popover>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Prioridad</label>
                                        <Select
                                            selectedKey={priority}
                                            onSelectionChange={(k) => setPriority(String(k))}
                                        >
                                            <Select.Trigger />
                                            <Select.Popover>
                                                <ListBoxItem key="low" id="low">Baja</ListBoxItem>
                                                <ListBoxItem key="medium" id="medium">Media</ListBoxItem>
                                                <ListBoxItem key="high" id="high">Alta</ListBoxItem>
                                                <ListBoxItem key="critical" id="critical">Crítica</ListBoxItem>
                                            </Select.Popover>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Fecha Inicio</label>
                                        <Input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            placeholder=" "
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Fecha Entrega</label>
                                        <Input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            placeholder=" "
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Estimado (horas)</label>
                                        <Input
                                            type="number"
                                            value={estimateHours}
                                            onChange={(e) => setEstimateHours(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Real (horas)</label>
                                        <Input
                                            type="number"
                                            value={actualHours}
                                            onChange={(e) => setActualHours(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-1">
                                        <label className="text-sm font-medium">Link a herramienta (Jira/Linear)</label>
                                        <Input
                                            value={linkToTool}
                                            onChange={(e) => setLinkToTool(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-1">
                                        <label className="text-sm font-medium">Criterios de Aceptación</label>
                                        <TextArea
                                            value={acceptanceCriteria}
                                            onChange={(e) => setAcceptanceCriteria(e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button type="submit" form="work-item-form" isDisabled={isSubmitting}>
                                {isSubmitting ? "Guardando..." : "Guardar"}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
