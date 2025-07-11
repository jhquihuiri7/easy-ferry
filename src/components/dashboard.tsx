'use client'

import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from 'recharts'
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const barChartConfig = {
  views: {
    label: 'Ventas',
  },
  paid: {
    label: 'Pagado',
    color: '#808080', // Gris
  },
  unpaid: {
    label: 'No pagado',
    color: '#000000', // Negro
  },
} satisfies ChartConfig

const radialChartConfig = {
  paid: {
    label: "Pagado",
    color: "#808080", // Gris
  },
  unpaid: {
    label: "No pagado",
    color: "#000000", // Negro
  },
} satisfies ChartConfig

type TimeRange = "7d" | "15d" | "30d"

export function Dashboard() {
  const [chartData, setChartData] = React.useState<any[]>([])
  const [paidCount, setPaidCount] = React.useState(0)
  const [unpaidCount, setUnpaidCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [timeRange, setTimeRange] = React.useState<TimeRange>("30d")

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

        // Contar reservas en lugar de sumar montos
        const paid = data.filter((item: any) => item.payed?.trim().toLowerCase() === 'si').length
        const unpaid = data.filter((item: any) => item.payed?.trim().toLowerCase() !== 'si').length
        
        setPaidCount(paid)
        setUnpaidCount(unpaid)
      } catch (error) {
        console.error('Error fetching data:', error)
        setChartData([])
        setPaidCount(0)
        setUnpaidCount(0)
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

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = formatDate(date)
      dateMap[dateStr] = { date: dateStr, paid: 0, unpaid: 0 }
    }

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

    return Object.values(dateMap).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
  }

  const radialData = [{
    name: "reservas",
    paid: paidCount,
    unpaid: unpaidCount
  }]

  const totalReservations = paidCount + unpaidCount

  return (
    <main className="min-h-screen p-4">
      <Card className="h-[500px] w-full overflow-hidden">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-3 sm:py-3">
            <CardTitle>Panel de gráficos</CardTitle>
            <CardDescription>
              Mostrando ventas de los últimos {timeRange === "7d" ? "7" : timeRange === "15d" ? "15" : "30"} días
            </CardDescription>
          </div>
          <div className="flex h-[100px] w-full sm:w-[250px]">
            <ChartContainer
              config={radialChartConfig}
              className="mx-auto aspect-auto w-full h-[200px]"
            >
              <RadialBarChart
                data={radialData}
                endAngle={180}
                innerRadius={80}
                outerRadius={130}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 16}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {totalReservations.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 4}
                              className="fill-muted-foreground"
                            >
                              Total Reservas
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar
                  dataKey="paid"
                  stackId="a"
                  cornerRadius={5}
                  fill="#808080"
                  className="stroke-transparent stroke-2"
                />
                <RadialBar
                  dataKey="unpaid"
                  fill="#000000"
                  stackId="a"
                  cornerRadius={5}
                  className="stroke-transparent stroke-2"
                />
              </RadialBarChart>
            </ChartContainer>
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-120px)] px-2 sm:p-6">
          {loading ? (
            <div className="flex h-full items-center justify-center">Cargando datos...</div>
          ) : chartData.length > 0 ? (
            <ChartContainer config={barChartConfig} className="aspect-auto h-[300px] w-full">
              <div className="flex flex-col h-full">
                <div className="flex justify-start mb-4">
                  <Select 
                    value={timeRange} 
                    onValueChange={handleTimeRangeChange}
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
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer>
                    <BarChart data={chartData}>
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
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar
                        dataKey="unpaid"
                        stackId="a"
                        fill="#000000" // Negro
                        radius={[4, 4, 4, 4]}
                      />
                      <Bar
                        dataKey="paid"
                        stackId="a"
                        fill="#808080" // Gris
                        radius={[4, 4, 4, 4]}
                      />
                    </BarChart>
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