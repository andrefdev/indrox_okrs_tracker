"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { IndroxLogo } from "@/components/icons/IndroxLogo";
import { Button } from "@heroui/react";
import { getNavigationForRole, type NavSection } from "@/config/navigation";
import type { UserRole } from "@/types/user";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    userRole?: UserRole;
}

export function Sidebar({ collapsed, onToggle, userRole = "CEO" }: SidebarProps) {
    const pathname = usePathname();
    const filteredNavigation = getNavigationForRole(userRole);

    return (
        <div className="flex h-full flex-col border-r border-default-200 bg-background">
            {/* Logo */}
            <div className="flex h-12 items-center justify-between border-b border-default-200 px-3">
                {!collapsed ? (
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                            <IndroxLogo className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-base font-semibold">OKRs</span>
                    </Link>
                ) : (
                    <div className="flex w-full justify-center">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                            <IndroxLogo className="h-4 w-4 text-primary-foreground" />
                        </div>
                    </div>
                )}
                <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    onPress={onToggle}
                    className={`hidden lg:flex ${collapsed ? "absolute -right-3 top-4 z-50 rounded-full border border-default-200 bg-background shadow-sm" : ""}`}
                    aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                >
                    {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-2 px-2">
                <div className="space-y-0.5">
                    {filteredNavigation.map((section) => (
                        <NavSectionComponent
                            key={section.id}
                            section={section}
                            collapsed={collapsed}
                            currentPath={pathname}
                        />
                    ))}
                </div>
            </nav>
        </div>
    );
}

function NavSectionComponent({
    section,
    collapsed,
    currentPath,
}: {
    section: NavSection;
    collapsed: boolean;
    currentPath: string;
}) {
    const isSectionActive = section.href
        ? currentPath === section.href
        : section.items.some(
              (item) => currentPath === item.href || currentPath.startsWith(`${item.href}/`)
          );

    const [isOpen, setIsOpen] = useState(
        section.defaultCollapsed ? isSectionActive : true
    );

    const SectionIcon = section.icon;

    // Direct link section (Dashboard - no children)
    if (section.href) {
        return (
            <Link
                href={section.href}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                    isSectionActive
                        ? "bg-primary/10 text-primary"
                        : "text-default-600 hover:bg-default-100"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? section.title : undefined}
            >
                <SectionIcon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{section.title}</span>}
            </Link>
        );
    }

    // Collapsible section with children
    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                    isSectionActive && !isOpen
                        ? "text-primary"
                        : "text-default-500 hover:bg-default-100 hover:text-default-700"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? section.title : undefined}
            >
                <SectionIcon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                    <>
                        <span className="flex-1 text-left text-xs font-medium uppercase tracking-wider">
                            {section.title}
                        </span>
                        <ChevronDown
                            className={`h-3 w-3 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                        />
                    </>
                )}
            </button>

            {!collapsed && isOpen && (
                <div className="ml-3 mt-0.5 space-y-0.5 border-l border-default-200 pl-2">
                    {section.items.map((item) => {
                        const isActive =
                            currentPath === item.href ||
                            currentPath.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`flex items-center rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-default-600 hover:bg-default-100"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
