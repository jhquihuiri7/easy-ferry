'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

mapboxgl.accessToken = 'pk.eyJ1IjoiamhxdWlodWlyaTciLCJhIjoiY21jMHhmY2kzMDd3MzJtb2RqM2t2OGI1byJ9.d8_nJEzUiiwLtXfyXzHooQ'

export default function MapWithCustomMarkers() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [points, setPoints] = useState<{ long: number; lat: number }[]>([])
  const [business] = useState('Gaviota') // Puedes hacer esto configurable si necesitas

  // Función para obtener coordenadas
  const fetchCoordinates = async () => {
    try {
      const res = await fetch(`https://easy-ferry.uc.r.appspot.com/get-coordinates?business=${business}`)
      if (!res.ok) throw new Error('Error fetching data')
      const data = await res.json()
      setPoints(data)
    } catch (err) {
      console.error('Error fetching coordinates:', err)
    }
  }

  // 1. Obtener coordenadas iniciales y configurar intervalo para actualizaciones
  useEffect(() => {
    // Obtener datos inmediatamente
    fetchCoordinates()

    // Configurar intervalo para actualizar cada minuto (60000 ms)
    const intervalId = setInterval(fetchCoordinates, 60000)

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalId)
  }, [business])

  // 2. Cargar y actualizar mapa cuando cambian los puntos
  useEffect(() => {
    if (!points.length || !mapContainer.current) return

    // Si el mapa no existe, crearlo
    if (!mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [points[0].long, points[0].lat],
        zoom: 8
      })

      map.on('load', () => {
        updateMapFeatures(map)
      })

      mapRef.current = map
    } else {
      // Si el mapa ya existe, actualizar sus características
      updateMapFeatures(mapRef.current)
      
      // Centrar el mapa en el último punto (opcional)
      mapRef.current.flyTo({
        center: [points[0].long, points[0].lat],
        essential: true
      })
    }
  }, [points])

  // Función para actualizar las características del mapa
  const updateMapFeatures = (map: mapboxgl.Map) => {
    // Eliminar capas y fuentes existentes si existen
    if (map.getLayer('line-layer')) map.removeLayer('line-layer')
    if (map.getSource('line')) map.removeSource('line')
    
    // Eliminar marcadores existentes
    document.querySelectorAll('.mapboxgl-marker').forEach(el => el.remove())

    // Añadir línea entre puntos
    map.addSource('line', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: points.map(p => [p.long, p.lat])
        },
        properties: {}
      }
    })

    map.addLayer({
      id: 'line-layer',
      type: 'line',
      source: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ff0000',
        'line-width': 3
      }
    })

    // Marcador personalizado en el último punto
    const lastPoint = points[0]
    const el = document.createElement('div')
    el.style.width = '40px'
    el.style.height = '40px'

    const img = document.createElement('img')
    img.src = '/sailboat.png'
    img.style.width = '100%'
    img.style.height = '100%'
    img.style.objectFit = 'contain'

    el.appendChild(img)

    new mapboxgl.Marker(el)
      .setLngLat([lastPoint.long, lastPoint.lat])
      .addTo(map)
  }

  return (
    <Card className="w-full max-w-4xl h-[500px]">
      <CardHeader>
        <CardTitle>Mapa de Ruta</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapContainer} className="w-full h-[400px] rounded-lg overflow-hidden" />
      </CardContent>
    </Card>
  )
}