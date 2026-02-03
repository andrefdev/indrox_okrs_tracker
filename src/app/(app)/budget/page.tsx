import { getAllBudgetItems } from "@/db/queries/budget";
import { getInitiatives } from "@/db/queries/initiatives";
import { BudgetClient } from "@/components/budget/BudgetClient";
import { PageHeader } from "@/components/ui";

export default async function BudgetPage() {
    const [budgetItems, initiatives] = await Promise.all([
        getAllBudgetItems(),
        getInitiatives(),
    ]);

    return (
        <div>
            <PageHeader
                title="Presupuesto"
                description="Gestión financiera de iniciativas, seguimiento de planificación vs ejecución."
            />
            <BudgetClient
                budgetItems={budgetItems}
                initiatives={initiatives}
            />
        </div>
    );
}
