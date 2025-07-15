"use client"

import * as React from "react"
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function DownloadsPage() {
  const [fileType, setFileType] = React.useState("xlsx")
  const [isDownloading, setIsDownloading] = React.useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const businessName = localStorage.getItem("easyferry-business") || ""
      
      if (!businessName) {
        toast.error("Error al descargar el archivo", {
          description: "No se encontró el nombre del negocio en el almacenamiento local",
        })
        return
      }

      const response = await fetch(
        `https://easy-ferry.uc.r.appspot.com/get-all-sales?business=${encodeURIComponent(businessName)}&format=${fileType}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || "Error desconocido"
        toast.error("Error al descargar el archivo", {
          description: `Código ${response.status}: ${errorMessage}`,
        })
        return
      }

      // Obtener el nombre del archivo del header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `ventas_${businessName}.${fileType}`
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1]
        }
      }

      // Obtener el blob del archivo
      const blob = await response.blob()
      
      // Crear un enlace de descarga
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      
      // Simular click en el enlace
      document.body.appendChild(link)
      link.click()
      
      // Limpiar
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      toast.success("Descarga completada", {
        description: `El archivo ${filename} se ha descargado correctamente`
      })
      
    } catch (error) {
      console.error("Error al descargar:", error)
      toast.error("Error al descargar el archivo", {
        description: "Ocurrió un error inesperado al intentar descargar el archivo"
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Descargas</h2>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-6 w-6" />
            Descargar información
          </CardTitle>
          <CardDescription>
            Exporta tus datos en diferentes formatos para análisis y respaldo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Formato de archivo</Label>
            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xlsx">
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel (.xlsx)
                  </span>
                </SelectItem>
                <SelectItem value="csv">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV (.csv)
                  </span>
                </SelectItem>
                <SelectItem value="json">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON (.json)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  Descargando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Descargar ahora
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}