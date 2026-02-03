
import { getOwners } from "@/db/queries/owners";
import { getAreas } from "@/db/queries/areas";
import { OwnersClient } from "@/components/admin/owners/OwnersClient";

export default async function OwnersPage() {
    const owners = await getOwners();
    const areas = await getAreas();

    // Map areas to pass strictly the array of Area to the modal
    // getAreas returns areas with leadOwner, so strictly speaking it satisfies Area[] but TypeScript might complain if we aren't careful in the interface.
    // However, AreaFormModal expects Area[] and the result extends Area, so it should be fine.

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <OwnersClient owners={owners} areas={areas} />
        </div>
    );
}
