import { Suspense } from "react";
import { getInitiatives } from "@/db/queries/initiatives";
import { getCycles } from "@/db/queries/cycles";
import { getOwners } from "@/db/queries/owners";
import { getAreas } from "@/db/queries/areas";
import { PageHeader, LoadingSkeleton } from "@/components/ui";
import { InitiativesClient } from "@/components/initiatives/InitiativesClient";

export default async function InitiativesPage() {
    // Fetch all necessary data
    const [initiatives, cycles, owners, areas] = await Promise.all([
        getInitiatives(),
        getCycles(),
        getOwners(),
        getAreas(),
    ]);

    return (
        <div>
            <PageHeader
                title="Iniciativas"
                description="Proyectos y esfuerzos concretos para alcanzar tus objetivos."
            />

            <Suspense fallback={<LoadingSkeleton variant="table" />}>
                <InitiativesClient
                    initiatives={initiatives as any}
                    cycles={cycles}
                    owners={owners}
                    areas={areas}
                />
            </Suspense>
        </div>
    );
}

