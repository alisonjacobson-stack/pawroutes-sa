import React, { useState, useMemo } from 'react'
import { getRecommendedStopInterval } from './MyPackPanel'

const STOP_DURATION = 30 // minutes default per stop
const HOURS = Array.from({ length: 18 }, (_, i) => i + 4) // 4 AM to 9 PM

const CATEGORY_COLORS = {
  accommodation: 'var(--forest)',
  restaurant: 'var(--ochre)',
  activity: 'var(--terracotta)',
  vet: '#E05555',
  park: 'var(--forest)',
  beach: '#3B9ECF',
  petshop: 'var(--bark)',
}

function formatTime(minutes) {
  const h = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

function categoryEmoji(cat) {
  const map = {
    accommodation: '🏡', restaurant: '🍽️', activity: '🏕️', vet: '🏥',
    park: '🌿', beach: '🏖️', petshop: '🛒', fuel: '⛽', rest: '🅿️',
  }
  return map[cat] || '📍'
}

export default function TripTimeline({ route, stops = [], pets = [], dark, open, onClose }) {
  const [departureHour, setDepartureHour] = useState(7)
  const [addedStopIds, setAddedStopIds] = useState([])

  if (!open) return null

  const departureMin = departureHour * 60
  const totalDriveMin = route?.freeRoute?.time ? Math.round(route.freeRoute.time / 60) : 180
  const totalDistKm = route?.freeRoute?.distance ? Math.round(route.freeRoute.distance / 1000) : 0
  const stopInterval = getRecommendedStopInterval(pets)

  // Build timeline entries
  const timeline = useMemo(() => {
    const entries = []
    let currentMin = departureMin

    // Departure
    entries.push({ id: '__depart', type: 'depart', label: 'Departure', time: currentMin, duration: 0, color: 'var(--forest)' })

    // Calculate pet break positions
    const numBreaks = Math.max(0, Math.floor(totalDriveMin / stopInterval) - 1)
    const breakPositions = []
    for (let i = 1; i <= numBreaks; i++) {
      breakPositions.push(i / (numBreaks + 1)) // fraction of total route
    }

    // Added stops - approximate position along route based on index in stops array
    const addedStops = stops
      .filter(s => addedStopIds.includes(s.id))
      .map((s, _, arr) => {
        const idx = stops.indexOf(s)
        const position = stops.length > 1 ? idx / (stops.length - 1) : 0.5
        return { ...s, position: Math.max(0.05, Math.min(0.95, position)) }
      })
      .sort((a, b) => a.position - b.position)

    // Merge pet breaks + added stops, sorted by position
    const allMidStops = [
      ...breakPositions.map((pos, i) => ({
        id: `__break_${i}`, type: 'break', label: `Pet break ${i + 1}`,
        position: pos, duration: 15,
        color: 'var(--terracotta)',
      })),
      ...addedStops.map(s => ({
        id: s.id, type: 'stop', label: s.name, town: s.town,
        category: s.category, description: s.description,
        petPolicy: s.petPolicy, price: s.price,
        position: s.position, duration: STOP_DURATION,
        color: CATEGORY_COLORS[s.category] || 'var(--bark)',
      })),
    ].sort((a, b) => a.position - b.position)

    // Calculate actual times
    let driveElapsed = 0
    let prevPosition = 0

    for (const stop of allMidStops) {
      const segmentDrive = (stop.position - prevPosition) * totalDriveMin
      driveElapsed += segmentDrive
      currentMin = departureMin + driveElapsed + entries.slice(1).reduce((sum, e) => sum + e.duration, 0)
      entries.push({ ...stop, time: Math.round(currentMin) })
      prevPosition = stop.position
    }

    // Arrival
    const remainingDrive = (1 - prevPosition) * totalDriveMin
    driveElapsed += remainingDrive
    const totalStopTime = entries.slice(1).reduce((sum, e) => sum + e.duration, 0)
    const arrivalMin = departureMin + totalDriveMin + totalStopTime

    entries.push({
      id: '__arrive', type: 'arrive',
      label: route?.name ? `Arrive: ${route.name}` : 'Arrival',
      time: Math.round(arrivalMin), duration: 0, color: 'var(--forest)',
    })

    return entries
  }, [departureMin, totalDriveMin, stopInterval, addedStopIds, stops, route])

  const totalBreakTime = timeline.reduce((sum, e) => sum + (e.duration || 0), 0)
  const arrivalEntry = timeline[timeline.length - 1]
  const numStops = timeline.filter(e => e.type === 'stop' || e.type === 'break').length

  const addStop = (id) => setAddedStopIds(prev => [...prev, id])
  const removeStop = (id) => setAddedStopIds(prev => prev.filter(sid => sid !== id))

  const availableStops = stops.filter(s => !addedStopIds.includes(s.id))

  const chipStyle = (active) => ({
    padding: '4px 12px', fontSize: 12, fontWeight: active ? 600 : 400,
    background: active ? 'var(--terracotta)' : (dark ? 'var(--card-dark)' : 'var(--sand-light)'),
    color: active ? '#FFF' : 'inherit',
    border: `1px solid ${active ? 'transparent' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all 0.15s', minWidth: 48, textAlign: 'center',
  })

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%', maxWidth: 540, maxHeight: '85vh',
          background: dark ? 'var(--bg-dark)' : 'var(--cream)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInUp 0.3s var(--ease-out)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>
                🗺️ Trip Timeline
              </h2>
              {route?.name && (
                <div style={{ fontSize: 13, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)', marginTop: 2 }}>
                  {route.name} {totalDistKm > 0 && `· ${totalDistKm} km`}
                </div>
              )}
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 'var(--radius-full)',
              background: dark ? 'var(--card-dark)' : 'var(--sand)',
              border: 'none', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'inherit',
            }}>✕</button>
          </div>

          {/* Departure time picker */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>
              Departure Time
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[5, 6, 7, 8, 9, 10, 11, 12, 14, 16].map(h => (
                <button key={h} onClick={() => setDepartureHour(h)} style={chipStyle(departureHour === h)}>
                  {formatTime(h * 60)}
                </button>
              ))}
            </div>
            {pets.length > 0 && (
              <div style={{ fontSize: 11, color: 'var(--terracotta)', marginTop: 6, fontWeight: 500 }}>
                🐾 Pack needs a break every {stopInterval} min
              </div>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: 40 }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 15, top: 8, bottom: 8, width: 2,
              background: dark ? 'var(--border-dark)' : '#DDD',
            }} />

            {timeline.map((entry, i) => (
              <div key={entry.id} style={{
                position: 'relative', marginBottom: i < timeline.length - 1 ? 20 : 0,
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: -30, top: 2,
                  width: 12, height: 12, borderRadius: 'var(--radius-full)',
                  background: entry.color,
                  border: `2px solid ${dark ? 'var(--bg-dark)' : 'var(--cream)'}`,
                  zIndex: 1,
                }} />

                {/* Time label */}
                <div style={{
                  position: 'absolute', left: -76, top: 0,
                  fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                  color: entry.type === 'depart' || entry.type === 'arrive'
                    ? 'var(--forest)' : dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
                  width: 65, textAlign: 'right',
                }}>
                  {formatTime(entry.time)}
                </div>

                {/* Content card */}
                <div style={{
                  flex: 1,
                  background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  borderLeft: `3px solid ${entry.color}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {entry.type === 'depart' && '🚗 '}
                        {entry.type === 'arrive' && '🏁 '}
                        {entry.type === 'break' && '🐾 '}
                        {entry.type === 'stop' && `${categoryEmoji(entry.category)} `}
                        {entry.label}
                      </div>
                      {entry.town && (
                        <div style={{ fontSize: 11, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)', marginTop: 1 }}>
                          {entry.town}
                          {entry.petPolicy && ` · ${entry.petPolicy}`}
                        </div>
                      )}
                      {entry.duration > 0 && (
                        <div style={{ fontSize: 11, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)', marginTop: 1 }}>
                          ⏱️ {entry.duration} min stop
                          {entry.price && ` · ${entry.price}`}
                        </div>
                      )}
                    </div>
                    {(entry.type === 'stop' || entry.type === 'break') && entry.type === 'stop' && (
                      <button
                        onClick={() => removeStop(entry.id)}
                        style={{
                          width: 24, height: 24, borderRadius: 'var(--radius-full)',
                          background: 'transparent', border: 'none',
                          cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                        title="Remove from trip"
                      >✕</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Available stops to add */}
          {availableStops.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8,
              }}>
                Pet-Friendly Stops on Route
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {availableStops.map(stop => (
                  <div key={stop.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        {categoryEmoji(stop.category)} {stop.name}
                      </div>
                      <div style={{ fontSize: 11, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)' }}>
                        {stop.town}
                        {stop.petPolicy && ` · ${stop.petPolicy}`}
                        {stop.price && ` · ${stop.price}`}
                      </div>
                    </div>
                    <button
                      onClick={() => addStop(stop.id)}
                      style={{
                        padding: '4px 10px', fontSize: 11, fontWeight: 600,
                        background: 'var(--forest)', color: '#FFF',
                        border: 'none', borderRadius: 'var(--radius-full)',
                        cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
                      }}
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer stats */}
        <div style={{
          padding: '14px 24px',
          borderTop: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
          background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 8, textAlign: 'center',
          }}>
            {[
              { label: 'Depart', value: formatTime(departureMin), icon: '🚗' },
              { label: 'Arrive', value: formatTime(arrivalEntry?.time || departureMin), icon: '🏁' },
              { label: 'Stops', value: numStops, icon: '📍' },
              { label: 'Break Time', value: `${totalBreakTime}m`, icon: '⏱️' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: 16 }}>{stat.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
