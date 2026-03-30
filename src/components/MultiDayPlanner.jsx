import React, { useState, useEffect } from 'react'

const STORAGE_KEY = 'pawroutes-multiday-trips'
const MAX_DAYS = 7

const PET_EMOJI = {
  dog: '\u{1F9AE}', 'dog-small': '\u{1F436}', 'dog-medium': '\u{1F9AE}', 'dog-large': '\u{1F9AE}',
  cat: '\u{1F431}', bird: '\u{1F99C}', rabbit: '\u{1F430}',
}

function petEmoji(type) {
  return PET_EMOJI[type] || '\u{1F43E}'
}

function parseTime(str) {
  if (!str) return 0
  const hMatch = str.match(/(\d+)h/)
  const mMatch = str.match(/(\d+)m/)
  return (hMatch ? parseInt(hMatch[1]) * 60 : 0) + (mMatch ? parseInt(mMatch[1]) : 0)
}

function formatMinutes(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m}m`
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function getAccommodationStops(stops, routeId) {
  return stops.filter(s =>
    s.category === 'stay' &&
    (s.routeId === routeId || (s.alsoOnRoute && s.alsoOnRoute.includes(routeId)))
  )
}

// Pre-built example trip
const EXAMPLE_TRIP = {
  name: 'The Ultimate SA Pet Road Trip',
  subtitle: 'JHB \u2192 Garden Route \u2192 Cape Town (3 days)',
  days: [
    { routeId: 'jhb-garden', overnightStopId: 'graaff-reinet-stay' },
    { routeId: 'jhb-garden', overnightStopId: null },
    { routeId: 'cpt-garden', overnightStopId: null },
  ],
}

export default function MultiDayPlanner({ routes = [], stops = [], pets = [], dark, open, onClose }) {
  const [days, setDays] = useState([])
  const [savedTrips, setSavedTrips] = useState([])
  const [tripName, setTripName] = useState('')
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      setSavedTrips(stored)
    } catch { setSavedTrips([]) }
  }, [open])

  if (!open) return null

  const addDay = () => {
    if (days.length >= MAX_DAYS) return
    setDays([...days, { routeId: '', overnightStopId: '' }])
  }

  const removeDay = (idx) => {
    setDays(days.filter((_, i) => i !== idx))
  }

  const updateDay = (idx, field, value) => {
    const updated = [...days]
    updated[idx] = { ...updated[idx], [field]: value }
    if (field === 'routeId') updated[idx].overnightStopId = ''
    setDays(updated)
  }

  const loadExample = () => {
    setTripName(EXAMPLE_TRIP.name)
    setDays(EXAMPLE_TRIP.days.map(d => ({ ...d })))
  }

  // Compute totals
  const totals = days.reduce((acc, day) => {
    const route = routes.find(r => r.id === day.routeId)
    if (!route) return acc
    const dist = route.freeRoute?.distance || route.tollRoute?.distance || 0
    const timeStr = route.freeRoute?.time || route.tollRoute?.time || '0h'
    const tollCost = route.tollRoute?.tollCost || 0
    acc.km += dist
    acc.driveMin += parseTime(timeStr)
    acc.fuelCost += Math.round(dist * 2.2)
    acc.tollCost += tollCost
    return acc
  }, { km: 0, driveMin: 0, fuelCost: 0, tollCost: 0 })

  const saveTrip = () => {
    const name = tripName.trim() || `Trip ${new Date().toLocaleDateString('en-ZA')}`
    const trip = {
      id: Date.now().toString(),
      name,
      days: days.map(d => ({ ...d })),
      createdAt: new Date().toISOString(),
      totalKm: totals.km,
      totalDays: days.length,
    }
    const updated = [trip, ...savedTrips].slice(0, 20)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSavedTrips(updated)
    setTripName('')
  }

  const loadTrip = (trip) => {
    setTripName(trip.name)
    setDays(trip.days.map(d => ({ ...d })))
    setShowSaved(false)
  }

  const deleteTrip = (id) => {
    const updated = savedTrips.filter(t => t.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSavedTrips(updated)
  }

  const handleWhatsApp = () => {
    const petList = pets.map(p => `${p.name} ${petEmoji(p.type)}`).join(' & ')
    let text = `\u{1F43E} Multi-Day Road Trip!\n`
    text += `Travelling with ${petList}\n\n`
    days.forEach((day, i) => {
      const route = routes.find(r => r.id === day.routeId)
      if (!route) return
      const dist = route.freeRoute?.distance || route.tollRoute?.distance || 0
      const time = route.freeRoute?.time || route.tollRoute?.time || '?'
      text += `Day ${i + 1}: ${route.name}\n`
      text += `  \u{1F697} ${dist}km \u00B7 ${time}\n`
      if (day.overnightStopId) {
        const stop = stops.find(s => s.id === day.overnightStopId)
        if (stop) text += `  \u{1F3E8} Overnight: ${stop.name}, ${stop.town}\n`
      }
      text += '\n'
    })
    text += `\u{1F4CA} Totals: ${totals.km}km \u00B7 ${formatMinutes(totals.driveMin)} driving \u00B7 ${days.length} day${days.length !== 1 ? 's' : ''}\n`
    text += `\u{1F4B0} ~R${totals.fuelCost.toLocaleString()} fuel + R${totals.tollCost.toLocaleString()} tolls\n\n`
    text += `\u2B50 Planned with PawRoutes SA \u{1F1FF}\u{1F1E6}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const chipStyle = (active) => ({
    padding: '6px 14px', fontSize: 12, fontWeight: active ? 600 : 400,
    background: active ? 'var(--terracotta)' : (dark ? 'var(--card-dark)' : 'var(--sand-light)'),
    color: active ? '#FFF' : 'inherit',
    border: `1px solid ${active ? 'transparent' : dark ? 'var(--border-dark)' : '#e0d5c5'}`,
    borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all 0.15s',
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
          width: '90%', maxWidth: 520, maxHeight: '85vh',
          background: dark ? 'var(--bg-dark)' : 'var(--cream)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInUp 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>
                {'\u{1F5FA}\uFE0F'} Multi-Day Planner
              </h2>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                Chain routes into a full road trip
              </div>
            </div>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', fontSize: 22, cursor: 'pointer',
              color: 'var(--text-muted)', padding: '4px 8px', lineHeight: 1,
            }}>{'\u2715'}</button>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <button onClick={loadExample} style={chipStyle(false)}>
              {'\u2728'} Load Example Trip
            </button>
            {savedTrips.length > 0 && (
              <button onClick={() => setShowSaved(!showSaved)} style={chipStyle(showSaved)}>
                {'\u{1F4BE}'} Saved ({savedTrips.length})
              </button>
            )}
          </div>

          {/* Saved trips dropdown */}
          {showSaved && savedTrips.length > 0 && (
            <div style={{
              marginBottom: 16, borderRadius: 'var(--radius-md)',
              border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
              overflow: 'hidden',
            }}>
              {savedTrips.map(trip => (
                <div key={trip.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', fontSize: 13,
                  borderBottom: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                  background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
                }}>
                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => loadTrip(trip)}>
                    <div style={{ fontWeight: 600 }}>{trip.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {trip.totalDays} day{trip.totalDays !== 1 ? 's' : ''} &middot; {trip.totalKm}km
                    </div>
                  </div>
                  <button onClick={() => deleteTrip(trip.id)} style={{
                    background: 'none', border: 'none', fontSize: 14, cursor: 'pointer',
                    color: 'var(--text-muted)', padding: '4px 8px',
                  }}>{'\u{1F5D1}\uFE0F'}</button>
                </div>
              ))}
            </div>
          )}

          {/* Trip name input */}
          {days.length > 0 && (
            <input
              type="text"
              placeholder="Trip name (e.g. Easter Garden Route)"
              value={tripName}
              onChange={e => setTripName(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                background: dark ? 'var(--card-dark)' : '#fff',
                border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                borderRadius: 'var(--radius-md)', marginBottom: 16,
                fontFamily: 'var(--font-body)', color: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          )}

          {/* Visual timeline */}
          {days.length > 0 && (
            <div style={{ position: 'relative', marginBottom: 20 }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute', left: 15, top: 8, bottom: 8, width: 3,
                background: dark ? 'var(--border-dark)' : '#e0d5c5',
                borderRadius: 2,
              }} />

              {days.map((day, idx) => {
                const route = routes.find(r => r.id === day.routeId)
                const accomStops = day.routeId ? getAccommodationStops(stops, day.routeId) : []
                const overnight = stops.find(s => s.id === day.overnightStopId)
                const dist = route?.freeRoute?.distance || route?.tollRoute?.distance || 0
                const time = route?.freeRoute?.time || route?.tollRoute?.time || ''
                const isLast = idx === days.length - 1

                return (
                  <div key={idx} style={{ position: 'relative', paddingLeft: 40, marginBottom: isLast ? 0 : 16 }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute', left: 8, top: 12, width: 17, height: 17,
                      borderRadius: '50%',
                      background: route ? 'var(--terracotta)' : (dark ? 'var(--card-dark)' : 'var(--sand)'),
                      border: `3px solid ${dark ? 'var(--bg-dark)' : 'var(--cream)'}`,
                      zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 800, color: route ? '#fff' : 'var(--text-muted)',
                    }}>
                      {idx + 1}
                    </div>

                    {/* Day card */}
                    <div style={{
                      background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                      padding: 14, position: 'relative',
                    }}>
                      {/* Day header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>
                          Day {idx + 1}
                        </div>
                        <button onClick={() => removeDay(idx)} style={{
                          background: 'none', border: 'none', fontSize: 14, cursor: 'pointer',
                          color: 'var(--text-muted)', padding: '2px 6px', lineHeight: 1,
                        }}>{'\u2715'}</button>
                      </div>

                      {/* Route select */}
                      <select
                        value={day.routeId}
                        onChange={e => updateDay(idx, 'routeId', e.target.value)}
                        style={{
                          width: '100%', padding: '8px 12px', fontSize: 13,
                          background: dark ? 'var(--bg-dark)' : '#fff',
                          border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                          borderRadius: 'var(--radius-sm)', color: 'inherit',
                          fontFamily: 'var(--font-body)', marginBottom: 8,
                          boxSizing: 'border-box',
                        }}
                      >
                        <option value="">Select a route...</option>
                        {routes.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>

                      {/* Route info */}
                      {route && (
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', gap: 12 }}>
                          <span>{'\u{1F697}'} {dist}km</span>
                          <span>{'\u23F1\uFE0F'} {time}</span>
                          <span>{'\u{1F43E}'} {route.pawScore}/5</span>
                        </div>
                      )}

                      {/* Overnight stop select (not on last day) */}
                      {route && !isLast && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', marginBottom: 4 }}>
                            Overnight stop
                          </div>
                          {accomStops.length > 0 ? (
                            <select
                              value={day.overnightStopId}
                              onChange={e => updateDay(idx, 'overnightStopId', e.target.value)}
                              style={{
                                width: '100%', padding: '8px 12px', fontSize: 13,
                                background: dark ? 'var(--bg-dark)' : '#fff',
                                border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                                borderRadius: 'var(--radius-sm)', color: 'inherit',
                                fontFamily: 'var(--font-body)', boxSizing: 'border-box',
                              }}
                            >
                              <option value="">No overnight planned</option>
                              {accomStops.map(s => (
                                <option key={s.id} value={s.id}>
                                  {'\u{1F3E8}'} {s.name} — {s.town} {s.price ? `(${s.price})` : ''}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              No pet-friendly stays listed on this route yet
                            </div>
                          )}
                          {overnight && (
                            <div style={{
                              fontSize: 12, color: 'var(--forest)', marginTop: 6,
                              padding: '6px 10px', borderRadius: 'var(--radius-sm)',
                              background: dark ? 'rgba(74,124,89,0.15)' : 'rgba(74,124,89,0.08)',
                            }}>
                              {'\u{1F3E8}'} {overnight.name}, {overnight.town}
                              {overnight.price && <span> &middot; {overnight.price}</span>}
                              {overnight.petPolicy && <div style={{ fontSize: 11, marginTop: 2, opacity: 0.8 }}>{overnight.petPolicy}</div>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Add Day button */}
          {days.length < MAX_DAYS && (
            <button onClick={addDay} style={{
              width: '100%', padding: '12px 16px', fontSize: 14, fontWeight: 600,
              background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
              color: 'var(--terracotta)',
              border: `2px dashed ${dark ? 'var(--border-dark)' : '#d4c5b0'}`,
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', transition: 'all 0.15s',
              marginBottom: 16,
            }}>
              + Add Day {days.length > 0 ? `(${days.length}/${MAX_DAYS})` : ''}
            </button>
          )}

          {/* Empty state */}
          {days.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '24px 16px',
              color: 'var(--text-muted)', fontSize: 14,
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{'\u{1F697}\u{1F4A8}'}</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Plan your multi-day adventure</div>
              <div style={{ fontSize: 13 }}>
                Add days, pick routes, and find pet-friendly overnight stays along the way.
              </div>
            </div>
          )}

          {/* Running totals */}
          {days.length > 0 && days.some(d => d.routeId) && (
            <div style={{
              background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
              padding: 16, marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 10 }}>
                Trip Totals
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--terracotta)' }}>
                    {totals.km.toLocaleString()}km
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total distance</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--forest)' }}>
                    {formatMinutes(totals.driveMin)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Drive time</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>
                    {days.length} day{days.length !== 1 ? 's' : ''}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Duration</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>
                    ~R{(totals.fuelCost + totals.tollCost).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Est. cost (fuel + tolls)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {days.length > 0 && days.some(d => d.routeId) && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <button onClick={saveTrip} style={{
                flex: 1, padding: '12px 16px', fontSize: 14, fontWeight: 700,
                background: 'var(--forest)', color: '#fff', border: 'none',
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s',
              }}>
                {'\u{1F4BE}'} Save Trip
              </button>
              <button onClick={handleWhatsApp} style={{
                flex: 1, padding: '12px 16px', fontSize: 14, fontWeight: 700,
                background: '#25D366', color: '#fff', border: 'none',
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s',
              }}>
                {'\u{1F4AC}'} WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
