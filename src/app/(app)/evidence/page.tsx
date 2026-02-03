import { getAllEvidence } from "@/db/queries/checkins";
import { EvidenceClient } from "@/components/evidence/EvidenceClient";
import { PageHeader } from "@/components/ui";

export default async function EvidencePage() {
    const { entityEvidence, checkInEvidences } = await getAllEvidence();

    const allEvidence = [
        ...entityEvidence.map((e) => ({
            id: e.evidenceKey,
            type: e.type,
            title: e.title,
            context: "Objetivo",
            uploadedBy: e.uploadedByOwner?.fullName || "Desconocido",
            date: e.createdAt,
            url: e.url,
        })),
        ...checkInEvidences.map((e) => ({
            id: e.id,
            type: "link",
            title: e.name || "Evidencia",
            context: `Check-in: ${e.checkIn.keyResult.title}`,
            uploadedBy: "Usuario",
            date: e.createdAt,
            url: e.url,
        })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div>
            <PageHeader
                title="Evidencia Global"
                description="Repositorio central de toda la evidencia subida."
            />
            <EvidenceClient data={allEvidence} />
        </div>
    );
}
