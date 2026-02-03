import { Skeleton } from "@heroui/react";

interface LoadingSkeletonProps {
    variant?: "card" | "list" | "table" | "page";
    count?: number;
}

export function LoadingSkeleton({ variant = "card", count = 3 }: LoadingSkeletonProps) {
    switch (variant) {
        case "card":
            return <CardSkeleton count={count} />;
        case "list":
            return <ListSkeleton count={count} />;
        case "table":
            return <TableSkeleton rows={count} />;
        case "page":
            return <PageSkeleton />;
        default:
            return <CardSkeleton count={count} />;
    }
}

function CardSkeleton({ count }: { count: number }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-xl border border-default-200 bg-background p-4"
                >
                    <Skeleton className="mb-3 h-4 w-3/4 rounded-lg" />
                    <Skeleton className="mb-2 h-3 w-full rounded-lg" />
                    <Skeleton className="mb-4 h-3 w-2/3 rounded-lg" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ListSkeleton({ count }: { count: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 rounded-lg border border-default-200 bg-background p-4"
                >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                        <Skeleton className="mb-2 h-4 w-1/3 rounded-lg" />
                        <Skeleton className="h-3 w-1/2 rounded-lg" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
            ))}
        </div>
    );
}

function TableSkeleton({ rows }: { rows: number }) {
    return (
        <div className="overflow-hidden rounded-xl border border-default-200">
            {/* Header */}
            <div className="flex gap-4 border-b border-default-200 bg-default-50 p-4">
                <Skeleton className="h-4 w-1/4 rounded-lg" />
                <Skeleton className="h-4 w-1/5 rounded-lg" />
                <Skeleton className="h-4 w-1/6 rounded-lg" />
                <Skeleton className="h-4 w-1/5 rounded-lg" />
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="flex gap-4 border-b border-default-100 p-4 last:border-b-0"
                >
                    <Skeleton className="h-4 w-1/4 rounded-lg" />
                    <Skeleton className="h-4 w-1/5 rounded-lg" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-4 w-1/5 rounded-lg" />
                </div>
            ))}
        </div>
    );
}

function PageSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Skeleton className="mb-2 h-4 w-48 rounded-lg" />
                <Skeleton className="mb-2 h-8 w-64 rounded-lg" />
                <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl border border-default-200 bg-background p-4"
                    >
                        <Skeleton className="mb-2 h-4 w-1/2 rounded-lg" />
                        <Skeleton className="h-8 w-1/3 rounded-lg" />
                    </div>
                ))}
            </div>
            {/* Table */}
            <TableSkeleton rows={5} />
        </div>
    );
}
