"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
} from "lucide-react"
import { toast, Toaster } from "sonner"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface NavUserProps {
  notifications: any[]
}

export function NavUser({ notifications }: NavUserProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const [user, setUser] = useState({
    name: "",
    email: "",
  })

  useEffect(() => {
    const name = localStorage.getItem("easyferry-name") || ""
    const email = localStorage.getItem("easyferry-email") || ""

    setUser({ name, email })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("easyferry-token")
    localStorage.removeItem("easyferry-email")
    localStorage.removeItem("easyferry-name")
    localStorage.removeItem("easyferry-business")
    router.push("/")
  }

  const handleShowNotifications = () => {
    if (notifications.length === 0) {
      return
    }

    notifications.forEach((notif, index) => {
      toast(`Notificación ${index + 1}`, {
        description: `${notif.message} (${notif.date})`,
        action: {
          label: "Cerrar",
          onClick: () => console.log("Notificación cerrada"),
        },
      })
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={""} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name
                    ? user.name.split(" ").map(word => word[0]).join("")
                    : "CN"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      ? user.name.split(" ").map(word => word[0]).join("")
                      : "CN"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck color="#00e600" />
                Cuenta
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Pagos
              </DropdownMenuItem>
              <DropdownMenuItem className="relative" onClick={handleShowNotifications}>
                <Bell />
                Notificaciones
                {notifications.length > 0 && (
                  <span className="absolute right-2 top-2 inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                    {notifications.length}
                  </span>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
