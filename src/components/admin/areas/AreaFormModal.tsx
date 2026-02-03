"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Modal,
    Button,
    Input,
    Autocomplete,
    TextField,
    Label,
    FieldError,
    ListBox,
    ListBoxItem,
} from "@heroui/react";
import { createAreaAction, updateAreaAction } from "@/app/actions/areas";
import { toast } from "sonner";
import type { Area, Owner } from "@/db/schema/core";

const schema = z.object({
    code: z.string().min(1, "El código es requerido"),
    name: z.string().min(1, "El nombre es requerido"),
    leadOwnerId: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface AreaFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    areaToEdit?: Area | null;
    owners: Owner[];
}

export function AreaFormModal({
    isOpen,
    onClose,
    areaToEdit,
    owners,
}: AreaFormModalProps) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            code: "",
            name: "",
            leadOwnerId: null,
        },
    });

    useEffect(() => {
        if (areaToEdit) {
            reset({
                code: areaToEdit.code,
                name: areaToEdit.name,
                leadOwnerId: areaToEdit.leadOwnerId,
            });
        } else {
            reset({
                code: "",
                name: "",
                leadOwnerId: null,
            });
        }
    }, [areaToEdit, reset, isOpen]);

    const onSubmit = async (data: FormData) => {
        try {
            const payload = {
                code: data.code,
                name: data.name,
                leadOwnerId: data.leadOwnerId || null,
            };

            if (areaToEdit) {
                const result = await updateAreaAction(areaToEdit.areaKey, payload);
                if (result.success) {
                    toast.success("Área actualizada correctamente");
                    onClose();
                } else {
                    toast.error("Error al actualizar el área");
                }
            } else {
                const result = await createAreaAction(payload);
                if (result.success) {
                    toast.success("Área creada correctamente");
                    onClose();
                } else {
                    toast.error("Error al crear el área");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error inesperado");
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <Modal.Backdrop />
            <Modal.Container>
                <Modal.Dialog>
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Heading>
                            {areaToEdit ? "Editar Área" : "Nueva Área"}
                        </Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <form id="area-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <Controller
                                name="code"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        isInvalid={!!errors.code}
                                        className="w-full"
                                    >
                                        <Label>Código</Label>
                                        <Input
                                            {...field}
                                            placeholder="ej. ENG"
                                            className="w-full"
                                        />
                                        <FieldError>{errors.code?.message}</FieldError>
                                    </TextField>
                                )}
                            />
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        isInvalid={!!errors.name}
                                        className="w-full"
                                    >
                                        <Label>Nombre</Label>
                                        <Input
                                            {...field}
                                            placeholder="ej. Engineering"
                                            className="w-full"
                                        />
                                        <FieldError>{errors.name?.message}</FieldError>
                                    </TextField>
                                )}
                            />
                            <Controller
                                name="leadOwnerId"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        selectedKey={field.value ? String(field.value) : null}
                                        onSelectionChange={(key) => field.onChange(key)}
                                        isInvalid={!!errors.leadOwnerId}
                                        className="w-full"
                                    >
                                        <Label>Líder (Owner)</Label>
                                        <Autocomplete.Trigger>
                                            <Autocomplete.Value />
                                        </Autocomplete.Trigger>
                                        <Autocomplete.Popover>
                                            <Autocomplete.Filter>
                                                <Input placeholder="Selecciona un líder" />
                                            </Autocomplete.Filter>
                                            <ListBox>
                                                {owners.map((owner) => (
                                                    <ListBoxItem key={owner.ownerKey} textValue={owner.fullName}>
                                                        {owner.fullName}
                                                    </ListBoxItem>
                                                ))}
                                            </ListBox>
                                        </Autocomplete.Popover>
                                        <FieldError>{errors.leadOwnerId?.message}</FieldError>
                                    </Autocomplete>
                                )}
                            />
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onPress={onClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" form="area-form" isDisabled={isSubmitting}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal>
    );
}
