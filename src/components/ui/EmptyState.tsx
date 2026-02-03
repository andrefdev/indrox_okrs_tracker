import { Button } from "@heroui/react";
import { type LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({
    icon: Icon = Inbox,
    title,
    description,
    action
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-default-200 bg-default-50 p-8 text-center md:p-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-default-100">
                <Icon className="h-8 w-8 text-default-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
            {description && (
                <p className="mb-4 max-w-sm text-sm text-default-500">{description}</p>
            )}
            {action && (
                <Button onPress={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}
