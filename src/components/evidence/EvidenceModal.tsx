"use client";

import { useState } from "react";
import {
    Modal,
    Button,
    Input,
    Select,
    ListBox,
    ListBoxItem,
    Label,
} from "@heroui/react";
import { toast } from "sonner";
import { createEvidence } from "@/app/actions/evidence";
import type { Owner } from "@/db/schema/core";
import { getCurrentOwner } from "@/db/queries/owners"; // Note: this is server side, need to handle owner in submit or pass current owner

interface EvidenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    entityType: string;
    entityId: string;
    owners: Owner[];
}

export function EvidenceModal({
    isOpen,
    onClose,
    entityType,
    entityId,
    owners,
}: EvidenceModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await createEvidence({
                entityType: entityType as any,
                entityId: entityId,
                title: formData.get("title") as string,
                url: formData.get("url") as string || null,
                type: formData.get("type") as any,
                uploadedBy: formData.get("uploadedBy") as string,
            });
            toast.success("Evidencia adjuntada");
            onClose();
        } catch (error) {
            toast.error("Error al adjuntar evidencia");
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
                                <Modal.Heading>Adjuntar Evidencia</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="space-y-4 p-1">
                                <div className="flex flex-col gap-1">
                                    <Label>Título</Label>
                                    <Input
                                        autoFocus
                                        name="title"
                                        placeholder="Ej: Reporte Q1"
                                        required
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <Label>Tipo</Label>
                                        <Select name="type" defaultSelectedKey="link">
                                            <Select.Trigger><Select.Value /></Select.Trigger>
                                            <Select.Popover>
                                                <ListBox>
                                                    <ListBoxItem key="link" id="link" textValue="Enlace">Enlace</ListBoxItem>
                                                    <ListBoxItem key="document" id="document" textValue="Documento">Documento</ListBoxItem>
                                                    <ListBoxItem key="screenshot" id="screenshot" textValue="Captura">Captura</ListBoxItem>
                                                    <ListBoxItem key="video" id="video" textValue="Video">Video</ListBoxItem>
                                                    <ListBoxItem key="other" id="other" textValue="Otro">Otro</ListBoxItem>
                                                </ListBox>
                                            </Select.Popover>
                                        </Select>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Label>Subido por</Label>
                                        <Select name="uploadedBy" placeholder="Seleccionar" isRequired>
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

                                <div className="flex flex-col gap-1">
                                    <Label>URL</Label>
                                    <Input
                                        name="url"
                                        placeholder="https://..."
                                        required
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
