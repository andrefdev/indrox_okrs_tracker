import { getAllRisks } from "@/db/queries/risks";
import { getOwners } from "@/db/queries/owners";
import { RisksClient } from "@/components/risks/RisksClient";
import { PageHeader } from "@/components/ui";

export default async function RisksPage() {
    const [risks, owners] = await Promise.all([
        getAllRisks(),
        getOwners(),
    ]);

    return (
        <div>
            <PageHeader
                title="Gestión de Riesgos"
                description="Identificación y monitoreo de riesgos potenciales en la ejecución de OKRs."
            />
            <RisksClient risks={risks} owners={owners} />
        </div>
    );
}
