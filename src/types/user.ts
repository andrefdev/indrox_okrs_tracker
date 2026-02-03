/**
 * User role types matching the OKR system's role-based access control
 */
export type UserRole =
    | "CEO"
    | "CMO"
    | "CTO"
    | "PM"
    | "DEV"
    | "DEVOPS"
    | "UI_DESIGNER";

/**
 * Role hierarchy for permission checks
 * Higher index = more permissions
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
    CEO: 100,
    CMO: 80,
    CTO: 80,
    PM: 60,
    DEV: 40,
    DEVOPS: 40,
    UI_DESIGNER: 40,
};

/**
 * Roles that have admin access
 */
export const ADMIN_ROLES: UserRole[] = ["CEO", "CTO", "PM"];

/**
 * Roles that can create/edit strategy items (objectives, KRs, initiatives)
 */
export const STRATEGY_ROLES: UserRole[] = ["CEO", "CMO", "CTO", "PM"];

/**
 * All roles (everyone can view)
 */
export const ALL_ROLES: UserRole[] = [
    "CEO",
    "CMO",
    "CTO",
    "PM",
    "DEV",
    "DEVOPS",
    "UI_DESIGNER",
];

/**
 * Owner record from core.owner table
 * This represents a user that has been enabled in the system
 */
export interface Owner {
    ownerKey: string;
    authUserId: string;
    fullName: string;
    email: string;
    role: UserRole;
    areaId?: string | null;
    isActive: boolean;
}

/**
 * Legacy User type (for backwards compatibility)
 * @deprecated Use Owner instead
 */
export interface User {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    areaId?: string;
    avatarUrl?: string;
}

/**
 * Check if a role has permission to access a feature
 */
export function hasPermission(
    userRole: UserRole,
    requiredRoles: UserRole[]
): boolean {
    return requiredRoles.includes(userRole);
}

/**
 * Check if a role is an admin role
 */
export function isAdmin(role: UserRole): boolean {
    return ADMIN_ROLES.includes(role);
}

/**
 * Check if a role can manage strategy items
 */
export function canManageStrategy(role: UserRole): boolean {
    return STRATEGY_ROLES.includes(role);
}
