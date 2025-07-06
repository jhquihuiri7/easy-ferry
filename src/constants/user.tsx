import { SquareTerminal, Bot, BookOpen } from "lucide-react";

interface UserMenuItem {
  title: string;
  url: string;
  show?: boolean;
}

export interface UserMenu {
  title: string;
  url: string;
  icon: React.ComponentType;
  isActive?: boolean;
  items?: UserMenuItem[];
}

export class NavUserManager {
  private role: string;
  private navUser: UserMenu[];
  private validUserRolesMap: Record<string, string[]>;

  constructor(role: string) {
    this.role = role;
    this.navUser = [
      {
        title: "Dashboard Usuario",
        url: "#",
        icon: BookOpen,
        isActive: true,
        items: [
          { title: "Cuenta", url: "/cuenta" },
          { title: "Pagos", url: "/pagos" }
        ],
      }
    ];
    this.validUserRolesMap = {
      "Cuenta": ["owner", "admin"],
      "Pagos": ["owner", "admin"]
    };
    this.updateUserShowStatus();
  }

  private updateUserShowStatus(): void {
    this.navUser.forEach(menu => {
      if (menu.items) {
        menu.items.forEach(item => {
          item.show = this.validUserRolesMap[item.title]?.includes(this.role) || false;
        });
      }
    });
  }

  getNavUser(): UserMenu[] {
    return this.navUser;
  }
}
