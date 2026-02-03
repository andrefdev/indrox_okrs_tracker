"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useState } from "react";

interface UserData {
    name: string;
    email: string;
    role: string;
}

interface AppShellProps {
    children: React.ReactNode;
    user: UserData;
}

export function AppShell({ children, user }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-default-50 dark:bg-default-50">
            {/* Desktop Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-40 h-screen transition-transform duration-300 ease-in-out ${sidebarOpen ? "w-[260px]" : "w-[72px]"
                    } hidden lg:block`}
            >
                <Sidebar
                    collapsed={!sidebarOpen}
                    onToggle={() => setSidebarOpen(!sidebarOpen)}
                />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-40 h-screen w-[260px] transition-transform duration-300 ease-in-out lg:hidden ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <Sidebar
                    collapsed={false}
                    onToggle={() => setMobileSidebarOpen(false)}
                />
            </aside>

            {/* Main Content Area */}
            <div
                className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-[260px]" : "lg:ml-[72px]"
                    }`}
            >
                <Topbar
                    onMenuClick={() => setMobileSidebarOpen(true)}
                    sidebarCollapsed={!sidebarOpen}
                    user={user}
                />
                <main className="min-h-[calc(100vh-64px)] p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
