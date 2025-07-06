"use client"

export function Pagos() {
  return (
    <div className="flex flex-col items-center justify-start pt-8 min-h-[calc(100vh-var(--header-height))]">
      <h1 className="text-3xl font-bold mb-8 text-center">Pagos</h1>
      
      <div className="w-full max-w-4xl p-4">
        <div className="border rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Gestión de Pagos</h2>
          <p className="text-muted-foreground">
            Aquí puedes gestionar todos tus pagos y transacciones
          </p>
          
          {/* Example payment content */}
          <div className="mt-8 space-y-4">
            <div className="border p-4 rounded-md">
              <h3 className="font-medium">Pago #001</h3>
              <p className="text-sm text-muted-foreground">$100.00 - 15/06/2023</p>
            </div>
            <div className="border p-4 rounded-md">
              <h3 className="font-medium">Pago #002</h3>
              <p className="text-sm text-muted-foreground">$150.00 - 20/06/2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}