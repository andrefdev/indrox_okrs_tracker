
import { Suspense } from "react";
import { getWorkItems } from "@/db/queries/work-items";
import { getInitiatives, getOwners, getCurrentOwner } from "@/db/queries";
import { WorkItemsClient } from "@/components/work-items/WorkItemsClient";
import { PageHeader, LoadingSkeleton } from "@/components/ui";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function WorkItemsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch current owner details for permissions
    const currentOwner = await getCurrentOwner(user.id);

    // Fetch dropdown data
    const [initiatives, owners] = await Promise.all([
        getInitiatives(),
        getOwners(),
    ]);

    // Fetch filtered work items
    const workItems = await getWorkItems({
        initiativeId: params.initiativeId,
        ownerId: params.ownerId,
        status: params.status,
        type: params.type,
        search: params.search,
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Work Items"
                description="Gestión de tareas, bugs y features vinculados a iniciativas."
            />

            <Suspense fallback={<LoadingSkeleton />}>
                <WorkItemsClient
                    workItems={workItems}
                    initiatives={initiatives}
                    owners={owners}
                    currentOwner={currentOwner}
                />
            </Suspense>
        </div>
    );
}
