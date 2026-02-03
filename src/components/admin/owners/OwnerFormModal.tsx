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
    Select,
    SelectItem,
    Autocomplete,
    AutocompleteItem,
    Switch,
} from "@heroui/react";
import { createOwnerAction, updateOwnerAction } from "@/app/actions/owners";
import { toast } from "sonner";
import type { Owner, Area } from "@/db/schema/core";

const roles = ["CEO", "CMO", "CTO", "PM", "DEV", "DEVOPS", "UI_DESIGNER"];

const schema = z.object({
    fullName: z.string().min(1, "El nombre es requerido"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    role: z.enum(["CEO", "CMO", "CTO", "PM", "DEV", "DEVOPS", "UI_DESIGNER"]),
    areaId: z.string().optional().nullable(),
    authUserId: z.string().min(1, "El Auth User ID es requerido (UUID de Supabase)"),
    isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface OwnerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    ownerToEdit?: Owner | null;
    areas: Area[];
}

export function OwnerFormModal({
    isOpen,
    onClose,
    ownerToEdit,
    areas,
}: OwnerFormModalProps) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: "",
            email: "",
            role: "DEV",
            areaId: null,
            authUserId: "",
            isActive: true,
        },
    });

    useEffect(() => {
        if (ownerToEdit) {
            reset({
                fullName: ownerToEdit.fullName,
                email: ownerToEdit.email || "",
                role: ownerToEdit.role as any,
                areaId: ownerToEdit.areaId,
                authUserId: ownerToEdit.authUserId,
                isActive: ownerToEdit.isActive,
            });
        } else {
            reset({
                fullName: "",
                email: "",
                role: "DEV",
                areaId: null,
                authUserId: "",
                isActive: true,
            });
        }
    }, [ownerToEdit, reset, isOpen]);

    const onSubmit = async (data: FormData) => {
        try {
            const payload = {
                fullName: data.fullName,
                email: data.email || null,
                role: data.role,
                areaId: data.areaId || null,
                authUserId: data.authUserId,
                isActive: data.isActive,
            };

            if (ownerToEdit) {
                const result = await updateOwnerAction(ownerToEdit.ownerKey, payload);
                if (result.success) {
                    toast.success("Owner actualizado correctamente");
                    onClose();
                } else {
                    toast.error("Error al actualizar el owner");
                }
            } else {
                const result = await createOwnerAction(payload);
                if (result.success) {
                    toast.success("Owner creado correctamente");
                    onClose();
                } else {
                    toast.error("Error al crear el owner");
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
                            {ownerToEdit ? "Editar Owner" : "Nuevo Owner"}
                        </ModalHeader>
                        <ModalBody>
                            <Controller
                                name="fullName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Nombre Completo"
                                        placeholder="ej. John Doe"
                                        errorMessage={errors.fullName?.message}
                                        isInvalid={!!errors.fullName}
                                    />
                                )}
                            />
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Email"
                                        placeholder="ej. john@example.com"
                                        errorMessage={errors.email?.message}
                                        isInvalid={!!errors.email}
                                    />
                                )}
                            />
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        label="Rol"
                                        placeholder="Selecciona un rol"
                                        defaultSelectedKeys={field.value ? [field.value] : []}
                                        onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                                        errorMessage={errors.role?.message}
                                        isInvalid={!!errors.role}
                                    >
                                        {roles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            <Controller
                                name="areaId"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        label="Área"
                                        placeholder="Selecciona un área"
                                        defaultSelectedKey={field.value ? String(field.value) : undefined}
                                        onSelectionChange={(key) => field.onChange(key)}
                                        errorMessage={errors.areaId?.message}
                                        isInvalid={!!errors.areaId}
                                    >
                                        {areas.map((area) => (
                                            <AutocompleteItem key={area.areaKey} textValue={area.name}>
                                                {area.name}
                                            </AutocompleteItem>
                                        ))}
                                    </Autocomplete>
                                )}
                            />
                            <Controller
                                name="authUserId"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Auth User ID (Supabase UUID)"
                                        type="password" // Ocultar por seguridad visual básica, aunque no es sensible
                                        placeholder="Pegar UUID de Supabase Auth"
                                        description="Pega aquí el ID de usuario desde Supabase Authentication"
                                        errorMessage={errors.authUserId?.message}
                                        isInvalid={!!errors.authUserId}
                                    />
                                )}
                            />
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field: { value, onChange, ...field } }) => (
                                    <Switch
                                        isSelected={value}
                                        onValueChange={onChange}
                                        {...field}
                                    >
                                        Activo
                                    </Switch>
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
