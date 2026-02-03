"use client";

import { Card, Button } from "@heroui/react";
import { Plus, ExternalLink, FileText, Image, Video, Link2 } from "lucide-react";
import { useState } from "react";
import { EvidenceModal } from "@/components/evidence/EvidenceModal";
import type { Owner } from "@/db/schema/core";

interface EvidenceTabProps {
    entityType: string;
    entityId: string;
    evidence: any[];
    keyResults?: any[];
    owners: Owner[];
}

const typeIcons: Record<string, React.ReactNode> = {
    document: <FileText className="h-4 w-4" />,
    link: <Link2 className="h-4 w-4" />,
    screenshot: <Image className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    other: <ExternalLink className="h-4 w-4" />,
};

const typeLabels: Record<string, string> = {
    document: "Documento",
    link: "Enlace",
    screenshot: "Captura",
    video: "Video",
    other: "Otro",
};

export function EvidenceTab({ entityType, entityId, evidence, keyResults = [], owners }: EvidenceTabProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Flatten and normalize evidence
    const krEvidence = keyResults.flatMap(kr =>
        (kr.checkIns || []).flatMap((c: any) =>
            (c.evidence || []).map((ev: any) => ({
                id: ev.id,
                type: 'link', // KR evidence is typically links
                title: ev.name || "Evidencia de Check-in",
                uploadedBy: null,
                date: ev.createdAt,
                url: ev.url,
                source: `Check-in: ${kr.title}`
            }))
        )
    );

    const objEvidence = evidence.map(({ evidence: ev, uploadedBy }) => ({
        id: ev.evidenceKey,
        type: ev.type,
        title: ev.title,
        uploadedBy: uploadedBy,
        date: ev.createdAt,
        url: ev.url,
        source: "Directo"
    }));

    const allEvidence = [...krEvidence, ...objEvidence].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Evidencia ({allEvidence.length})</h3>
                <Button onPress={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Adjuntar Evidencia
                </Button>
            </div>

            {allEvidence.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-default-500">No hay evidencia adjunta.</p>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-default-200 bg-default-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Tipo</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Título</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Fuente</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Fecha</th>
                                    <th className="px-4 py-3 text-left font-medium text-default-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-default-100">
                                {allEvidence.map((ev) => (
                                    <tr key={ev.id} className="hover:bg-default-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-default-500">
                                                    {typeIcons[ev.type] || typeIcons.other}
                                                </span>
                                                <span className="text-sm">{typeLabels[ev.type] || "Otro"}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{ev.title}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-default-600">{ev.source}</span>
                                                {ev.uploadedBy && (
                                                    <span className="text-xs text-default-400">
                                                        por {ev.uploadedBy.fullName}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-default-400">
                                                {new Date(ev.date).toLocaleDateString("es-ES")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {ev.url && (
                                                <a
                                                    href={ev.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-default-100 transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <EvidenceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                entityType={entityType}
                entityId={entityId}
                owners={owners}
            />
        </div>
    );
}
