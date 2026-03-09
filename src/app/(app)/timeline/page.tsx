import { Suspense } from "react";
import { getCycles } from "@/db/queries/cycles";
import { getTimelineData } from "@/db/queries/timeline";
import { PageHeader, LoadingSkeleton } from "@/components/ui";
import { TimelineClient } from "@/components/timeline/TimelineClient";

interface TimelinePageProps {
    searchParams?: Promise<{
        cycleId?: string;
    }>;
}

export default async function TimelinePage(props: TimelinePageProps) {
    const searchParams = await props.searchParams;
    const cycles = await getCycles();
    const activeCycle =
        cycles.find((c) => c.status === "active") || cycles[0];
    const cycleId = searchParams?.cycleId || activeCycle?.cycleId;

    if (!cycleId) {
        return (
            <div className="p-8 text-default-500">
                No hay ciclos definidos. Crea un ciclo primero.
            </div>
        );
    }

    const timelineData = await getTimelineData(cycleId);

    return (
        <div>
            <PageHeader
                title="Timeline"
                description="Vista temporal de objetivos, iniciativas y tareas"
            />

            <Suspense fallback={<LoadingSkeleton variant="table" />}>
                <TimelineClient
                    data={timelineData}
                    cycles={cycles}
                    currentCycleId={cycleId}
                />
            </Suspense>
        </div>
    );
}
