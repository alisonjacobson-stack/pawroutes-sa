import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { STOP_CATEGORIES } from '../data/stops'

// Fix default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom emoji markers
function emojiIcon(emoji, size = 28) {
  return L.divIcon({
    html: `<span style="font-size:${size}px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3))">${emoji}</span>`,
    className: 'emoji-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

function cityIcon() {
  return L.divIcon({
    html: `<div style="
      width:14px;height:14px;background:#C4613B;border:3px solid #FFF;
      border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    className: 'city-marker',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  })
}

// Component to fit map bounds when route changes
function FitBounds({ bounds }) {
  const map = useMap()
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10 })
    }
  }, [bounds, map])
  return null
}

export default function MapView({
  selectedRoute,
  showTollRoute,
  stops,
  activeFilters,
  cities,
  dark,
  onStopClick,
}) {
  const SA_CENTER = [-29.0, 25.5]
  const SA_ZOOM = 6

  const filteredStops = stops.filter(s =>
    activeFilters.length === 0 || activeFilters.includes(s.category)
  )

  // Calculate bounds for selected route
  const bounds = selectedRoute
    ? L.latLngBounds([
        ...selectedRoute.freeRoute.waypoints.map(w => L.latLng(w[0], w[1])),
        ...(showTollRoute ? selectedRoute.tollRoute.waypoints.map(w => L.latLng(w[0], w[1])) : []),
      ])
    : null

  const tileUrl = dark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

  return (
    <MapContainer
      center={SA_CENTER}
      zoom={SA_ZOOM}
      className="paw-cursor"
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer url={tileUrl} />

      {bounds && <FitBounds bounds={bounds} />}

      {/* Toll route (dashed red) */}
      {selectedRoute && showTollRoute && (
        <Polyline
          positions={selectedRoute.tollRoute.waypoints}
          pathOptions={{
            color: '#C45B5B',
            weight: 4,
            opacity: 0.6,
            dashArray: '10, 8',
          }}
        />
      )}

      {/* Free route (solid green) */}
      {selectedRoute && (
        <Polyline
          positions={selectedRoute.freeRoute.waypoints}
          pathOptions={{
            color: '#3B6B4A',
            weight: 5,
            opacity: 0.85,
          }}
        />
      )}

      {/* City markers */}
      {selectedRoute && [selectedRoute.from, selectedRoute.to].map(cityKey => {
        const city = cities[cityKey]
        if (!city) return null
        return (
          <Marker key={cityKey} position={city.coords} icon={cityIcon()}>
            <Popup>
              <div style={{ padding: '8px 12px', fontWeight: 600, fontSize: 14 }}>
                {city.name}
              </div>
            </Popup>
          </Marker>
        )
      })}

      {/* Stop markers */}
      {filteredStops.map(stop => (
        <Marker
          key={stop.id}
          position={stop.coords}
          icon={emojiIcon(STOP_CATEGORIES[stop.category]?.icon || '📍')}
          eventHandlers={{ click: () => onStopClick?.(stop) }}
        >
          <Popup>
            <div style={{ padding: '12px 14px', minWidth: 220, maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>{STOP_CATEGORIES[stop.category]?.icon}</span>
                <strong style={{ fontSize: 14, lineHeight: 1.3, color: dark ? '#E8DCC0' : '#2C2418' }}>{stop.name}</strong>
              </div>
              <div style={{ fontSize: 12, color: dark ? '#A89880' : '#6B5E4A', marginBottom: 6 }}>
                {stop.town} · {stop.road}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 8, color: dark ? '#D4C8B0' : '#2C2418' }}>
                {stop.description}
              </p>
              <div style={{
                fontSize: 12, padding: '6px 10px',
                background: dark ? 'rgba(245,236,215,0.1)' : '#F5ECD7',
                borderRadius: 8, color: dark ? '#D4C0A0' : '#6B4C2C',
              }}>
                🐾 {stop.petPolicy}
              </div>
              {stop.phone && (
                <div style={{ fontSize: 12, marginTop: 6, color: dark ? '#7AAA8A' : '#3B6B4A' }}>
                  📞 <a href={`tel:${stop.phone}`} style={{ color: dark ? '#7AAA8A' : '#3B6B4A' }}>{stop.phone}</a>
                  {stop.afterHours && <span style={{ marginLeft: 6, color: '#C4613B' }}>· 24/7</span>}
                </div>
              )}
              {stop.price && (
                <div style={{ fontSize: 12, marginTop: 4, color: '#D4A843', fontWeight: 600 }}>
                  {stop.price}
                </div>
              )}
              {stop.rating && (
                <div style={{ fontSize: 12, marginTop: 4, color: '#D4A843' }}>
                  {'★'.repeat(Math.round(stop.rating))}{'☆'.repeat(5 - Math.round(stop.rating))} {stop.rating}
                </div>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${stop.coords[0]},${stop.coords[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  marginTop: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600,
                  background: '#3B6B4A', color: '#FFF', borderRadius: 8,
                  textDecoration: 'none', cursor: 'pointer',
                }}
              >
                Navigate 📍
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
