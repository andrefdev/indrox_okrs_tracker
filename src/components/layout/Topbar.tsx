"use client";

import { Menu, Moon, Sun, LogOut, ChevronDown } from "lucide-react";
import { Button, Avatar, Popover } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface UserData {
    name: string;
    email: string;
    role: string;
}

interface TopbarProps {
    onMenuClick: () => void;
    sidebarCollapsed: boolean;
    user: UserData;
}

export function Topbar({ onMenuClick, user }: TopbarProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-default-200 bg-background/80 px-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    onPress={onMenuClick}
                    className="lg:hidden"
                    aria-label="Abrir menú"
                >
                    <Menu className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1">
                {mounted && (
                    <Button
                        isIconOnly
                        variant="ghost"
                        size="sm"
                        onPress={toggleTheme}
                        aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"}
                    >
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                )}

                <Popover>
                    <Popover.Trigger>
                        <Button variant="ghost" className="gap-2 px-2" size="sm">
                            <Avatar size="sm">
                                <Avatar.Fallback className="text-xs">{user.name.split(" ").map(n => n[0]).join("")}</Avatar.Fallback>
                            </Avatar>
                            <span className="hidden text-sm font-medium md:block">{user.name}</span>
                            <ChevronDown className="hidden h-3 w-3 text-default-400 md:block" />
                        </Button>
                    </Popover.Trigger>
                    <Popover.Content className="w-48 p-1">
                        <div className="border-b border-default-100 px-3 py-2">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-default-400">{user.email}</p>
                        </div>
                        <div className="border-t border-default-100 p-1">
                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-danger hover:bg-danger/10">
                                <LogOut className="h-3.5 w-3.5" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </Popover.Content>
                </Popover>
            </div>
        </header>
    );
}
