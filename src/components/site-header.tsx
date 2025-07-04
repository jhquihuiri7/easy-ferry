"use client"

import { SidebarIcon, MessageCircle, Bell } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
  id: string;
  message: string;
  date: string;
  read?: boolean; // Opcional para compatibilidad
}

interface SiteHeaderProps {
  notifications?: Notification[]; // Notificaciones como prop opcional
}

export function SiteHeader({ notifications = [] }: SiteHeaderProps) {
  const { toggleSidebar } = useSidebar()

  // Calcula la cantidad de notificaciones no leídas
  const unreadCount = notifications.filter(n => !n?.read).length

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex w-full justify-between items-center gap-2 px-4">
        <div className="flex h-(--header-height) items-center gap-2 px-4">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <SidebarIcon />
          </Button>
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">
                  Easy-Ferry
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Administra tu empresa</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <MessageCircle />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <div className="p-2 font-medium">Notificaciones</div>
              <Separator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className={`flex flex-col items-start ${!notification.read ? 'bg-gray-50' : ''}`}
                  >
                    <div className="font-medium">{notification.message}</div>
                    <div className="text-xs text-gray-500">{notification.date}</div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="text-gray-500">
                  No hay notificaciones
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}