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
    Label,
} from "@heroui/react";
import { toast } from "sonner";
import { createDecision, updateDecision } from "@/app/actions/decisions";
import type { DecisionLog, NewDecisionLog } from "@/db/schema/okr-related";
import type { Owner } from "@/db/schema/core";

interface DecisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    decision: DecisionLog | null;
    owners: Owner[];
}

export function DecisionModal({
    isOpen,
    onClose,
    decision,
    owners
}: DecisionModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const data: Partial<NewDecisionLog> = {
            title: formData.get("title") as string,
            decision: formData.get("decision") as string,
            context: formData.get("context") as string,
            decisionDate: formData.get("decisionDate") as string,
            ownerId: formData.get("ownerId") as string | null,
            evidenceUrl: formData.get("evidenceUrl") as string,
        };

        try {
            if (decision) {
                await updateDecision(decision.decisionKey, data);
                toast.success("Decisión actualizada");
            } else {
                await createDecision(data as NewDecisionLog);
                toast.success("Decisión registrada");
            }
            onClose();
        } catch (error) {
            toast.error("Error al guardar");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <form onSubmit={handleSubmit}>
                            <Modal.Header>
                                <Modal.Heading>
                                    {decision ? "Editar Decisión" : "Registrar Decisión"}
                                </Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="space-y-4 p-1">
                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <Label>Título</Label>
                                        <Input
                                            autoFocus
                                            name="title"
                                            placeholder="Ej: Cambio de proveedor de nube"
                                            defaultValue={decision?.title}
                                            required
                                        />
                                    </div>
                                    <div className="w-40 space-y-2">
                                        <Label>Fecha de Decisión</Label>
                                        <Input
                                            type="date"
                                            name="decisionDate"
                                            defaultValue={decision?.decisionDate ? new Date(decision.decisionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label>Decisión Tomada</Label>
                                    <TextArea
                                        name="decision"
                                        placeholder="¿Qué se decidió exactamente?"
                                        defaultValue={decision?.decision}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label>Contexto / Razón</Label>
                                    <TextArea
                                        name="context"
                                        placeholder="¿Por qué se tomó esta decisión? Alternativas consideradas..."
                                        defaultValue={decision?.context || ""}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <Label>Responsable</Label>
                                        <Select
                                            name="ownerId"
                                            placeholder="Quién tomó la decisión"
                                            defaultSelectedKey={decision?.ownerId || undefined}
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

                                    <div className="flex-1 space-y-2">
                                        <Label>URL de Evidencia / Doc</Label>
                                        <Input
                                            name="evidenceUrl"
                                            placeholder="https://..."
                                            defaultValue={decision?.evidenceUrl || ""}
                                        />
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
