"use client"
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { SellCard } from "@/components/sell-card";
import { SellsTable } from "@/components/sells-table";
import { SellsTableBase } from "@/components/sells-table-base";
import { toast, Toaster } from "sonner"; // ✅ Importar toast

type VariableType = "opcion1" | "opcion2" | "opcion3" | "opcion4";

const Componente1 = () => <Dashboard />;
const Componente2 = () => <SellCard />;
const Componente3 = () => <SellsTable />;
const Componente4 = () => <SellsTableBase />;

const componenteMapa: Record<VariableType, React.FC> = {
  opcion1: Componente1,
  opcion2: Componente2,
  opcion3: Componente3,
  opcion4: Componente4,
};

const MapaComponentes = ({ variable }: { variable: VariableType }) => {
  const ComponenteSeleccionado = componenteMapa[variable] || Componente1;
  return <ComponenteSeleccionado />;
};

export default function Page() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<string>("Panel Principal");
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const business = localStorage.getItem("easyferry-business");
      if (!business) {
        console.error("No business found in localStorage");
        return;
      }

      const response = await fetch(`https://easy-ferry.uc.r.appspot.com/get-notifications?business=${business}`, {
        method: "GET",
        headers: {
          "Content-Type": "text/plain",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const notifs = data.notifications;

      if (notifs && notifs.length > 0) {
        console.log("Notificaciones recibidas:", notifs);

        const primera = notifs[0]; // Puedes personalizar esto si quieres mostrar más de una

        toast("Nueva notificación", {
          description: `${primera.message} (${primera.date})`,
          action: {
            label: "Ver",
            onClick: () => console.log("Ver notificaciones"),
          },
        });
      }

      setNotifications(notifs);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  fetchNotifications();
}, [router]);


  const opcionesValidas: Record<string, VariableType> = {
    "Panel Principal": "opcion1",
    "Ventas": "opcion2",
    "Reportes": "opcion3",
    "Base": "opcion4",
  };

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} notifications={notifications}/>
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <h1>{selectedItem}</h1>
              <MapaComponentes variable={opcionesValidas[selectedItem]} />
              <Toaster position="top-right" />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
