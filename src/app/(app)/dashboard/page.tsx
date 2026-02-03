
import { getCycles } from "@/db/queries/cycles";
import {
    getDashboardStats,
    getBlockedItems,
    getItemsWithoutRecentEvidence,
    getHighPriorityItems,
} from "@/db/queries/dashboard";
import { CycleSelector } from "@/components/dashboard/CycleSelector";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { DashboardTables } from "@/components/dashboard/DashboardTables";

interface DashboardPageProps {
    searchParams?: Promise<{
        cycleId?: string;
    }>;
}

export default async function DashboardPage(props: DashboardPageProps) {
    const searchParams = await props.searchParams;
    const cycles = await getCycles();
    const activeCycle = cycles.find((c) => c.status === "active") || cycles[0];
    const cycleId = searchParams?.cycleId || activeCycle?.cycleId;

    if (!cycleId) {
        return <div className="p-8">No hay ciclos definidos. Crea un ciclo primero.</div>;
    }

    const [stats, blocked, noEvidence, priorities] = await Promise.all([
        getDashboardStats(cycleId),
        getBlockedItems(cycleId),
        getItemsWithoutRecentEvidence(cycleId),
        getHighPriorityItems(cycleId),
    ]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <CycleSelector cycles={cycles} currentCycleId={cycleId} />
            </div>

            <DashboardCards stats={stats} />
            <DashboardTables blocked={blocked} noEvidence={noEvidence} priorities={priorities} />
        </div>
    );
}
