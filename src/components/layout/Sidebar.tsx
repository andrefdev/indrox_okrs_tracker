"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Target } from "lucide-react";
import { Button } from "@heroui/react";
import { navigation, getNavigationForRole, type NavSection } from "@/config/navigation";
import type { UserRole } from "@/types/user";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    // TODO: Get actual user role from auth context
    const userRole: UserRole = "CEO";
    const filteredNavigation = getNavigationForRole(userRole);

    return (
        <div className="flex h-full flex-col border-r border-default-200 bg-background">
            {/* Logo Section */}
            <div className="flex h-16 items-center justify-between border-b border-default-200 px-4">
                {!collapsed && (
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Target className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-semibold">OKRs</span>
                    </Link>
                )}
                {collapsed && (
                    <div className="flex w-full justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Target className="h-5 w-5 text-primary-foreground" />
                        </div>
                    </div>
                )}
                <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    onPress={onToggle}
                    className={`hidden lg:flex ${collapsed ? "absolute -right-3 top-5 z-50 rounded-full border border-default-200 bg-background shadow-sm" : ""}`}
                    aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3">
                {filteredNavigation.map((section) => (
                    <NavSectionComponent
                        key={section.id}
                        section={section}
                        collapsed={collapsed}
                        currentPath={pathname}
                    />
                ))}
            </nav>

            {/* Footer */}
            {!collapsed && (
                <div className="border-t border-default-200 p-4">
                    <p className="text-xs text-default-400">
                        © 2026 Indrox OKRs
                    </p>
                </div>
            )}
        </div>
    );
}

interface NavSectionComponentProps {
    section: NavSection;
    collapsed: boolean;
    currentPath: string;
}

function NavSectionComponent({ section, collapsed, currentPath }: NavSectionComponentProps) {
    return (
        <div className="mb-4">
            {!collapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-default-400">
                    {section.title}
                </h3>
            )}
            <ul className="space-y-1">
                {section.items.map((item) => {
                    const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                        <li key={item.id}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-default-600 hover:bg-default-100 hover:text-default-900"
                                    } ${collapsed ? "justify-center" : ""}`}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {!collapsed && (
                                    <>
                                        <span className="flex-1">{item.label}</span>
                                        {item.badge && (
                                            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
