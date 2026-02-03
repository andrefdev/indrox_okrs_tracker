import { Suspense } from "react";
import { getObjectives } from "@/db/queries/objectives";
import { getCycles } from "@/db/queries/cycles";
import { PageHeader, LoadingSkeleton } from "@/components/ui";
import { ObjectivesClient } from "@/components/objectives/ObjectivesClient";

interface SearchParams {
    cycleId?: string;
    areaId?: string;
    ownerId?: string;
    status?: string;
    priority?: string;
}

export default async function ObjectivesPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;

    // Fetch data
    const [objectives, cycles] = await Promise.all([
        getObjectives({
            cycleId: params.cycleId,
            areaId: params.areaId,
            ownerId: params.ownerId,
            status: params.status as any,
            priority: params.priority as any,
        }),
        getCycles(),
    ]);

    return (
        <div>
            <PageHeader
                title="Objetivos"
                description="Gestiona los objetivos estratégicos y tácticos de tu organización"
                breadcrumbs={[{ label: "Objetivos" }]}
            />

            <Suspense fallback={<LoadingSkeleton variant="table" />}>
                <ObjectivesClient
                    objectives={objectives}
                    cycles={cycles}
                    currentFilters={params}
                />
            </Suspense>
        </div>
    );
}
