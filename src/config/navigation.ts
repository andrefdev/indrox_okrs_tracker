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

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
    roles: UserRole[];
    badge?: string;
}

export interface NavSection {
    id: string;
    title: string;
    icon: LucideIcon;
    items: NavItem[];
    href?: string;
    roles: UserRole[];
    defaultCollapsed?: boolean;
}

export const navigation: NavSection[] = [
    {
        id: "dashboard",
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        roles: ALL_ROLES,
        items: [],
    },
    {
        id: "okr",
        title: "OKRs",
        icon: Target,
        roles: ALL_ROLES,
        items: [
            { id: "cycles", label: "Ciclos", href: "/cycles", icon: Calendar, roles: ALL_ROLES },
            { id: "objectives", label: "Objetivos", href: "/objectives", icon: Target, roles: ALL_ROLES },
            { id: "initiatives", label: "Iniciativas", href: "/initiatives", icon: Rocket, roles: ALL_ROLES },
            { id: "work-items", label: "Work Items", href: "/work-items", icon: ListTodo, roles: ALL_ROLES },
        ],
    },
    {
        id: "tracking",
        title: "Seguimiento",
        icon: ClipboardCheck,
        roles: ALL_ROLES,
        defaultCollapsed: true,
        items: [
            { id: "checkins", label: "Check-ins", href: "/checkins", icon: ClipboardCheck, roles: ALL_ROLES },
            { id: "evidence", label: "Evidencia", href: "/evidence", icon: FileText, roles: ALL_ROLES },
        ],
    },
    {
        id: "governance",
        title: "Gobernanza",
        icon: AlertTriangle,
        roles: ALL_ROLES,
        defaultCollapsed: true,
        items: [
            { id: "risks", label: "Riesgos", href: "/risks", icon: AlertTriangle, roles: ALL_ROLES },
            { id: "dependencies", label: "Dependencias", href: "/dependencies", icon: Link2, roles: ALL_ROLES },
            { id: "budget", label: "Presupuesto", href: "/budget", icon: DollarSign, roles: ALL_ROLES },
            { id: "decisions", label: "Decisiones", href: "/decisions", icon: FileCheck, roles: ALL_ROLES },
        ],
    },
    {
        id: "admin",
        title: "Admin",
        icon: Settings,
        roles: ADMIN_ROLES,
        defaultCollapsed: true,
        items: [
            { id: "owners", label: "Usuarios", href: "/admin/owners", icon: Users, roles: ADMIN_ROLES },
            { id: "areas", label: "Áreas", href: "/admin/areas", icon: Building2, roles: ADMIN_ROLES },
            { id: "settings", label: "Configuración", href: "/admin/settings", icon: Settings, roles: ADMIN_ROLES },
        ],
    },
];

export function getNavigationForRole(role: UserRole): NavSection[] {
    return navigation
        .filter((section) => section.roles.includes(role))
        .map((section) => ({
            ...section,
            items: section.items.filter((item) => item.roles.includes(role)),
        }));
}
