'use client'
import * as React from 'react'
import { Cell, Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from 'recharts'
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

const ferry_1_capacity = 40
const WARNING_THRESHOLD = 0.8 // 80% de capacidad

const reservationsChartConfig = {
  views: {
    label: 'Reservas',
  },
  reservations: {
    label: 'Reservas',
    color: '#2b7fff',
  },
  available: {
    label: 'Disponible',
    color: '#8ec5ff',
  },
  warning: {
    label: 'Alta demanda',
    color: '#ff4d4f',
  },
} satisfies ChartConfig


const barChartConfig = {
  views: {
    label: 'Ventas',
  },
  paid: {
    label: 'Pagado',
    color: '#2b7fff',
  },
  unpaid: {
    label: 'No pagado',
    color: '#8ec5ff',
  },
} satisfies ChartConfig

const radialChartConfig = {
  paid: {
    label: "Pagado",
    color: "#2b7fff",
  },
  unpaid: {
    label: "No pagado",
    color: "#8ec5ff",
  },
} satisfies ChartConfig

interface Ferry {
  id: string | number;
  ferry_name: string;
}


type TimeRange = "7d" | "15d" | "30d" | "next7d" | "next30d" | "next90d"

export function Dashboard() {
  const [chartData, setChartData] = React.useState<any[]>([])
  const [allReservationsData, setAllReservationsData] = React.useState<any[]>([])
  const [paidCount, setPaidCount] = React.useState(0)
  const [unpaidCount, setUnpaidCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [timeRange, setTimeRange] = React.useState<TimeRange>("30d")
  const [ferries, setFerries] = React.useState<Ferry[]>([])

  const handleTimeRangeChange = (value: string) => {
    if (value === "7d" || value === "15d" || value === "30d" || value === "next7d" || value === "next30d" || value === "next90d") {
      setTimeRange(value)
    }
  }

  React.useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true)
        const business = localStorage.getItem('easyferry-business')
        if (!business) {
          throw new Error('No business found in localStorage')
        }

        const now = new Date()
        let startDate = new Date(now)
        let endDate = new Date(now)
        
        if (timeRange === "7d") {
          startDate.setDate(startDate.getDate() - 7)
        } else if (timeRange === "15d") {
          startDate.setDate(startDate.getDate() - 15)
        } else if (timeRange === "30d") {
          startDate.setDate(startDate.getDate() - 30)
        } else if (timeRange === "next7d") {
          endDate.setDate(endDate.getDate() + 7)
        } else if (timeRange === "next30d") {
          endDate.setDate(endDate.getDate() + 30)
        } else if (timeRange === "next90d") {
          endDate.setDate(endDate.getDate() + 90)
        }

        const formattedStartDate = formatDate(timeRange.startsWith("next") ? now : startDate)
        const formattedEndDate = formatDate(timeRange.startsWith("next") ? endDate : now)

        const response = await fetch(
          `https://easy-ferry.uc.r.appspot.com/get-sales-ferry?business=${encodeURIComponent(business)}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        const data = Array.isArray(result.data) ? result.data : [result.data]

        const processedData = processChartData(data, timeRange)
        setChartData(processedData)

        const reservationsData = processReservationsData(data, timeRange)
        setAllReservationsData(data) // Guardamos todos los datos para filtrar después

        const paid = data.filter((item: any) => item.payed?.trim().toLowerCase() === 'si').length
        const unpaid = data.filter((item: any) => item.payed?.trim().toLowerCase() !== 'si').length
        
        setPaidCount(paid)
        setUnpaidCount(unpaid)
      } catch (error) {
        console.error('Error fetching data:', error)
        setChartData([])
        setAllReservationsData([])
        setPaidCount(0)
        setUnpaidCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchSalesData()
  }, [timeRange])

  React.useEffect(() => {
    const fetchFerries = async () => {
      try {
        const business = localStorage.getItem('easyferry-business');
        if (!business) {
          console.error('Business not found in local storage.');
          return;
        }

        const response = await fetch(`https://easy-ferry.uc.r.appspot.com/get-ferry?business=${encodeURIComponent(business)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch ferries');
        }
        const result = await response.json();
        setFerries(result.data || result);
      } catch (error) {
        console.error("Error fetching ferries:", error);
      }
    };
    fetchFerries();
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const processChartData = (data: any[], range: TimeRange) => {
    const today = new Date()
    let startDate = new Date(today)
    let endDate = new Date(today)
    
    if (range === "7d") {
      startDate.setDate(startDate.getDate() - 7)
    } else if (range === "15d") {
      startDate.setDate(startDate.getDate() - 15)
    } else if (range === "30d") {
      startDate.setDate(startDate.getDate() - 30)
    } else if (range === "next7d") {
      endDate.setDate(endDate.getDate() + 7)
    } else if (range === "next30d") {
      endDate.setDate(endDate.getDate() + 30)
    } else if (range === "next90d") {
      endDate.setDate(endDate.getDate() + 90)
    }

    const dateMap: Record<string, { date: string; paid: number; unpaid: number }> = {}
    
    const currentDate = new Date(range.startsWith("next") ? today : startDate)
    const finalDate = new Date(range.startsWith("next") ? endDate : today)
    
    while (currentDate <= finalDate) {
      const dateStr = formatDate(currentDate)
      dateMap[dateStr] = { date: dateStr, paid: 0, unpaid: 0 }
      currentDate.setDate(currentDate.getDate() + 1)
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

  const processReservationsData = (data: any[], range: TimeRange) => {
    const today = new Date()
    let startDate = new Date(today)
    let endDate = new Date(today)
    
    if (range === "7d") {
      startDate.setDate(startDate.getDate() - 7)
    } else if (range === "15d") {
      startDate.setDate(startDate.getDate() - 15)
    } else if (range === "30d") {
      startDate.setDate(startDate.getDate() - 30)
    } else if (range === "next7d") {
      endDate.setDate(endDate.getDate() + 7)
    } else if (range === "next30d") {
      endDate.setDate(endDate.getDate() + 30)
    } else if (range === "next90d") {
      endDate.setDate(endDate.getDate() + 90)
    }

    const dateMap: Record<string, { 
      date: string; 
      reservations: number; 
      available: number;
      warning?: number;
    }> = {}
    
    const currentDate = new Date(range.startsWith("next") ? today : startDate)
    const finalDate = new Date(range.startsWith("next") ? endDate : today)
    
    while (currentDate <= finalDate) {
      const dateStr = formatDate(currentDate)
      dateMap[dateStr] = { 
        date: dateStr, 
        reservations: 0, 
        available: ferry_1_capacity,
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    data.forEach((item: any) => {
      if (!item.date) return

      const dateStr = item.date
      if (dateMap[dateStr]) {
        dateMap[dateStr].reservations += 1
        dateMap[dateStr].available = Math.max(0, ferry_1_capacity - dateMap[dateStr].reservations)
      }
    })

    return Object.values(dateMap).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
  }

  // Función para filtrar los datos por ferry
  const getReservationsForFerry = (ferryName: string) => {
    const filteredData = allReservationsData.filter(item => item.ferry === ferryName)
    return processReservationsData(filteredData, timeRange)
  }

  const radialData = [{
    name: "reservas",
    paid: paidCount,
    unpaid: unpaidCount
  }]

  const totalReservations = paidCount + unpaidCount

  const getTimeRangeLabel = (range: TimeRange) => {
    switch(range) {
      case "7d": return "Últimos 7 días";
      case "15d": return "Últimos 15 días";
      case "30d": return "Últimos 30 días";
      case "next7d": return "Próximos 7 días";
      case "next30d": return "Próximos 30 días";
      case "next90d": return "Próximos 90 días";
      default: return range;
    }
  }

  return (
    <main className="min-h-screen px-4">
      {/* Card 1 - Reservas vs Capacidad */}
      {ferries.map((ferry) => {
        const ferryReservationsData = getReservationsForFerry(ferry.ferry_name)
        
        return (
          <Card key={ferry.id} className="h-[250px] w-full overflow-hidden mb-5">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row h-[20px]">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6">
                <CardTitle>{ferry.ferry_name}</CardTitle>
                <CardDescription>
                  Capacidad del ferry: {ferry_1_capacity} pasajeros
                </CardDescription>
              </div>
              <div className="flex flex-1 flex-col justify-center items-end gap-1 px-6">
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
                    <SelectItem value="next7d" className="rounded-lg">
                      Próximos 7 días
                    </SelectItem>
                    <SelectItem value="next30d" className="rounded-lg">
                      Próximos 30 días
                    </SelectItem>
                    <SelectItem value="next90d" className="rounded-lg">
                      Próximos 90 días
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-120px)] px-2 sm:px-6">
              {loading ? (
                <div className="flex h-full items-center justify-center">Cargando datos...</div>
              ) : ferryReservationsData.length > 0 ? (
                <ChartContainer config={reservationsChartConfig} className="aspect-auto h-[170px] w-full">
                  <div className="flex flex-col h-full">
                    <div className="flex-1 min-h-0">
                      <ResponsiveContainer>
                        <BarChart data={ferryReservationsData}>
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
                                formatter={(value, name) => {
                                  if (name === 'available') {
                                    return [`${value} `, 'Disponible']
                                  } else if (name === 'warning') {
                                    return [`${value} `, 'Reservas (alta demanda)']
                                  } else {
                                    return [`${value} `, 'Reservas']
                                  }
                                }}
                                indicator="dot"
                              />
                            }
                          />
                          <ChartLegend content={<ChartLegendContent />} />
                          <Bar dataKey="reservations" stackId="a" radius={[4, 4, 0, 0]}>
                            {ferryReservationsData.map((entry, index) => {
                              const progress = entry.reservations / ferry_1_capacity
                              let fill = '#2b7fff'; // Color inicial
                              if (progress > 0.5) {
                                // Calcular interpolación entre azul (#2b7fff) y rojo (#ff4d4f)
                                const r = Math.round(0x2b + (0xff - 0x2b) * (progress - 0.5) * 2);
                                const g = Math.round(0x7f + (0x4d - 0x7f) * (progress - 0.5) * 2);
                                const b = Math.round(0xff + (0x4f - 0xff) * (progress - 0.5) * 2);
                                fill = `rgb(${r}, ${g}, ${b})`;
                              }
                              return (
                                <Cell key={`cell-${index}`} fill={fill} />
                              );
                            })}
                          </Bar>
                          
                        <Bar
                            dataKey="available"
                            stackId="a"
                            fill="#8ec5ff"
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
        )
      })}
      {/* Card 3 - Resumen */}
      <Card className="h-[500px] w-full overflow-hidden">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">

          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-3 sm:py-3">
            <CardTitle>Ventas y reservas</CardTitle>
            <CardDescription>
              Mostrando ventas de {getTimeRangeLabel(timeRange)}
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
                  fill="#2b7fff"
                  className="stroke-transparent stroke-2"
                />
                <RadialBar
                  dataKey="unpaid"
                  fill="#8ec5ff"
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
                      <SelectItem value="next7d" className="rounded-lg">
                        Próximos 7 días
                      </SelectItem>
                      <SelectItem value="next30d" className="rounded-lg">
                        Próximos 30 días
                      </SelectItem>
                      <SelectItem value="next90d" className="rounded-lg">
                        Próximos 90 días
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
                        fill="#8ec5ff"
                        radius={[4, 4, 4, 4]}
                      />
                      <Bar
                        dataKey="paid"
                        stackId="a"
                        fill="#2b7fff"
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