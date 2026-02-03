import { notFound } from "next/navigation";
import { getObjectiveById } from "@/db/queries/objectives";
import { getCycles } from "@/db/queries/cycles";
import { getOwners } from "@/db/queries/owners";
import { getInitiatives } from "@/db/queries/initiatives";
import { getObjectives } from "@/db/queries/objectives";
import { PageHeader } from "@/components/ui";
import { ObjectiveDetailClient } from "@/components/objectives/ObjectiveDetailClient";

interface Props {
    params: Promise<{ objectiveId: string }>;
}

export default async function ObjectiveDetailPage({ params }: Props) {
    const { objectiveId } = await params;

    const [objective, cycles, owners, allInitiatives, allObjectives] = await Promise.all([
        getObjectiveById(objectiveId),
        getCycles(),
        getOwners(),
        getInitiatives(),
        getObjectives(),
    ]);

    if (!objective) {
        notFound();
    }

    return (
        <div>
            <PageHeader
                title={objective.objective.title}
                description={objective.objective.description || undefined}
                breadcrumbs={[
                    { label: "Objetivos", href: "/objectives" },
                    { label: objective.objective.title },
                ]}
            />

            <ObjectiveDetailClient
                objective={objective}
                cycles={cycles}
                owners={owners}
                allInitiatives={allInitiatives as any[]}
                allObjectives={allObjectives as any[]}
            />
        </div>
    );
}
