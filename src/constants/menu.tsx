import { SquareTerminal, Bot, BookOpen } from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
  show?: boolean;
}

export interface Menu {
  title: string;
  url: string;
  icon: React.ComponentType;
  isActive?: boolean;
  items?: MenuItem[];
}

export class NavMenuManager {
  private role: string;
  private navMenu: Menu[];
  private validRolesMap: Record<string, string[]>;

  constructor(role: string) {
    this.role = role;
    this.navMenu = [
      {
        title: "Dashboard",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          { title: "Panel Principal", url: "/panel-principal" },
          { title: "Ventas", url: "/ventas" },
          { title: "Reportes", url: "/reportes" },
          { title: "Otros", url: "/otros" }
        ],
      }
    ];
    this.validRolesMap = {
      "Panel Principal": ["owner"],
      "Restaurantes": ["owner"],
      "Ventas": ["owner"],
      "Reportes": ["owner"],
      "Otros": ["owner"],
      "Usuarios": ["owner","admin"],
      "Equipo": ["owner"],
      "Administrar Menu": ["owner"],
      "Mesas": ["owner"],
      "Pedidos": ["owner"]
    };
    this.updateShowStatus();
  }

  private updateShowStatus(): void {
    this.navMenu.forEach(menu => {
      if (menu.items) {
        menu.items.forEach(item => {
          item.show = this.validRolesMap[item.title]?.includes(this.role) || false;
        });
      }
    });
  }

  getNavMenu(): Menu[] {
    return this.navMenu;
  }
}
