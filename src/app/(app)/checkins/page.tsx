import { getAllCheckIns } from "@/db/queries/checkins";
import { CheckinsClient, UnifiedCheckin } from "@/components/checkins/CheckinsClient";
import { PageHeader } from "@/components/ui";

export default async function CheckinsPage() {
    const { entityCheckins, krCheckins } = await getAllCheckIns();

    const unifiedCheckins: UnifiedCheckin[] = [
        ...entityCheckins.map((c) => ({
            id: c.checkinKey,
            type: "objective" as const,
            title: "Check-in de Objetivo",
            date: new Date(c.checkinDate),
            owner: c.owner.fullName,
            status: c.status,
            note: c.progressNote,
            context: c.entityId || "Objetivo",
        })),
        ...krCheckins.map((c) => ({
            id: c.id,
            type: "key_result" as const,
            title: c.keyResult.title,
            date: new Date(c.createdAt),
            owner: "Usuario",
            value: c.value,
            previousValue: c.previousValue,
            unit: c.keyResult.unit,
            comment: c.comment,
            context: c.keyResult.objective?.title || "Objetivo",
        })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div>
            <PageHeader
                title="Check-ins Globales"
                description="Historial completo de progreso en Objetivos y Key Results."
            />
            <CheckinsClient data={unifiedCheckins} />
        </div>
    );
}
