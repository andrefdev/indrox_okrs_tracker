"use client";

import { useEffect, useState } from "react";
import {
    Modal,
    Button,
    Input,
    TextArea,
    Select,
    ListBox,
    ListBoxItem,
    Slider,
    Label,
} from "@heroui/react";
import { toast } from "sonner";
import { createRisk, updateRisk } from "@/app/actions/risks";
import type { Risk, NewRisk } from "@/db/schema/okr-related";
import type { Owner } from "@/db/schema/core";

interface RiskModalProps {
    isOpen: boolean;
    onClose: () => void;
    risk: Risk | null;
    owners: Owner[];
    entityType?: "objective" | "key_result" | "initiative" | "work_item";
    entityId?: string;
}

export function RiskModal({ isOpen, onClose, risk, owners, entityType = "initiative", entityId = "global" }: RiskModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [probability, setProbability] = useState(1);
    const [impact, setImpact] = useState(1);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const data: Partial<NewRisk> = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            mitigation: formData.get("mitigation") as string,
            ownerId: formData.get("ownerId") as string | null,
            status: formData.get("status") as any || "open",
            probability: probability,
            impact: impact,
            entityType: risk?.entityType || entityType,
            entityId: risk?.entityId || entityId,
        };

        try {
            if (risk) {
                await updateRisk(risk.riskKey, data);
                toast.success("Riesgo actualizado correctamente");
            } else {
                await createRisk(data as NewRisk);
                toast.success("Riesgo creado correctamente");
            }
            onClose();
        } catch (error) {
            toast.error("Error al guardar el riesgo");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (risk) {
                setProbability(risk.probability);
                setImpact(risk.impact);
            } else {
                setProbability(1);
                setImpact(1);
            }
        }
    }, [isOpen, risk]);

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <form onSubmit={handleSubmit}>
                            <Modal.Header>
                                <Modal.Heading>
                                    {risk ? "Editar Riesgo" : "Nuevo Riesgo"}
                                </Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="space-y-4 p-1">
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="title">Título del Riesgo</Label>
                                    <Input
                                        id="title"
                                        autoFocus
                                        name="title"
                                        placeholder="Ej: Retraso en aprobación de presupuesto"
                                        defaultValue={risk?.title}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="description">Descripción</Label>
                                    <TextArea
                                        id="description"
                                        name="description"
                                        placeholder="Detalles sobre el riesgo..."
                                        defaultValue={risk?.description || ""}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-small text-default-500">Probabilidad (1-5)</span>
                                        <Slider
                                            step={1}
                                            maxValue={5}
                                            minValue={1}
                                            defaultValue={1}
                                            value={probability}
                                            onChange={(val) => setProbability(val as number)}
                                            className="max-w-md"
                                        />
                                        <div className="flex justify-between text-xs text-default-400 px-1">
                                            <span>Baja</span>
                                            <span>Alta</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-small text-default-500">Impacto (1-5)</span>
                                        <Slider
                                            step={1}
                                            maxValue={5}
                                            minValue={1}
                                            defaultValue={1}
                                            value={impact}
                                            onChange={(val) => setImpact(val as number)}
                                            className="max-w-md"
                                        />
                                        <div className="flex justify-between text-xs text-default-400 px-1">
                                            <span>Bajo</span>
                                            <span>Crítico</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="mitigation">Plan de Mitigación</Label>
                                    <TextArea
                                        id="mitigation"
                                        name="mitigation"
                                        placeholder="Acciones para reducir o manejar el riesgo..."
                                        defaultValue={risk?.mitigation || ""}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <Label>Dueño del Riesgo</Label>
                                        <Select
                                            name="ownerId"
                                            placeholder="Seleccionar responsable"
                                            defaultSelectedKey={risk?.ownerId || undefined}
                                        >
                                            <Select.Trigger>
                                                <Select.Value />
                                            </Select.Trigger>
                                            <Select.Popover>
                                                <ListBox>
                                                    {owners.map((owner) => (
                                                        <ListBoxItem key={owner.ownerKey} id={owner.ownerKey} textValue={owner.fullName}>
                                                            {owner.fullName}
                                                        </ListBoxItem>
                                                    ))}
                                                </ListBox>
                                            </Select.Popover>
                                        </Select>
                                    </div>

                                    <div className="w-40 space-y-2">
                                        <Label>Estado</Label>
                                        <Select
                                            name="status"
                                            defaultSelectedKey={risk?.status || "open"}
                                        >
                                            <Select.Trigger>
                                                <Select.Value />
                                            </Select.Trigger>
                                            <Select.Popover>
                                                <ListBox>
                                                    <ListBoxItem key="open" id="open" textValue="Abierto">Abierto</ListBoxItem>
                                                    <ListBoxItem key="mitigating" id="mitigating" textValue="Mitigando">Mitigando</ListBoxItem>
                                                    <ListBoxItem key="mitigated" id="mitigated" textValue="Mitigado">Mitigado</ListBoxItem>
                                                    <ListBoxItem key="accepted" id="accepted" textValue="Aceptado">Aceptado</ListBoxItem>
                                                    <ListBoxItem key="closed" id="closed" textValue="Cerrado">Cerrado</ListBoxItem>
                                                </ListBox>
                                            </Select.Popover>
                                        </Select>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="ghost" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button className="bg-primary text-primary-foreground" type="submit" isPending={isLoading}>
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </form>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
