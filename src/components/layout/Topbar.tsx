"use client";

import { Menu, Search, Moon, Sun, Bell, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { Button, Input, Avatar, Popover } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface TopbarProps {
    onMenuClick: () => void;
    sidebarCollapsed: boolean;
}

export function Topbar({ onMenuClick }: TopbarProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Only show theme toggle after mounting to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    // Placeholder user data - replace with actual auth context
    const user = {
        name: "John Doe",
        email: "john@example.com",
        role: "CEO",
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-default-200 bg-background/80 px-4 backdrop-blur-md md:px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    onPress={onMenuClick}
                    className="lg:hidden"
                    aria-label="Abrir menú"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Search */}
                <div className="hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-default-400" />
                        <Input
                            type="search"
                            placeholder="Buscar... (⌘K)"
                            className="w-64 pl-9 lg:w-80"
                            aria-label="Buscar"
                        />
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
                {/* Mobile Search Button */}
                <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    aria-label="Buscar"
                >
                    <Search className="h-5 w-5" />
                </Button>

                {/* Theme Toggle */}
                {mounted && (
                    <Button
                        isIconOnly
                        variant="ghost"
                        size="sm"
                        onPress={toggleTheme}
                        aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                    >
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>
                )}

                {/* Notifications */}
                <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    aria-label="Notificaciones"
                    className="relative"
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-medium text-white">
                        3
                    </span>
                </Button>

                {/* User Menu */}
                <Popover>
                    <Popover.Trigger>
                        <Button variant="ghost" className="gap-2 px-2">
                            <Avatar>
                                <Avatar.Fallback>{user.name.split(" ").map(n => n[0]).join("")}</Avatar.Fallback>
                            </Avatar>
                            <div className="hidden flex-col items-start md:flex">
                                <span className="text-sm font-medium">{user.name}</span>
                                <span className="text-xs text-default-400">{user.role}</span>
                            </div>
                            <ChevronDown className="hidden h-4 w-4 text-default-400 md:block" />
                        </Button>
                    </Popover.Trigger>
                    <Popover.Content className="w-56 p-1">
                        <div className="border-b border-default-100 px-3 py-2">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-default-400">{user.email}</p>
                        </div>
                        <div className="p-1">
                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-default-100">
                                <User className="h-4 w-4" />
                                Mi Perfil
                            </button>
                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-default-100">
                                <Settings className="h-4 w-4" />
                                Configuración
                            </button>
                        </div>
                        <div className="border-t border-default-100 p-1">
                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger/10">
                                <LogOut className="h-4 w-4" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </Popover.Content>
                </Popover>
            </div>
        </header>
    );
}
