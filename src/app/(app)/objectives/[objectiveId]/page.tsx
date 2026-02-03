import { notFound } from "next/navigation";
import { getObjectiveById } from "@/db/queries/objectives";
import { getCycles } from "@/db/queries/cycles";
import { PageHeader } from "@/components/ui";
import { ObjectiveDetailClient } from "@/components/objectives/ObjectiveDetailClient";

interface Props {
    params: Promise<{ objectiveId: string }>;
}

export default async function ObjectiveDetailPage({ params }: Props) {
    const { objectiveId } = await params;

    const [objective, cycles] = await Promise.all([
        getObjectiveById(objectiveId),
        getCycles(),
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
            />
        </div>
    );
}
