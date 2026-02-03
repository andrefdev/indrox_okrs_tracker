"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, Select, ListBoxItem, Slider, Label } from "@heroui/react";
import { linkInitiativeToObjective } from "@/app/actions/initiatives";
import { toast } from "sonner";

interface LinkInitiativeModalProps {
    isOpen: boolean;
    onClose: () => void;
    objectiveId: string;
    linkedInitiativeIds: string[];
}

export function LinkInitiativeModal({
    isOpen,
    onClose,
    objectiveId,
    linkedInitiativeIds,
}: LinkInitiativeModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [initiatives, setInitiatives] = useState<any[]>([]);
    const [selectedInitiativeId, setSelectedInitiativeId] = useState("");
    const [relationType, setRelationType] = useState<"primary" | "secondary">(
        "primary"
    );
    const [weight, setWeight] = useState(100);

    // Fetch available initiatives
    useEffect(() => {
        if (isOpen) {
            // TODO: Fetch from API
            // For now, this would need a separate query
            setInitiatives([]);
        }
    }, [isOpen]);

    const availableInitiatives = initiatives.filter(
        (i) => !linkedInitiativeIds.includes(i.initiativeKey)
    );

    const handleSubmit = () => {
        if (!selectedInitiativeId) {
            toast.error("Selecciona una iniciativa");
            return;
        }

        startTransition(async () => {
            try {
                await linkInitiativeToObjective(
                    selectedInitiativeId,
                    objectiveId,
                    relationType,
                    weight / 100
                );
                toast.success("Iniciativa vinculada");
                router.refresh();
                onClose();
                setSelectedInitiativeId("");
                setRelationType("primary");
                setWeight(100);
            } catch (error) {
                toast.error("Error al vincular");
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Modal.Backdrop />
            <Modal.Container size="md">
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Heading>Vincular Iniciativa</Modal.Heading>
                    </Modal.Header>

                    <Modal.Body className="space-y-4">
                        <div className="space-y-2">
                            <Label>Iniciativa</Label>
                            <Select
                                selectedKey={selectedInitiativeId}
                                onSelectionChange={(key) =>
                                    setSelectedInitiativeId(String(key))
                                }
                            >
                                <Select.Trigger />
                                <Select.Popover>
                                    {availableInitiatives.length === 0 ? (
                                        <ListBoxItem key="empty" id="empty" isDisabled>
                                            No hay iniciativas disponibles
                                        </ListBoxItem>
                                    ) : (
                                        availableInitiatives.map((i) => (
                                            <ListBoxItem key={i.initiativeKey} id={i.initiativeKey}>
                                                {i.name}
                                            </ListBoxItem>
                                        ))
                                    )}
                                </Select.Popover>
                            </Select>
                            <p className="text-xs text-default-400">
                                Nota: Primero crea iniciativas desde /initiatives para poder
                                vincularlas.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Tipo de relación</Label>
                            <Select
                                selectedKey={relationType}
                                onSelectionChange={(key) =>
                                    setRelationType(key as "primary" | "secondary")
                                }
                            >
                                <Select.Trigger />
                                <Select.Popover>
                                    <ListBoxItem key="primary" id="primary">
                                        Primaria (contribuye directamente)
                                    </ListBoxItem>
                                    <ListBoxItem key="secondary" id="secondary">
                                        Secundaria (contribuye indirectamente)
                                    </ListBoxItem>
                                </Select.Popover>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Peso de contribución</Label>
                                <span className="text-sm font-medium">{weight}%</span>
                            </div>
                            <Slider
                                value={weight}
                                onChange={(val) => setWeight(val as number)}
                                minValue={0}
                                maxValue={100}
                                step={10}
                                aria-label="Peso"
                            />
                            <p className="text-xs text-default-400">
                                Define qué porcentaje del objetivo depende de esta iniciativa.
                            </p>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="ghost" onPress={onClose} isDisabled={isPending}>
                            Cancelar
                        </Button>
                        <Button onPress={handleSubmit} isPending={isPending}>
                            Vincular
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal>
    );
}
