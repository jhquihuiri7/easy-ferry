"use client"

import * as React from "react"
import {
  Ship,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { NavMenuManager, Menu } from "@/constants/menu"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  notifications: any[]; // ✅ Agregado
}

export function AppSidebar({ selectedItem, setSelectedItem, notifications, ...props }: AppSidebarProps) {
  const [email, setEmail] = React.useState<string | null>(null);
  const [navMain, setNavMain] = React.useState<Menu[]>([]);
  const [business, setBusiness] = React.useState("")

  React.useEffect(() => {
    const menuManager = new NavMenuManager("owner");
    setNavMain(menuManager.getNavMenu());
    const business = localStorage.getItem("easyferry-business") || "";
    setBusiness(business);
  }, []);

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Ship className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{business}</span>
                  <span className="truncate text-xs">Agencia de Ferry</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser notifications={notifications} /> {/* ✅ Se pasan aquí */}
      </SidebarFooter>
    </Sidebar>
  );
}
