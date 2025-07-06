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
import { toast, Toaster } from "sonner";
import { Pagos } from "@/components/pagos";
import { Cuenta } from "@/components/cuenta";

type VariableType = "opcion1" | "opcion2" | "opcion3" | "opcion4" | "opcion5" | "opcion6" ;

const Componente1 = () => <Dashboard />;
const Componente2 = () => <SellCard />;
const Componente3 = () => <SellsTable/>;
const Componente4 = () => <SellsTableBase />;
const Componente5 = () => <Cuenta />;
const Componente6 = () => <Pagos />;

const componenteMapa: Record<VariableType, React.FC> = {
  opcion1: Componente1,
  opcion2: Componente2,
  opcion3: Componente3,
  opcion4: Componente4,
  opcion5: Componente5,
  opcion6: Componente6,
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

        const unreadNotifs = notifs.filter((notif: { read: boolean }) => !notif.read);
        console.log(unreadNotifs);
        
        unreadNotifs.forEach((notif: any) => {
          toast("Nueva notificación", {
            description: `${notif.message} (${notif.date})`, 
            action: {
              label: "Marcar como leída",
              onClick: async () => {
                try {
                  const response = await fetch('https://easy-ferry.uc.r.appspot.com/mark-as-read-notifications', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      notification_id: notif.id
                    })
                  });
                
                  const data = await response.json();
                
                  if (!response.ok) {
                    throw new Error(data.error || 'Error al marcar como leída');
                  }
                
                } catch (error) {
                  console.error('Error:', error);
                  toast.error("Error al marcar la notificación como leída");
                }
              }
            },
          });
        });

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
    "Otros": "opcion4",
    "Cuenta": "opcion5",
    "Pagos": "opcion6",
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 14)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" selectedItem={selectedItem} setSelectedItem={setSelectedItem} notifications={notifications} />
      <SidebarInset>
        <SiteHeader notifications={notifications}/>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <h1 className="px-4 lg:px-6">{selectedItem}</h1>
              <div className="px-4 lg:px-6 overflow-x-auto">
                <MapaComponentes variable={opcionesValidas[selectedItem]} />
              </div>
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
      </SidebarInset>
    </SidebarProvider>
  );
}