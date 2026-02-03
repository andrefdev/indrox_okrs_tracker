"use client";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Link,
    Chip,
    Card,
    CardHeader,
    CardBody,
} from "@heroui/react";
import NextLink from "next/link";
import { StatusChip, PriorityChip } from "@/components/ui";

interface DashboardTablesProps {
    blocked: {
        objectives: any[];
        initiatives: any[];
    };
    noEvidence: any[]; // Initiatives
    priorities: {
        objectives: any[];
        initiatives: any[];
    };
}

export function DashboardTables({ blocked, noEvidence, priorities }: DashboardTablesProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blocked Items */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <h3 className="font-bold text-lg text-danger">Bloqueados / En Riesgo</h3>
                </CardHeader>
                <CardBody>
                    <Table aria-label="Blocked items">
                        <TableHeader>
                            <TableColumn>TIPO</TableColumn>
                            <TableColumn>TÍTULO</TableColumn>
                            <TableColumn>OWNER</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="No hay items bloqueados.">
                            {[
                                ...blocked.objectives.map((o) => ({ ...o, type: "Objective", link: `/objectives/${o.objectiveKey}` })),
                                ...blocked.initiatives.map((i) => ({ ...i, type: "Initiative", title: i.name, link: `/initiatives/${i.initiativeKey}` })),
                            ].map((item: any) => (
                                <TableRow key={item.objectiveKey || item.initiativeKey}>
                                    <TableCell>
                                        <Chip size="sm" variant="flat">{item.type}</Chip>
                                    </TableCell>
                                    <TableCell>
                                        <Link as={NextLink} href={item.link} className="font-medium">
                                            {item.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {item.owner ? (
                                            <User
                                                name={item.owner.fullName}
                                                avatarProps={{ size: "sm", name: item.owner.fullName.charAt(0) }}
                                            />
                                        ) : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <StatusChip status={item.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            {/* High Priority Items */}
            <Card>
                <CardHeader>
                    <h3 className="font-bold text-lg">Prioridad Alta</h3>
                </CardHeader>
                <CardBody>
                    <Table aria-label="High Priority items">
                        <TableHeader>
                            <TableColumn>TIPO</TableColumn>
                            <TableColumn>ITEM</TableColumn>
                            <TableColumn>PRIORIDAD</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="No hay items de prioridad alta/crítica.">
                            {[
                                ...priorities.objectives.map((o) => ({ ...o, type: "Objective", link: `/objectives/${o.objectiveKey}` })),
                                ...priorities.initiatives.map((i) => ({ ...i, type: "Initiative", title: i.name, link: `/initiatives/${i.initiativeKey}` })),
                            ].map((item: any) => (
                                <TableRow key={item.objectiveKey || item.initiativeKey}>
                                    <TableCell>
                                        <span className="text-xs text-default-500 uppercase">{item.type}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Link as={NextLink} href={item.link} className="whitespace-normal block min-w-[150px]">
                                            {item.title}
                                        </Link>
                                        {item.dueDate && (
                                            <span className="text-xs text-default-400 block">Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <PriorityChip priority={item.priority} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            {/* No Recent Evidence */}
            <Card>
                <CardHeader>
                    <h3 className="font-bold text-lg text-warning">Sin Evidencia Reciente (+7 días)</h3>
                </CardHeader>
                <CardBody>
                    <Table aria-label="No recent evidence">
                        <TableHeader>
                            <TableColumn>INICIATIVA</TableColumn>
                            <TableColumn>OWNER</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="Todo actualizado.">
                            {noEvidence.map((item: any) => (
                                <TableRow key={item.initiativeKey}>
                                    <TableCell>
                                        <Link as={NextLink} href={`/initiatives/${item.initiativeKey}`} className="font-medium">
                                            {item.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {item.owner ? (
                                            <User
                                                name={item.owner.fullName}
                                                avatarProps={{ size: "sm", name: item.owner.fullName.charAt(0) }}
                                            />
                                        ) : "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

        </div>
    );
}
