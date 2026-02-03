import { getAllDecisions } from "@/db/queries/decisions";
import { getOwners } from "@/db/queries/owners";
import { DecisionsClient } from "@/components/decisions/DecisionsClient";
import { PageHeader } from "@/components/ui";

export default async function DecisionsPage() {
    const [decisions, owners] = await Promise.all([
        getAllDecisions(),
        getOwners(),
    ]);

    return (
        <div>
            <PageHeader
                title="Registro de Decisiones"
                description="Historial de decisiones importantes, contexto y justificación."
            />
            <DecisionsClient
                decisions={decisions}
                owners={owners}
            />
        </div>
    );
}
