import { Suspense } from "react";
import { getCycles } from "@/db/queries/cycles";
import { PageHeader, LoadingSkeleton } from "@/components/ui";
import { CyclesClient } from "@/components/cycles/CyclesClient";

export default async function CyclesPage() {
    const cycles = await getCycles();

    return (
        <div>
            <PageHeader
                title="Ciclos"
                description="Gestión de periodos de tiempo para OKRs (Trimestres, Años, etc.)"
            />

            <Suspense fallback={<LoadingSkeleton variant="table" />}>
                <CyclesClient cycles={cycles} />
            </Suspense>
        </div>
    );
}

