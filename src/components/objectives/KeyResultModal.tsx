"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Modal,
    Button,
    Input,
    Select,
    ListBox,
    ListBoxItem,
    Label,
    Slider,
} from "@heroui/react";
import { createKeyResult, updateKeyResult } from "@/app/actions/key-results";
import { toast } from "sonner";

interface KeyResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    objectiveId: string;
    keyResult?: any;
}

const statusOptions = [
    { value: "not_started", label: "Sin iniciar" },
    { value: "on_track", label: "On Track" },
    { value: "at_risk", label: "En Riesgo" },
    { value: "off_track", label: "Off Track" },
    { value: "completed", label: "Completado" },
];

const scoringMethods = [
    { value: "percentage", label: "Porcentaje" },
    { value: "binary", label: "Binario (Sí/No)" },
    { value: "milestone", label: "Hitos" },
];

export function KeyResultModal({
    isOpen,
    onClose,
    objectiveId,
    keyResult,
}: KeyResultModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const isEditing = !!keyResult;

    const [title, setTitle] = useState(keyResult?.title || "");
    const [metricName, setMetricName] = useState(keyResult?.metricName || "");
    const [baselineValue, setBaselineValue] = useState(
        keyResult?.baselineValue || "0"
    );
    const [targetValue, setTargetValue] = useState(keyResult?.targetValue || "");
    const [currentValue, setCurrentValue] = useState(
        keyResult?.currentValue || ""
    );
    const [unit, setUnit] = useState(keyResult?.unit || "");
    const [scoringMethod, setScoringMethod] = useState(
        keyResult?.scoringMethod || "percentage"
    );
    const [status, setStatus] = useState(keyResult?.status || "not_started");
    const [confidence, setConfidence] = useState(keyResult?.confidence || 50);

    const handleSubmit = () => {
        if (!title.trim() || !targetValue) {
            toast.error("Completa título y valor objetivo");
            return;
        }

        startTransition(async () => {
            try {
                if (isEditing) {
                    await updateKeyResult(keyResult.krKey, {
                        title,
                        metricName: metricName || null,
                        baselineValue: baselineValue || null,
                        targetValue,
                        currentValue: currentValue || null,
                        unit: unit || null,
                        scoringMethod: scoringMethod as any,
                        status: status as any,
                        confidence,
                    });
                    toast.success("Key Result actualizado");
                } else {
                    await createKeyResult({
                        objectiveId,
                        title,
                        metricName: metricName || null,
                        baselineValue: baselineValue || null,
                        targetValue,
                        currentValue: currentValue || null,
                        unit: unit || null,
                        scoringMethod: scoringMethod as any,
                        status: status as any,
                        confidence,
                    });
                    toast.success("Key Result creado");
                }
                router.refresh();
                onClose();
            } catch (error) {
                toast.error("Error al guardar");
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
                                {isEditing ? "Editar Key Result" : "Nuevo Key Result"}
                            </Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="kr-title">Título *</Label>
                                <Input
                                    id="kr-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Incrementar tasa de conversión"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="metric-name">Nombre de métrica</Label>
                                <Input
                                    id="metric-name"
                                    value={metricName}
                                    onChange={(e) => setMetricName(e.target.value)}
                                    placeholder="Tasa de conversión"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Línea base</Label>
                                    <Input
                                        value={baselineValue}
                                        onChange={(e) => setBaselineValue(e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Objetivo *</Label>
                                    <Input
                                        value={targetValue}
                                        onChange={(e) => setTargetValue(e.target.value)}
                                        placeholder="100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Actual</Label>
                                    <Input
                                        value={currentValue}
                                        onChange={(e) => setCurrentValue(e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Unidad</Label>
                                    <Input
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        placeholder="%"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Método de scoring</Label>
                                    <Select
                                        selectedKey={scoringMethod}
                                        onSelectionChange={(key) => setScoringMethod(String(key))}
                                    >
                                        <Select.Trigger>
                                            <Select.Value />
                                        </Select.Trigger>
                                        <Select.Popover>
                                            <ListBox>
                                                {scoringMethods.map((opt) => (
                                                    <ListBoxItem key={opt.value} id={opt.value}>
                                                        {opt.label}
                                                    </ListBoxItem>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
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

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Confianza</Label>
                                    <span className="text-sm font-medium">{confidence}%</span>
                                </div>
                                <Slider
                                    value={confidence}
                                    onChange={(val) => setConfidence(val as number)}
                                    minValue={0}
                                    maxValue={100}
                                    step={5}
                                    aria-label="Confianza"
                                />
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="ghost" onPress={onClose} isDisabled={isPending}>
                                Cancelar
                            </Button>
                            <Button onPress={handleSubmit} isPending={isPending}>
                                {isEditing ? "Guardar" : "Crear"}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
