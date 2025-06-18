import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { DatabaseIndicator } from "@/components/DatabaseIndicator";
import { Home, FileText, DollarSign } from "lucide-react";

const menuItems = [
    {
        title: "titleHomePage",
        url: "/",
        icon: Home,
    },
    {
        title: "titleSecondPage",
        url: "/second-page",
        icon: FileText,
    },
    {
        title: "Transactions",
        url: "/transactions",
        icon: DollarSign,
    },
];

export function AppSidebar() {
    const { t } = useTranslation();
    const location = useLocation();

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title === "Transactions" ? item.title : t(item.title)}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <DatabaseIndicator />
            </SidebarFooter>
        </Sidebar>
    );
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 flex flex-col min-h-screen">
                <div className="flex items-center p-2 border-b">
                    <SidebarTrigger />
                    <h1 className="ml-2 font-semibold">Expenses</h1>
                </div>
                <div className="flex-1 p-4">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}
