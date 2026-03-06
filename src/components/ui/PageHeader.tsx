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
        <div className="mb-4">
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-1 flex items-center gap-1 text-xs text-default-500">
                    {breadcrumbs.map((crumb, index) => (
                        <span key={index} className="flex items-center gap-1">
                            {index > 0 && <ChevronRight className="h-3 w-3" />}
                            {crumb.href ? (
                                <Link href={crumb.href} className="hover:text-primary transition-colors">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-default-700">{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </nav>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-foreground md:text-2xl">{title}</h1>
                    {description && (
                        <p className="mt-0.5 text-sm text-default-500">{description}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-2">{actions}</div>
                )}
            </div>
        </div>
    );
}
