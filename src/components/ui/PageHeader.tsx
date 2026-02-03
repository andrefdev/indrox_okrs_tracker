import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@heroui/react";

interface Breadcrumb {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: Breadcrumb[];
    actions?: React.ReactNode;
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    actions
}: PageHeaderProps) {
    return (
        <div className="mb-6">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-2 flex items-center gap-1 text-sm text-default-500">
                    {breadcrumbs.map((crumb, index) => (
                        <span key={index} className="flex items-center gap-1">
                            {index > 0 && <ChevronRight className="h-4 w-4" />}
                            {crumb.href ? (
                                <Link
                                    href={crumb.href}
                                    className="hover:text-primary transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-default-700">{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </nav>
            )}

            {/* Header Content */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-1 text-default-500">{description}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
