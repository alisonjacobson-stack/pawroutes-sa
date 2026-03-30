import React, { useState, useMemo } from 'react'

const CATEGORY_ICONS = {
  farm: '\u{1F3E1}',
  park: '\u{1F333}',
  stay: '\u{1F3E8}',
  vet: '\u{1F3E5}',
  rest: '\u26FD',
  restaurant: '\u{1F37D}\uFE0F',
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)}m away`
  if (km < 10) return `${km.toFixed(1)}km away`
  return `${Math.round(km)}km away`
}

function mapsLink(lat, lon, name) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=&travelmode=driving`
}

export default function NearMe({ stops = [], dark }) {
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [userLat, setUserLat] = useState(null)
  const [userLon, setUserLon] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus('error')
      setErrorMsg('Geolocation is not supported by your browser')
      return
    }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude)
        setUserLon(pos.coords.longitude)
        setStatus('done')
      },
      (err) => {
        setStatus('error')
        if (err.code === 1) setErrorMsg('Location access denied \u2014 enable GPS in your browser settings for nearby stops')
        else if (err.code === 2) setErrorMsg('Location not available \u2014 enable GPS for nearby stops')
        else setErrorMsg('Could not determine your location \u2014 try again')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  const nearbyStops = useMemo(() => {
    if (status !== 'done' || userLat === null) return []
    return stops
      .filter(s => s.coords && s.coords.length === 2)
      .map(s => ({
        ...s,
        distance: haversine(userLat, userLon, s.coords[0], s.coords[1]),
      }))
      .filter(s => s.distance <= 50)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
  }, [stops, userLat, userLon, status])

  return (
    <div style={{
      background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
      borderRadius: 'var(--radius-md)',
      border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
      overflow: 'hidden',
    }}>
      {/* Header / trigger */}
      {status === 'idle' && (
        <button onClick={requestLocation} style={{
          width: '100%', padding: '14px 16px', fontSize: 14, fontWeight: 700,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--terracotta)', fontFamily: 'var(--font-body)',
          display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
        }}>
          {'\u{1F4CD}'} Near Me
        </button>
      )}

      {/* Loading */}
      {status === 'loading' && (
        <div style={{
          padding: '20px 16px', textAlign: 'center', fontSize: 13,
          color: 'var(--text-muted)',
        }}>
          <div style={{
            width: 24, height: 24, margin: '0 auto 10px',
            border: `3px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
            borderTopColor: 'var(--terracotta)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          Acquiring your location...
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#C45B5B', marginBottom: 10 }}>
            {'\u26A0\uFE0F'} {errorMsg}
          </div>
          <button onClick={requestLocation} style={{
            padding: '8px 16px', fontSize: 12, fontWeight: 600,
            background: 'var(--terracotta)', color: '#fff', border: 'none',
            borderRadius: 'var(--radius-full)', cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}>
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {status === 'done' && (
        <div>
          {/* Results header */}
          <div style={{
            padding: '12px 16px 8px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              {'\u{1F4CD}'} Nearest Pet-Friendly Stops
            </div>
            <button onClick={requestLocation} style={{
              background: 'none', border: 'none', fontSize: 11, cursor: 'pointer',
              color: 'var(--terracotta)', fontWeight: 600, fontFamily: 'var(--font-body)',
            }}>
              {'\u{1F504}'} Refresh
            </button>
          </div>

          {/* Empty within 50km */}
          {nearbyStops.length === 0 && (
            <div style={{
              padding: '16px', textAlign: 'center', fontSize: 13,
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{'\u{1F3DC}\uFE0F'}</div>
              No pet-friendly stops within 50km of your location.
              <div style={{ fontSize: 11, marginTop: 4 }}>
                Try searching when you're closer to one of our routes.
              </div>
            </div>
          )}

          {/* Stop cards */}
          {nearbyStops.map(stop => (
            <div key={stop.id} style={{
              padding: '12px 16px',
              borderTop: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              {/* Category icon */}
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                {CATEGORY_ICONS[stop.category] || '\u{1F4CC}'}
              </div>

              {/* Stop info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>
                  {stop.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--terracotta)', fontWeight: 600 }}>
                    {formatDistance(stop.distance)}
                  </span>
                  <span>{stop.town}</span>
                </div>
                {stop.petPolicy && (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                    {'\u{1F43E}'} {stop.petPolicy}
                  </div>
                )}
              </div>

              {/* Navigate button */}
              <a
                href={mapsLink(stop.coords[0], stop.coords[1], stop.name)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 12px', fontSize: 11, fontWeight: 700,
                  background: 'var(--forest)', color: '#fff',
                  borderRadius: 'var(--radius-full)', textDecoration: 'none',
                  whiteSpace: 'nowrap', flexShrink: 0, alignSelf: 'center',
                }}
              >
                Navigate
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
