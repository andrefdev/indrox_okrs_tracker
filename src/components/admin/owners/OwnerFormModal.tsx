"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Modal,
    Button,
    Input,
    Select,
    Autocomplete,
    Switch,
    TextField,
    Label,
    FieldError,
    ListBox,
    ListBoxItem,
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
    isActive: z.boolean().optional(),
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
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Heading>
                                {ownerToEdit ? "Editar Owner" : "Nuevo Owner"}
                            </Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <form id="owner-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                <Controller
                                    name="fullName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            isInvalid={!!errors.fullName}
                                            className="w-full"
                                        >
                                            <Label>Nombre Completo</Label>
                                            <Input
                                                {...field}
                                                placeholder="ej. John Doe"
                                                className="w-full"
                                            />
                                            <FieldError>{errors.fullName?.message}</FieldError>
                                        </TextField>
                                    )}
                                />
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            isInvalid={!!errors.email}
                                            className="w-full"
                                        >
                                            <Label>Email</Label>
                                            <Input
                                                {...field}
                                                placeholder="ej. john@example.com"
                                                className="w-full"
                                            />
                                            <FieldError>{errors.email?.message}</FieldError>
                                        </TextField>
                                    )}
                                />
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            selectedKey={field.value}
                                            onSelectionChange={(key) => field.onChange(key)}
                                            isInvalid={!!errors.role}
                                            className="w-full"
                                            placeholder="Selecciona un rol"
                                        >
                                            <Label>Rol</Label>
                                            <Select.Trigger>
                                                <Select.Value />
                                            </Select.Trigger>
                                            <Select.Popover>
                                                <ListBox>
                                                    {roles.map((role) => (
                                                        <ListBoxItem key={role} textValue={role}>
                                                            {role}
                                                        </ListBoxItem>
                                                    ))}
                                                </ListBox>
                                            </Select.Popover>
                                            <FieldError>{errors.role?.message}</FieldError>
                                        </Select>
                                    )}
                                />
                                <Controller
                                    name="areaId"
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
                                            selectedKey={field.value ? String(field.value) : null}
                                            onSelectionChange={(key) => field.onChange(key)}
                                            isInvalid={!!errors.areaId}
                                            className="w-full"
                                        >
                                            <Label>Área</Label>
                                            <Autocomplete.Trigger>
                                                <Autocomplete.Value />
                                            </Autocomplete.Trigger>
                                            <Autocomplete.Popover>
                                                <Autocomplete.Filter>
                                                    <Input placeholder="Selecciona un área" />
                                                </Autocomplete.Filter>
                                                <ListBox>
                                                    {areas.map((area) => (
                                                        <ListBoxItem key={area.areaKey} textValue={area.name}>
                                                            {area.name}
                                                        </ListBoxItem>
                                                    ))}
                                                </ListBox>
                                            </Autocomplete.Popover>
                                            <FieldError>{errors.areaId?.message}</FieldError>
                                        </Autocomplete>
                                    )}
                                />
                                <Controller
                                    name="authUserId"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            isInvalid={!!errors.authUserId}
                                            className="w-full"
                                        >
                                            <Label>Auth User ID (Supabase UUID)</Label>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="Pegar UUID de Supabase Auth"
                                                className="w-full"
                                            />
                                            <FieldError>{errors.authUserId?.message}</FieldError>
                                            {/* Description note: could add Description component if imported */}
                                        </TextField>
                                    )}
                                />
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <Switch
                                            isSelected={value}
                                            onChange={onChange}
                                            {...field}
                                        >
                                            Activo
                                        </Switch>
                                    )}
                                />
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit" form="owner-form" isDisabled={isSubmitting}>
                                Guardar
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
