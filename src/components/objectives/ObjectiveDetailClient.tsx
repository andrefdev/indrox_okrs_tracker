"use client";

import { useState } from "react";
import { Tabs, Card } from "@heroui/react";
import { ObjectiveHeader } from "./ObjectiveHeader";
import { OverviewTab } from "./tabs/OverviewTab";
import { KeyResultsTab } from "./tabs/KeyResultsTab";
import { InitiativesTab } from "./tabs/InitiativesTab";
import { CheckinsTab } from "./tabs/CheckinsTab";
import { EvidenceTab } from "./tabs/EvidenceTab";
import { RisksTab } from "./tabs/RisksTab";
import { DependenciesTab } from "./tabs/DependenciesTab";
import { DecisionsTab } from "./tabs/DecisionsTab";
import type { OkrCycle } from "@/db/schema/okr";

// Type for objective with all relations
interface ObjectiveWithRelations {
    objective: any;
    owner: any;
    area: any;
    cycle: any;
    keyResults: any[];
    initiatives: any[];
    checkins: any[];
    evidence: any[];
    risks: any[];
    dependencies: any[];
    decisions: any[];
}

interface ObjectiveDetailClientProps {
    objective: ObjectiveWithRelations;
    cycles: OkrCycle[];
}

const tabs = [
    { id: "overview", label: "Resumen" },
    { id: "key-results", label: "Key Results" },
    { id: "initiatives", label: "Iniciativas" },
    { id: "checkins", label: "Check-ins" },
    { id: "evidence", label: "Evidencia" },
    { id: "risks", label: "Riesgos" },
    { id: "dependencies", label: "Dependencias" },
    { id: "decisions", label: "Decisiones" },
];

export function ObjectiveDetailClient({
    objective,
    cycles,
}: ObjectiveDetailClientProps) {
    const [activeTab, setActiveTab] = useState("overview");

    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return <OverviewTab objective={objective} />;
            case "key-results":
                return (
                    <KeyResultsTab
                        objectiveId={objective.objective.objectiveKey}
                        keyResults={objective.keyResults}
                    />
                );
            case "initiatives":
                return (
                    <InitiativesTab
                        objectiveId={objective.objective.objectiveKey}
                        initiatives={objective.initiatives}
                    />
                );
            case "checkins":
                return (
                    <CheckinsTab
                        entityType="objective"
                        entityId={objective.objective.objectiveKey}
                        checkins={objective.checkins}
                        keyResults={objective.keyResults}
                    />
                );
            case "evidence":
                return (
                    <EvidenceTab
                        entityType="objective"
                        entityId={objective.objective.objectiveKey}
                        evidence={objective.evidence}
                        keyResults={objective.keyResults}
                    />
                );
            case "risks":
                return (
                    <RisksTab
                        entityType="objective"
                        entityId={objective.objective.objectiveKey}
                        risks={objective.risks}
                    />
                );
            case "dependencies":
                return (
                    <DependenciesTab
                        entityType="objective"
                        entityId={objective.objective.objectiveKey}
                        dependencies={objective.dependencies}
                    />
                );
            case "decisions":
                return (
                    <DecisionsTab
                        entityType="objective"
                        entityId={objective.objective.objectiveKey}
                        decisions={objective.decisions}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with status, confidence, actions */}
            <ObjectiveHeader objective={objective} cycles={cycles} />

            {/* Tabs */}
            <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
            >
                <Tabs.List>
                    {tabs.map((tab) => (
                        <Tabs.Tab key={tab.id} id={tab.id}>
                            {tab.label}
                            {tab.id === "key-results" && objective.keyResults.length > 0 && (
                                <span className="ml-1.5 rounded-full bg-default-100 px-1.5 text-xs">
                                    {objective.keyResults.length}
                                </span>
                            )}
                            {tab.id === "initiatives" && objective.initiatives.length > 0 && (
                                <span className="ml-1.5 rounded-full bg-default-100 px-1.5 text-xs">
                                    {objective.initiatives.length}
                                </span>
                            )}
                            {tab.id === "risks" && objective.risks.length > 0 && (
                                <span className="ml-1.5 rounded-full bg-warning/20 px-1.5 text-xs text-warning">
                                    {objective.risks.length}
                                </span>
                            )}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs>

            {/* Tab Content */}
            <div className="mt-4">{renderTabContent()}</div>
        </div>
    );
}
