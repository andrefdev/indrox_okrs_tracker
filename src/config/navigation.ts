import {
    LayoutDashboard,
    Target,
    Rocket,
    ListTodo,
    ClipboardCheck,
    FileText,
    AlertTriangle,
    Link2,
    DollarSign,
    FileCheck,
    Users,
    Building2,
    Settings,
    Calendar,
    type LucideIcon,
} from "lucide-react";
import { type UserRole, ADMIN_ROLES, ALL_ROLES } from "@/types/user";

/**
 * Navigation item configuration
 */
export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
    roles: UserRole[];
    badge?: string;
}

/**
 * Navigation section with grouped items
 */
export interface NavSection {
    id: string;
    title: string;
    items: NavItem[];
}

/**
 * Main navigation configuration
 */
export const navigation: NavSection[] = [
    {
        id: "main",
        title: "Principal",
        items: [
            {
                id: "dashboard",
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
                roles: ALL_ROLES,
            },
            {
                id: "cycles",
                label: "Ciclos",
                href: "/cycles",
                icon: Calendar,
                roles: ALL_ROLES,
            },
        ],
    },
    {
        id: "okr",
        title: "OKRs",
        items: [
            {
                id: "objectives",
                label: "Objetivos",
                href: "/objectives",
                icon: Target,
                roles: ALL_ROLES,
            },
            {
                id: "initiatives",
                label: "Iniciativas",
                href: "/initiatives",
                icon: Rocket,
                roles: ALL_ROLES,
            },
            {
                id: "work-items",
                label: "Work Items",
                href: "/work-items",
                icon: ListTodo,
                roles: ALL_ROLES,
            },
        ],
    },
    {
        id: "tracking",
        title: "Seguimiento",
        items: [
            {
                id: "checkins",
                label: "Check-ins",
                href: "/checkins",
                icon: ClipboardCheck,
                roles: ALL_ROLES,
            },
            {
                id: "evidence",
                label: "Evidencia",
                href: "/evidence",
                icon: FileText,
                roles: ALL_ROLES,
            },
        ],
    },
    {
        id: "governance",
        title: "Gobernanza",
        items: [
            {
                id: "risks",
                label: "Riesgos",
                href: "/risks",
                icon: AlertTriangle,
                roles: ALL_ROLES,
            },
            {
                id: "dependencies",
                label: "Dependencias",
                href: "/dependencies",
                icon: Link2,
                roles: ALL_ROLES,
            },
            {
                id: "budget",
                label: "Presupuesto",
                href: "/budget",
                icon: DollarSign,
                roles: ALL_ROLES,
            },
            {
                id: "decisions",
                label: "Decisiones",
                href: "/decisions",
                icon: FileCheck,
                roles: ALL_ROLES,
            },
        ],
    },
    {
        id: "admin",
        title: "Administración",
        items: [
            {
                id: "owners",
                label: "Usuarios",
                href: "/admin/owners",
                icon: Users,
                roles: ADMIN_ROLES,
            },
            {
                id: "areas",
                label: "Áreas",
                href: "/admin/areas",
                icon: Building2,
                roles: ADMIN_ROLES,
            },
            {
                id: "settings",
                label: "Configuración",
                href: "/admin/settings",
                icon: Settings,
                roles: ADMIN_ROLES,
            },
        ],
    },
];

/**
 * Filter navigation items based on user role
 */
export function getNavigationForRole(role: UserRole): NavSection[] {
    return navigation
        .map((section) => ({
            ...section,
            items: section.items.filter((item) => item.roles.includes(role)),
        }))
        .filter((section) => section.items.length > 0);
}
