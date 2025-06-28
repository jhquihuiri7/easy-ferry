'use client'

import dynamic from 'next/dynamic'
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

import 'mapbox-gl/dist/mapbox-gl.css'

const MapWithMarkers = dynamic(() => import('@/components/map'), {
  ssr: false,
})

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

export function Dashboard() {
  const [chartData, setChartData] = React.useState<any[]>([])
  const [summaryValues, setSummaryValues] = React.useState([
    { period: { label: 'Pagados', value: 0 } },
    { period: { label: 'No pagados', value: 0 } },
  ])
  const [loading, setLoading] = React.useState(true)
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const startDate = formatDate(firstDay)
        const endDate = formatDate(lastDay)

        const response = await fetch(
          `https://easy-ferry.uc.r.appspot.com/get-sales-ferry?business=Gaviota&start_date=${startDate}&end_date=${endDate}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        console.log(result)
        const data = Array.isArray(result.data) ? result.data : [result.data]

        const processedData = processChartData(data)
        setChartData(processedData)

        const paidTotal = data.reduce((sum: number, item: any) => 
          item.payed === 'Si' ? sum + (item.price || 0) : sum, 0);
        
        const unpaidTotal = data.reduce((sum: number, item: any) => 
          item.payed !== 'Si' ? sum + (item.price || 0) : sum, 0);
        
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
  }, [])

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const processChartData = (data: any[]) => {
    const groupedData: Record<string, { date: string; paid: number; unpaid: number }> = {}

    data.forEach((item: any) => {
      if (!item.date) return

      // Usamos la fecha exacta como viene del response sin modificaciones
      const date = item.date
      if (!groupedData[date]) {
        groupedData[date] = { date, paid: 0, unpaid: 0 }
      }

      if (item.payed?.trim().toLowerCase() === 'si') {
        groupedData[date].paid += item.price || 0
      } else {
        groupedData[date].unpaid += item.price || 0
      }
    })

    // Convertir a array y ordenar por fecha (de menor a mayor)
    const sortedData = Object.values(groupedData).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

    return sortedData
  }

  const filteredData = chartData.filter((item) => {
    if (timeRange === "30d") return true
    
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 30
    if (timeRange === "15d") {
      daysToSubtract = 15
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Dashboard */}
      <div className="p-4">
        <Card className="h-[500px]">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-3 sm:py-3">
              <CardTitle>Panel de gráficos</CardTitle>
              <CardDescription>Mostrando ventas del mes actual</CardDescription>
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
          <CardContent className="px-2 sm:p-6">
            <div className="aspect-auto h-[250px] w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center">Cargando datos...</div>
              ) : chartData.length > 0 ? (
                <ChartContainer config={chartConfig}>
                  <div className='w-full h-full'>
                  <div className="flex justify-end mb-4">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-[160px] rounded-lg">
                        <SelectValue placeholder="Todos los datos" />
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
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredData}>
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
                        minTickGap={32}
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
                </ChartContainer>
              ) : (
                <div className="flex h-full items-center justify-center">No hay datos disponibles</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mapa */}
      <div className="p-4">
        <MapWithMarkers />
      </div>
    </main>
  )
}