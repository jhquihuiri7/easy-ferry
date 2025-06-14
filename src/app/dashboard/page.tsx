"use client"
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { SellCard } from "@/components/sell-card";
import { SellsTable } from "@/components/sells-table";


type VariableType = "opcion1" | "opcion2"| "opcion3";// | "opcion4";

const Componente1 = () => <Dashboard/>;
const Componente2 = () => <SellCard/>;
const Componente3 = () => <SellsTable/>;
//const Componente4 = () => <DataTableUsers/>;



const componenteMapa: Record<VariableType, React.FC> = {
  opcion1: Componente1,
  opcion2: Componente2,
  opcion3: Componente3,
  //opcion4: Componente4
};

const MapaComponentes = ({ variable }: { variable: VariableType }) => {
  const ComponenteSeleccionado = componenteMapa[variable] || Componente1;
  return <ComponenteSeleccionado />;
};



export default function Page() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<string>("Panel Principal");

  
useEffect(() => {


}, [router]);

  const opcionesValidas: Record<string, VariableType> = {
    "Panel Principal": "opcion1",
    "Ventas": "opcion2",
    "Reportes": "opcion3",
  };

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <h1>{selectedItem}</h1>
              <MapaComponentes variable={opcionesValidas[selectedItem]}/>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
