"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { UserMenu } from "@/constants/user"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function NavSecondary({
  items,
  selectedItem,
  setSelectedItem,
  ...props
}: {
  items: UserMenu[]
  selectedItem: string
  setSelectedItem: (item: string) => void
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Usuario</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href="#">
                    <item.icon />
                    <span className={item.title === selectedItem ? "font-bold text-primary" : ""}>
                      {item.title}
                    </span>
                  </a>
                </SidebarMenuButton>
                {item.items?.some(subItem => subItem.show) && (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.filter(subItem => subItem.show).map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              asChild
                              onClick={() => {
                                console.log(subItem.title)
                                setSelectedItem(subItem.title)
                              }}
                            >
                              <a href="#">
                                <span className={subItem.title === selectedItem ? "font-bold text-primary" : ""}>
                                  {subItem.title}
                                </span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}