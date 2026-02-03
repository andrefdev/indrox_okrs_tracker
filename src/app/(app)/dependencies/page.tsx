import { getAllDependencies } from "@/db/queries/dependencies";
import { getObjectives } from "@/db/queries/objectives";
import { getInitiatives } from "@/db/queries/initiatives";
import { DependenciesClient } from "@/components/dependencies/DependenciesClient";
import { PageHeader } from "@/components/ui";

export default async function DependenciesPage() {
    const [dependencies, objectives, initiatives] = await Promise.all([
        getAllDependencies(),
        getObjectives(),
        getInitiatives(),
    ]);

    return (
        <div>
            <PageHeader
                title="Dependencias"
                description="Visualiza y gestiona las relaciones y bloqueos entre OKRs e Iniciativas."
            />
            <DependenciesClient
                dependencies={dependencies}
                initiatives={initiatives}
                objectives={objectives.map(o => o.objective)}
            />
        </div>
    );
}
