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
import { createDependency, updateDependency } from "@/app/actions/dependencies";
import type { Dependency, NewDependency } from "@/db/schema/okr-related";
import type { Initiative, Objective } from "@/db/schema/okr";

interface DependencyModalProps {
    isOpen: boolean;
    onClose: () => void;
    dependency: Dependency | null;
    initiatives: Initiative[];
    objectives: Objective[];
    defaultFromType?: "initiative" | "objective";
    defaultFromId?: string;
}

export function DependencyModal({
    isOpen,
    onClose,
    dependency,
    initiatives,
    objectives,
    defaultFromType = "initiative",
    defaultFromId
}: DependencyModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Simple state to control select options. Real world would be dynamic.
    const [fromType, setFromType] = useState<string>(dependency?.fromType || defaultFromType);
    const [toType, setToType] = useState<string>(dependency?.toType || "initiative");
    const [toEntities, setToEntities] = useState<any[]>(initiatives);
    const [fromEntities, setFromEntities] = useState<any[]>(defaultFromType === "initiative" ? initiatives : objectives);

    useEffect(() => {
        if (fromType === "initiative") setFromEntities(initiatives);
        else setFromEntities(objectives);
    }, [fromType, initiatives, objectives]);

    useEffect(() => {
        if (toType === "initiative") setToEntities(initiatives);
        else setToEntities(objectives);
    }, [toType, initiatives, objectives]);

    const getEntityName = (e: any) => e.title || e.name;
    const getEntityId = (e: any) => e.objectiveKey || e.initiativeKey;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const data: Partial<NewDependency> = {
            fromType: "initiative", // Hardcoded for simplicity in this version, should be dynamic from state but Select doesn't pass value if not controlled properly
            fromId: formData.get("fromId") as string,
            toType: "initiative", // same
            toId: formData.get("toId") as string,
            dependencyType: formData.get("dependencyType") as any,
            notes: formData.get("notes") as string,
        };

        // Fix logic to actually use the state values if formData is tricky with Select
        data.fromType = fromType as any;
        data.toType = toType as any;

        try {
            if (dependency) {
                await updateDependency(dependency.dependencyKey, data);
                toast.success("Dependencia actualizada");
            } else {
                await createDependency(data as NewDependency);
                toast.success("Dependencia creada");
            }
            onClose();
        } catch (error) {
            toast.error("Error al guardar");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Reset logic if needed
            if (dependency) {
                setFromType(dependency.fromType);
                setToType(dependency.toType);
            } else {
                setFromType(defaultFromType);
                setToType("initiative");
            }
        }
    }, [isOpen, dependency, defaultFromType]);

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <form onSubmit={handleSubmit}>
                            <Modal.Header>
                                <Modal.Heading>
                                    {dependency ? "Editar Dependencia" : "Nueva Dependencia"}
                                </Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="space-y-4 p-1">
                                <div className="flex flex-col gap-1">
                                    <Label>Tipo de Relación</Label>
                                    <Select
                                        name="dependencyType"
                                        defaultSelectedKey={dependency?.dependencyType || "blocks"}
                                        isRequired
                                    >
                                        <Select.Trigger>
                                            <Select.Value />
                                        </Select.Trigger>
                                        <Select.Popover>
                                            <ListBox>
                                                <ListBoxItem key="blocks" id="blocks" textValue="Bloquea a">Bloquea a (Origen impide avance de Destino)</ListBoxItem>
                                                <ListBoxItem key="blocked_by" id="blocked_by" textValue="Bloqueado por">Bloqueado por (Origen depende de Destino)</ListBoxItem>
                                                <ListBoxItem key="relates_to" id="relates_to" textValue="Relacionado con">Relacionado con</ListBoxItem>
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 border p-3 rounded-lg border-default-200">
                                        <p className="text-small font-bold text-default-500">ORIGEN</p>
                                        <div className="space-y-1">
                                            <Label>Tipo Entidad</Label>
                                            <Select
                                                name="fromType_selector" // helper select
                                                selectedKey={fromType}
                                                onSelectionChange={(k) => setFromType(String(k))}
                                                className="mb-2"
                                            >
                                                <Select.Trigger>
                                                    <Select.Value />
                                                </Select.Trigger>
                                                <Select.Popover>
                                                    <ListBox>
                                                        <ListBoxItem key="initiative" id="initiative" textValue="Iniciativa">Iniciativa</ListBoxItem>
                                                        <ListBoxItem key="objective" id="objective" textValue="Objetivo">Objetivo</ListBoxItem>
                                                    </ListBox>
                                                </Select.Popover>
                                            </Select>
                                        </div>

                                        <div className="space-y-1">
                                            <Label>Seleccionar Entidad</Label>
                                            <Select
                                                name="fromId"
                                                defaultSelectedKey={dependency?.fromId || defaultFromId || undefined}
                                                isRequired
                                            >
                                                <Select.Trigger>
                                                    <Select.Value />
                                                </Select.Trigger>
                                                <Select.Popover>
                                                    <ListBox>
                                                        {fromEntities.map((e) => (
                                                            <ListBoxItem key={getEntityId(e)} id={getEntityId(e)} textValue={getEntityName(e)}>
                                                                {getEntityName(e)}
                                                            </ListBoxItem>
                                                        ))}
                                                    </ListBox>
                                                </Select.Popover>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2 border p-3 rounded-lg border-default-200">
                                        <p className="text-small font-bold text-default-500">DESTINO</p>
                                        <div className="space-y-1">
                                            <Label>Tipo Entidad</Label>
                                            <Select
                                                name="toType_selector" // helper select
                                                selectedKey={toType}
                                                onSelectionChange={(k) => setToType(String(k))}
                                                className="mb-2"
                                            >
                                                <Select.Trigger>
                                                    <Select.Value />
                                                </Select.Trigger>
                                                <Select.Popover>
                                                    <ListBox>
                                                        <ListBoxItem key="initiative" id="initiative" textValue="Iniciativa">Iniciativa</ListBoxItem>
                                                        <ListBoxItem key="objective" id="objective" textValue="Objetivo">Objetivo</ListBoxItem>
                                                    </ListBox>
                                                </Select.Popover>
                                            </Select>
                                        </div>

                                        <div className="space-y-1">
                                            <Label>Seleccionar Entidad</Label>
                                            <Select
                                                name="toId"
                                                defaultSelectedKey={dependency?.toId || undefined}
                                                isRequired
                                            >
                                                <Select.Trigger>
                                                    <Select.Value />
                                                </Select.Trigger>
                                                <Select.Popover>
                                                    <ListBox>
                                                        {toEntities.map((e) => (
                                                            <ListBoxItem key={getEntityId(e)} id={getEntityId(e)} textValue={getEntityName(e)}>
                                                                {getEntityName(e)}
                                                            </ListBoxItem>
                                                        ))}
                                                    </ListBox>
                                                </Select.Popover>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label>Notas</Label>
                                    <TextArea
                                        name="notes"
                                        placeholder="Detalles adicionales sobre la dependencia..."
                                        defaultValue={dependency?.notes || ""}
                                    />
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
