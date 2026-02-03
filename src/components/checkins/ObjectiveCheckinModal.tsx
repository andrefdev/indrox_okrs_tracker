"use client";

import { useState } from "react";
import {
    Modal,
    Button,
    TextArea,
    Select,
    ListBox,
    ListBoxItem,
    Label,
    Slider,
} from "@heroui/react";
import { toast } from "sonner";
import { createGenericCheckIn } from "@/app/actions/checkins";
import type { Owner } from "@/db/schema/core";
import Image from "next/image";

interface ObjectiveCheckinModalProps {
    isOpen: boolean;
    onClose: () => void;
    objectiveId: string;
    owners: Owner[];
}

export function ObjectiveCheckinModal({
    isOpen,
    onClose,
    objectiveId,
    owners,
}: ObjectiveCheckinModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [confidence, setConfidence] = useState(50);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await createGenericCheckIn({
                entityType: "objective",
                entityId: objectiveId,
                ownerId: formData.get("ownerId") as string,
                checkinDate: new Date().toISOString().split("T")[0],
                status: formData.get("status") as any,
                confidence: confidence as number,
                progressNote: formData.get("progressNote") as string,
                blockers: formData.get("blockers") as string,
                nextActions: formData.get("nextActions") as string,
            });
            toast.success("Check-in registrado correctamente");
            onClose();
        } catch (error) {
            toast.error("Error al registrar check-in");
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
                                <Modal.Heading>Nuevo Check-in de Objetivo</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="space-y-4 p-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <Label>Estado</Label>
                                        <Select name="status" defaultSelectedKey="on_track" isRequired>
                                            <Select.Trigger><Select.Value /></Select.Trigger>
                                            <Select.Popover>
                                                <ListBox>
                                                    <ListBoxItem key="on_track" id="on_track" textValue="En buen camino">En buen camino</ListBoxItem>
                                                    <ListBoxItem key="at_risk" id="at_risk" textValue="En riesgo">En riesgo</ListBoxItem>
                                                    <ListBoxItem key="off_track" id="off_track" textValue="Fuera de curso">Fuera de curso</ListBoxItem>
                                                    <ListBoxItem key="completed" id="completed" textValue="Completado">Completado</ListBoxItem>
                                                </ListBox>
                                            </Select.Popover>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label>Responsable</Label>
                                        <Select name="ownerId" placeholder="Seleccionar" isRequired>
                                            <Select.Trigger><Select.Value /></Select.Trigger>
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
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Confianza ({confidence}%)</Label>
                                    <Slider
                                        step={5}
                                        maxValue={100}
                                        minValue={0}
                                        value={confidence}
                                        onChange={(val) => setConfidence(val as number)}
                                        className="max-w-md"
                                    />
                                    <div className="flex justify-between text-xs text-default-400 px-1">
                                        <span>Baja</span>
                                        <span>Alta</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label>Progreso / Nota</Label>
                                    <TextArea
                                        name="progressNote"
                                        placeholder="¿Qué avances se han logrado?"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label>Bloqueadores</Label>
                                    <TextArea
                                        name="blockers"
                                        placeholder="¿Qué está impidiendo el avance?"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label>Siguientes Pasos</Label>
                                    <TextArea
                                        name="nextActions"
                                        placeholder="Acciones para la próxima semana..."
                                    />
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="ghost" onPress={onClose}>Cancelar</Button>
                                <Button className="bg-primary text-primary-foreground" type="submit" isPending={isLoading}>Guardar</Button>
                            </Modal.Footer>
                        </form>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
