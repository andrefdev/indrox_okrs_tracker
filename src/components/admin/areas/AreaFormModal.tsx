"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Autocomplete,
    AutocompleteItem,
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
        <Modal isOpen={isOpen} onClose={onClose} placement="center">
            <ModalContent>
                {(onClose) => (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader className="flex flex-col gap-1">
                            {areaToEdit ? "Editar Área" : "Nueva Área"}
                        </ModalHeader>
                        <ModalBody>
                            <Controller
                                name="code"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Código"
                                        placeholder="ej. ENG"
                                        errorMessage={errors.code?.message}
                                        isInvalid={!!errors.code}
                                    />
                                )}
                            />
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Nombre"
                                        placeholder="ej. Engineering"
                                        errorMessage={errors.name?.message}
                                        isInvalid={!!errors.name}
                                    />
                                )}
                            />
                            <Controller
                                name="leadOwnerId"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        label="Líder (Owner)"
                                        placeholder="Selecciona un líder"
                                        defaultSelectedKey={field.value ? String(field.value) : undefined}
                                        onSelectionChange={(key) => field.onChange(key)}
                                        errorMessage={errors.leadOwnerId?.message}
                                        isInvalid={!!errors.leadOwnerId}
                                    >
                                        {owners.map((owner) => (
                                            <AutocompleteItem key={owner.ownerKey} textValue={owner.fullName}>
                                                {owner.fullName}
                                            </AutocompleteItem>
                                        ))}
                                    </Autocomplete>
                                )}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="submit" isLoading={isSubmitting}>
                                Guardar
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
}
