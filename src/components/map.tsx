'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

mapboxgl.accessToken = 'pk.eyJ1IjoiamhxdWlodWlyaTciLCJhIjoiY21jMHhmY2kzMDd3MzJtb2RqM2t2OGI1byJ9.d8_nJEzUiiwLtXfyXzHooQ'

const points = [
  { lng: -90.181567, lat: -0.678880 }, // Nueva York
  { lng: -90.024510, lat: -0.773363 }, // Los Ángeles
  { lng: -89.788284, lat: -0.869120 } // Chicago
]

export default function MapWithCustomMarkers() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-89.788284, -0.869120], // Centro de USA
      zoom: 8
    })

    map.on('load', () => {
      // Agrega línea entre los puntos
      map.addSource('line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: points.map(p => [p.lng, p.lat])
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

      // Agrega marcadores personalizados
      const lastPoint = points[points.length - 1];
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
        .setLngLat([lastPoint.lng, lastPoint.lat])
        .addTo(map)
    })

    mapRef.current = map
  }, [])

  return (
    <Card className="w-full max-w-4xl h-[500px]">
      <CardHeader>
        <CardTitle>Mapa de Ruta</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapContainer} className="map-container w-full h-[400px] rounded-lg overflow-hidden" />
      </CardContent>
    </Card>
  )
}