"use client"

import { LogOut } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function NavUser() {
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

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center w-full">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex-1"
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
          </SidebarMenuButton>
          <button 
            onClick={handleLogout}
            className="ml-2 p-2 hover:bg-gray-100 rounded-full"
            aria-label="Cerrar sesión"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}