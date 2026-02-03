
import { getAreas } from "@/db/queries/areas";
import { getOwners } from "@/db/queries/owners";
import { AreasClient } from "@/components/admin/areas/AreasClient";

export const dynamic = "force-dynamic";

export default async function AreasPage() {
    const areas = await getAreas();
    const owners = await getOwners();

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <AreasClient areas={areas} owners={owners} />
        </div>
    );
}
