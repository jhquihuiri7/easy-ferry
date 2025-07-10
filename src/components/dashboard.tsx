'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const chartConfig = {
  views: {
    label: 'Ventas',
  },
  paid: {
    label: 'Pagado',
    color: 'hsl(var(--chart-1))',
  },
  unpaid: {
    label: 'No pagado',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

type TimeRange = "7d" | "15d" | "30d"

export function Dashboard() {
  const [chartData, setChartData] = React.useState<any[]>([])
  const [summaryValues, setSummaryValues] = React.useState([
    { period: { label: 'Pagados', value: 0 } },
    { period: { label: 'No pagados', value: 0 } },
  ])
  const [loading, setLoading] = React.useState(true)
  const [timeRange, setTimeRange] = React.useState<TimeRange>("30d")

  // Manejador para el cambio de rango de tiempo
  const handleTimeRangeChange = (value: string) => {
    if (value === "7d" || value === "15d" || value === "30d") {
      setTimeRange(value)
    }
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const now = new Date()
        const startDate = new Date(now)
        
        // Ajustamos la fecha de inicio según el rango seleccionado
        if (timeRange === "7d") {
          startDate.setDate(startDate.getDate() - 7)
        } else if (timeRange === "15d") {
          startDate.setDate(startDate.getDate() - 15)
        } else { // 30d
          startDate.setDate(startDate.getDate() - 30)
        }

        const formattedStartDate = formatDate(startDate)
        const formattedEndDate = formatDate(now)

        const response = await fetch(
          `https://easy-ferry.uc.r.appspot.com/get-sales-ferry?business=Gaviota&start_date=${formattedStartDate}&end_date=${formattedEndDate}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        const data = Array.isArray(result.data) ? result.data : [result.data]

        const processedData = processChartData(data, timeRange)
        setChartData(processedData)

        const paidTotal = data.reduce((sum: number, item: any) => 
          item.payed === 'Si' ? sum + (item.price || 0) : sum, 0)
        
        const unpaidTotal = data.reduce((sum: number, item: any) => 
          item.payed !== 'Si' ? sum + (item.price || 0) : sum, 0)
        
        setSummaryValues([
          { period: { label: 'Pagados', value: paidTotal } },
          { period: { label: 'No pagados', value: unpaidTotal } },
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
        setChartData([])
        setSummaryValues([
          { period: { label: 'Pagados', value: 0 } },
          { period: { label: 'No pagados', value: 0 } },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const processChartData = (data: any[], range: TimeRange) => {
    const days = range === "7d" ? 7 : range === "15d" ? 15 : 30
    const today = new Date()
    const dateMap: Record<string, { date: string; paid: number; unpaid: number }> = {}

    // Inicializamos todas las fechas del rango con valores en 0
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = formatDate(date)
      dateMap[dateStr] = { date: dateStr, paid: 0, unpaid: 0 }
    }

    // Procesamos los datos reales
    data.forEach((item: any) => {
      if (!item.date) return

      const dateStr = item.date
      if (dateMap[dateStr]) {
        if (item.payed?.trim().toLowerCase() === 'si') {
          dateMap[dateStr].paid += item.price || 0
        } else {
          dateMap[dateStr].unpaid += item.price || 0
        }
      }
    })

    // Convertimos a array y ordenamos por fecha
    return Object.values(dateMap).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
  }

  return (
    <main className="min-h-screen p-4">
      <Card className="h-[500px] w-full overflow-hidden"> {/* Añadido overflow-hidden */}
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-3 sm:py-3">
            <CardTitle>Panel de gráficos</CardTitle>
            <CardDescription>
              Mostrando ventas de los últimos {timeRange === "7d" ? "7" : timeRange === "15d" ? "15" : "30"} días
            </CardDescription>
          </div>
          <div className="flex">
            {summaryValues.map((item) => (
              <button
                key={item.period.label}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-2 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-4"
              >
                <span className="text-xs text-muted-foreground">{item.period.label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  ${item.period.value.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-120px)] px-2 sm:p-6"> {/* Ajuste de altura */}
          {loading ? (
            <div className="flex h-full items-center justify-center">Cargando datos...</div>
          ) : chartData.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <div className="flex flex-col h-full">
                <div className="flex justify-end mb-4">
                  <Select 
                    value={timeRange} 
                    onValueChange={handleTimeRangeChange} // Usamos el manejador corregido
                  >
                    <SelectTrigger className="w-[160px] rounded-lg">
                      <SelectValue placeholder="Seleccione rango" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="30d" className="rounded-lg">
                        Últimos 30 días
                      </SelectItem>
                      <SelectItem value="15d" className="rounded-lg">
                        Últimos 15 días
                      </SelectItem>
                      <SelectItem value="7d" className="rounded-lg">
                        Últimos 7 días
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-h-0"> {/* Contenedor flexible para el gráfico */}
                  <ResponsiveContainer width="100%" height="55%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="fillPaid" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-paid)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-paid)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient id="fillUnpaid" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-unpaid)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-unpaid)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={8}
                        tickFormatter={(value) => {
                          const [year, month, day] = value.split('-')
                          return `${day}/${month}`
                        }}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            labelFormatter={(value) => {
                              const [year, month, day] = value.split('-')
                              return `${day}/${month}/${year}`
                            }}
                            indicator="dot"
                          />
                        }
                      />
                      <Area
                        dataKey="unpaid"
                        type="natural"
                        fill="url(#fillUnpaid)"
                        stroke="var(--color-unpaid)"
                        stackId="a"
                      />
                      <Area
                        dataKey="paid"
                        type="natural"
                        fill="url(#fillPaid)"
                        stroke="var(--color-paid)"
                        stackId="a"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </ChartContainer>
          ) : (
            <div className="flex h-full items-center justify-center">No hay datos disponibles</div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}