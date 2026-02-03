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
import { createBudgetItem, updateBudgetItem } from "@/app/actions/budget";
import type { BudgetItem, NewBudgetItem } from "@/db/schema/okr-related";
import type { Initiative } from "@/db/schema/okr";

interface BudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    budgetItem: BudgetItem | null;
    initiatives: Initiative[];
    defaultInitiativeId?: string;
}

export function BudgetModal({
    isOpen,
    onClose,
    budgetItem,
    initiatives,
    defaultInitiativeId
}: BudgetModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const data: Partial<NewBudgetItem> = {
            initiativeId: formData.get("initiativeId") as string,
            category: formData.get("category") as string,
            plannedAmount: parseFloat(formData.get("plannedAmount") as string),
            actualAmount: formData.get("actualAmount") ? parseFloat(formData.get("actualAmount") as string) : null,
            currency: formData.get("currency") as string,
            vendor: formData.get("vendor") as string,
            notes: formData.get("notes") as string,
            spendDate: formData.get("spendDate") as string || null,
        };

        try {
            if (budgetItem) {
                await updateBudgetItem(budgetItem.budgetKey, data);
                toast.success("Presupuesto actualizado");
            } else {
                await createBudgetItem(data as NewBudgetItem);
                toast.success("Presupuesto creado");
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
                                    {budgetItem ? "Editar Partida Presupuestaria" : "Nuevo Presupuesto"}
                                </Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="space-y-4 p-1">
                                <div className="flex flex-col gap-1">
                                    <Label>Iniciativa</Label>
                                    <Select
                                        name="initiativeId"
                                        placeholder="Seleccionar Iniciativa asociada"
                                        defaultSelectedKey={budgetItem?.initiativeId || defaultInitiativeId || undefined}
                                        isRequired
                                    >
                                        <Select.Trigger>
                                            <Select.Value />
                                        </Select.Trigger>
                                        <Select.Popover>
                                            <ListBox>
                                                {initiatives.map((i) => (
                                                    <ListBoxItem key={i.initiativeKey} id={i.initiativeKey} textValue={i.name}>
                                                        {i.name}
                                                    </ListBoxItem>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <Label>Categoría / Concepto</Label>
                                        <Input
                                            name="category"
                                            placeholder="Ej: Licencias, Hardware, Marketing"
                                            defaultValue={budgetItem?.category}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Label>Proveedor</Label>
                                        <Input
                                            name="vendor"
                                            placeholder="Ej: AWS, Google, etc."
                                            defaultValue={budgetItem?.vendor || ""}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <Label>Monto Planificado</Label>
                                        <Input
                                            type="number"
                                            name="plannedAmount"
                                            placeholder="0.00"
                                            defaultValue={budgetItem?.plannedAmount?.toString()}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Label>Monto Real (Gastado)</Label>
                                        <Input
                                            type="number"
                                            name="actualAmount"
                                            placeholder="0.00"
                                            defaultValue={budgetItem?.actualAmount?.toString()}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                    <div className="w-32 space-y-2">
                                        <Label>Moneda</Label>
                                        <Select
                                            name="currency"
                                            defaultSelectedKey={budgetItem?.currency || "USD"}
                                        >
                                            <Select.Trigger>
                                                <Select.Value />
                                            </Select.Trigger>
                                            <Select.Popover>
                                                <ListBox>
                                                    <ListBoxItem key="USD" id="USD">USD</ListBoxItem>
                                                    <ListBoxItem key="EUR" id="EUR">EUR</ListBoxItem>
                                                    <ListBoxItem key="MXN" id="MXN">MXN</ListBoxItem>
                                                </ListBox>
                                            </Select.Popover>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label>Fecha de Gasto (Estimada o Real)</Label>
                                    <Input
                                        type="date"
                                        name="spendDate"
                                        defaultValue={budgetItem?.spendDate ? new Date(budgetItem.spendDate).toISOString().split('T')[0] : ""}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label>Notas</Label>
                                    <TextArea
                                        name="notes"
                                        placeholder="Detalles adicionales..."
                                        defaultValue={budgetItem?.notes || ""}
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
