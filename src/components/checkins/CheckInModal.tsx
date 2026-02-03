"use client";

import { useState, useTransition, useEffect } from "react";
import {
    Modal,
    Button,
    Input,
    TextArea,
    Link,
} from "@heroui/react";
import { Trash2, Link as LinkIcon, Plus, X, History } from "lucide-react";
import { createCheckIn, getCheckIns, deleteCheckIn } from "@/app/actions/checkins";
import type { KeyResult, KeyResultCheckIn, CheckInEvidence } from "@/db/schema/okr";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CheckInModalProps {
    isOpen: boolean;
    onClose: () => void;
    keyResult: KeyResult | null;
}

interface EvidenceInput {
    name: string;
    url: string;
}

// Type for history items (CheckIn with relations)
type CheckInWithEvidence = KeyResultCheckIn & { evidence: CheckInEvidence[] };

export function CheckInModal({ isOpen, onClose, keyResult }: CheckInModalProps) {
    const [isPending, startTransition] = useTransition();

    // Form State
    const [value, setValue] = useState("");
    const [comment, setComment] = useState("");
    const [evidenceList, setEvidenceList] = useState<EvidenceInput[]>([]);

    // Evidence Input State
    const [newEvidenceName, setNewEvidenceName] = useState("");
    const [newEvidenceUrl, setNewEvidenceUrl] = useState("");
    const [showEvidenceInput, setShowEvidenceInput] = useState(false);

    // History State
    const [history, setHistory] = useState<CheckInWithEvidence[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    useEffect(() => {
        if (isOpen && keyResult) {
            setValue(keyResult.currentValue || "");
            setComment("");
            setEvidenceList([]);
            setNewEvidenceName("");
            setNewEvidenceUrl("");
            setShowEvidenceInput(false);

            // Fetch history
            setIsLoadingHistory(true);
            getCheckIns(keyResult.krKey)
                .then(data => setHistory(data))
                .catch(err => console.error(err))
                .finally(() => setIsLoadingHistory(false));
        }
    }, [isOpen, keyResult]);

    const handleAddEvidence = () => {
        if (!newEvidenceUrl) return;
        setEvidenceList([...evidenceList, { name: newEvidenceName || newEvidenceUrl, url: newEvidenceUrl }]);
        setNewEvidenceName("");
        setNewEvidenceUrl("");
        setShowEvidenceInput(false);
    };

    const removeEvidence = (index: number) => {
        setEvidenceList(evidenceList.filter((_, i) => i !== index));
    };

    const handleDeleteCheckIn = (id: string) => {
        if (confirm("¿Estás seguro de eliminar este check-in?")) {
            startTransition(async () => {
                try {
                    await deleteCheckIn(id);
                    toast.success("Check-in eliminado");
                    // Refresh history
                    if (keyResult) {
                        const data = await getCheckIns(keyResult.krKey);
                        setHistory(data);
                    }
                } catch (error) {
                    toast.error("Error al eliminar check-in");
                }
            });
        }
    };

    const handleSubmit = () => {
        if (!keyResult || !value) return;

        startTransition(async () => {
            try {
                await createCheckIn({
                    krId: keyResult.krKey,
                    value: value,
                    previousValue: keyResult.currentValue,
                    comment: comment || null,
                }, evidenceList);

                toast.success("Progreso actualizado correctamente");
                onClose();
            } catch (error) {
                toast.error("Error al actualizar progreso");
                console.error(error);
            }
        });
    };

    if (!keyResult) return null;

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Heading>
                                Actualizar Progreso
                                <p className="text-sm font-normal text-default-500 mt-1">
                                    {keyResult.title}
                                </p>
                            </Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="max-h-[70vh] overflow-y-auto space-y-6">
                            {/* Update Form */}
                            <div className="space-y-4 p-4 border rounded-xl bg-default-50">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">Valor Actual</label>
                                        <div className="text-2xl font-bold text-default-400">
                                            {keyResult.currentValue || (keyResult.baselineValue || "0")} {keyResult.unit}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="newValue" className="text-sm font-medium">Nuevo Valor</label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="newValue"
                                                value={value}
                                                onChange={(e) => setValue(e.target.value)}
                                                placeholder="0"
                                            />
                                            <span className="text-sm text-default-500">{keyResult.unit}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="comment" className="text-sm font-medium">Comentario (Opcional)</label>
                                    <TextArea
                                        id="comment"
                                        placeholder="Describe el progreso realizado..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={2}
                                    />
                                </div>

                                {/* Evidence Section */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium flex items-center justify-between">
                                        Evidencia
                                        {!showEvidenceInput && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onPress={() => setShowEvidenceInput(true)}
                                            >
                                                <Plus className="h-3 w-3 mr-1" /> Agregar Enlace
                                            </Button>
                                        )}
                                    </label>

                                    {showEvidenceInput && (
                                        <div className="flex gap-2 items-start p-2 border rounded-lg bg-background">
                                            <div className="flex-1 space-y-2">
                                                <Input
                                                    placeholder="Nombre / Título"
                                                    value={newEvidenceName}
                                                    onChange={(e) => setNewEvidenceName(e.target.value)}
                                                />
                                                <Input
                                                    placeholder="URL (https://...)"
                                                    value={newEvidenceUrl}
                                                    onChange={(e) => setNewEvidenceUrl(e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                className="bg-primary text-primary-foreground"
                                                onPress={handleAddEvidence}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}

                                    {evidenceList.length > 0 && (
                                        <ul className="space-y-1">
                                            {evidenceList.map((item, idx) => (
                                                <li key={idx} className="flex items-center justify-between text-sm bg-background p-2 rounded border">
                                                    <div className="flex items-center gap-2 truncate">
                                                        <LinkIcon className="h-3 w-3 text-default-400" />
                                                        <a href={item.url} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[200px]">
                                                            {item.name}
                                                        </a>
                                                    </div>
                                                    <button onClick={() => removeEvidence(idx)} className="text-default-400 hover:text-danger">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* History Section */}
                            <div className="space-y-4 p-1">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <History className="h-4 w-4" /> Historial
                                </h3>

                                {isLoadingHistory ? (
                                    <div className="text-center py-4 text-default-500">Check-ins pasados...</div>
                                ) : history.length === 0 ? (
                                    <div className="text-center py-4 text-default-400 border-2 border-dashed rounded-lg">
                                        No hay check-ins registrados
                                    </div>
                                ) : (
                                    <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-default-200">
                                        {history.map((checkIn) => (
                                            <div key={checkIn.id} className="relative pl-10">
                                                <div className="absolute left-[13px] top-1.5 h-2 w-2 rounded-full ring-2 ring-white bg-primary"></div>
                                                <div className="flex justify-between items-start group">
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            {checkIn.previousValue ? (
                                                                <>
                                                                    <span className="text-default-500">{checkIn.previousValue}</span>
                                                                    <span className="mx-1 text-default-300">→</span>
                                                                </>
                                                            ) : null}
                                                            <span className="text-primary">{checkIn.value} {keyResult.unit}</span>
                                                        </div>
                                                        <div className="text-xs text-default-400">
                                                            {format(new Date(checkIn.createdAt), "d MMM yyyy, HH:mm", { locale: es })}
                                                        </div>
                                                        {checkIn.comment && (
                                                            <p className="text-sm text-default-600 mt-1">{checkIn.comment}</p>
                                                        )}
                                                        {checkIn.evidence && checkIn.evidence.length > 0 && (
                                                            <div className="mt-2 flex flex-wrap gap-2">
                                                                {checkIn.evidence.map(ev => (
                                                                    <a
                                                                        key={ev.id}
                                                                        href={ev.url}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="inline-flex items-center gap-1 text-xs text-primary bg-primary-50 px-2 py-1 rounded hover:bg-primary-100"
                                                                    >
                                                                        <LinkIcon className="h-3 w-3" />
                                                                        {ev.name || "Enlace"}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="ghost"
                                                        className="opacity-0 group-hover:opacity-100 text-default-400 hover:text-danger"
                                                        onPress={() => handleDeleteCheckIn(checkIn.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="ghost" onPress={onClose} isDisabled={isPending}>
                                Cerrar
                            </Button>
                            <Button
                                onPress={handleSubmit}
                                isPending={isPending}
                                className="bg-primary text-primary-foreground"
                            >
                                Guardar Progreso
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
