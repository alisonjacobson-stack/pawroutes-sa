import React, { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'pawroutes-trip-dates'

const PREP_CHECKLIST = [
  { daysOut: 7, icon: '\u2705', text: 'Check pet vaccinations are up to date' },
  { daysOut: 5, icon: '\u2705', text: 'Book pet-friendly accommodation along route' },
  { daysOut: 3, icon: '\u2705', text: 'Pack pet travel kit (see pack list)' },
  { daysOut: 2, icon: '\u2705', text: 'Download route for offline use' },
  { daysOut: 1, icon: '\u2705', text: 'Fill up petrol, prepare pet comfort items' },
  { daysOut: 0, icon: '\u{1F389}', text: 'Adventure time! Drive safe, stop often, enjoy!' },
]

function loadTripDates() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch { return {} }
}

function saveTripDate(routeId, date) {
  const dates = loadTripDates()
  if (date) {
    dates[routeId] = date
  } else {
    delete dates[routeId]
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dates))
}

function getCountdown(tripDate) {
  const now = new Date()
  const trip = new Date(tripDate + 'T06:00:00')
  const diff = trip.getTime() - now.getTime()
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return { days, hours, minutes }
}

function isPast(tripDate) {
  const trip = new Date(tripDate + 'T23:59:59')
  return trip.getTime() < Date.now()
}

function daysUntil(tripDate) {
  const now = new Date()
  const trip = new Date(tripDate + 'T06:00:00')
  return Math.ceil((trip.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export default function TripCountdown({ route, pets = [], dark }) {
  const [tripDate, setTripDate] = useState(() => {
    if (!route) return null
    return loadTripDates()[route.id] || null
  })
  const [countdown, setCountdown] = useState(null)
  const [showPicker, setShowPicker] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Sync when route changes
  useEffect(() => {
    if (!route) return
    const saved = loadTripDates()[route.id] || null
    setTripDate(saved)
    setCompleted(false)
  }, [route?.id])

  // Countdown ticker
  useEffect(() => {
    if (!tripDate || isPast(tripDate)) {
      setCountdown(null)
      return
    }
    const tick = () => setCountdown(getCountdown(tripDate))
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [tripDate])

  const handleSetDate = useCallback((e) => {
    const date = e.target.value
    if (date) {
      setTripDate(date)
      saveTripDate(route.id, date)
      setShowPicker(false)
      setCompleted(false)
    }
  }, [route?.id])

  const handleClear = useCallback(() => {
    setTripDate(null)
    saveTripDate(route.id, null)
    setShowPicker(false)
  }, [route?.id])

  const handleComplete = useCallback(() => {
    setCompleted(true)
    // Store in completed routes for achievements
    try {
      const cr = JSON.parse(localStorage.getItem('pawroutes-completed') || '[]')
      if (!cr.includes(route.id)) {
        cr.push(route.id)
        localStorage.setItem('pawroutes-completed', JSON.stringify(cr))
      }
    } catch {}
    saveTripDate(route.id, null)
  }, [route?.id])

  const handleShare = useCallback(() => {
    const petNames = pets.map(p => p.name).filter(Boolean).join(' & ') || 'our furry friends'
    const cd = countdown
    const daysText = cd ? `${cd.days} day${cd.days !== 1 ? 's' : ''}` : 'Soon'
    const text = `${daysText} until our ${route.name} road trip with ${petNames}! \u{1F43E}\u{1F697}\n\nPlanned with PawRoutes SA \u{1F1FF}\u{1F1E6}`
    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }, [route, pets, countdown])

  if (!route) return null

  const borderColor = dark ? 'var(--border-dark)' : '#e0d5c5'
  const cardBg = dark ? 'var(--card-dark)' : 'var(--sand-light)'
  const mutedText = dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)'

  // Completed state
  if (completed) {
    return (
      <div style={{
        background: cardBg, borderRadius: 'var(--radius-md)',
        padding: '16px 20px', border: `1px solid ${borderColor}`, marginBottom: 16,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>{'\u{1F389}'}</div>
        <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)' }}>
          You completed this trip!
        </div>
        <div style={{ fontSize: 13, color: mutedText, marginTop: 4 }}>
          {route.name} added to your travel history
        </div>
      </div>
    )
  }

  // No trip date set
  if (!tripDate) {
    return (
      <div style={{
        background: cardBg, borderRadius: 'var(--radius-md)',
        padding: '14px 20px', border: `1px solid ${borderColor}`, marginBottom: 16,
      }}>
        {showPicker ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Trip date:</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              onChange={handleSetDate}
              style={{
                padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                border: `1px solid ${borderColor}`, background: dark ? 'var(--bg-dark)' : '#fff',
                color: 'inherit', fontFamily: 'inherit', fontSize: 14, flex: 1, minWidth: 140,
              }}
            />
            <button onClick={() => setShowPicker(false)} style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', padding: '4px 8px',
            }}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowPicker(true)} style={{
            width: '100%', padding: '10px 16px', fontSize: 14, fontWeight: 700,
            background: 'var(--terracotta)', color: '#fff', border: 'none',
            borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}>
            {'\u{1F4C5}'} Plan a trip on this route
          </button>
        )}
      </div>
    )
  }

  // Trip date is in the past
  if (isPast(tripDate)) {
    return (
      <div style={{
        background: cardBg, borderRadius: 'var(--radius-md)',
        padding: '16px 20px', border: `1px solid ${borderColor}`, marginBottom: 16,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>{'\u{1F389}'}</div>
        <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)' }}>
          You completed this trip!
        </div>
        <div style={{ fontSize: 13, color: mutedText, marginTop: 4, marginBottom: 12 }}>
          {route.name} &middot; {new Date(tripDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button onClick={handleComplete} style={{
            padding: '8px 16px', fontSize: 13, fontWeight: 600,
            background: 'var(--forest)', color: '#fff', border: 'none',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {'\u2705'} Mark as completed
          </button>
          <button onClick={handleClear} style={{
            padding: '8px 16px', fontSize: 13, fontWeight: 600,
            background: 'transparent', color: mutedText,
            border: `1px solid ${borderColor}`,
            borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Clear
          </button>
        </div>
      </div>
    )
  }

  // Active countdown
  const remaining = daysUntil(tripDate)

  return (
    <div style={{
      background: cardBg, borderRadius: 'var(--radius-md)',
      padding: '16px 20px', border: `1px solid ${borderColor}`, marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 16, fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>
          {remaining} day{remaining !== 1 ? 's' : ''} until your {route.name} trip! {'\u{1F43E}'}
        </div>
        <button onClick={handleClear} style={{
          background: 'none', border: 'none', fontSize: 11, cursor: 'pointer',
          color: 'var(--text-muted)', fontFamily: 'inherit', padding: '2px 6px',
          whiteSpace: 'nowrap',
        }}>
          {'\u2715'} Clear
        </button>
      </div>

      {/* Countdown grid */}
      {countdown && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14,
        }}>
          {[
            { label: 'Days', value: countdown.days },
            { label: 'Hours', value: countdown.hours },
            { label: 'Minutes', value: countdown.minutes },
          ].map(({ label, value }) => (
            <div key={label} style={{
              textAlign: 'center', padding: '10px 6px',
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--terracotta)', fontFamily: 'var(--font-display)' }}>
                {value}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginTop: 2 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prep checklist */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>
          Trip Prep Checklist
        </div>
        {PREP_CHECKLIST.map((item) => {
          const unlocked = remaining <= item.daysOut
          return (
            <div key={item.daysOut} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 0',
              opacity: unlocked ? 1 : 0.4,
              transition: 'opacity 0.3s',
            }}>
              <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>
                {unlocked ? item.icon : '\u{1F512}'}
              </span>
              <span style={{
                fontSize: 13, lineHeight: 1.4,
                color: unlocked ? (item.daysOut === 0 ? 'var(--terracotta)' : 'var(--forest)') : mutedText,
                fontWeight: unlocked && item.daysOut === 0 ? 700 : 400,
              }}>
                {item.text}
                {!unlocked && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>
                    (unlocks {item.daysOut} day{item.daysOut !== 1 ? 's' : ''} before)
                  </span>
                )}
              </span>
            </div>
          )
        })}
      </div>

      {/* Share */}
      <button onClick={handleShare} style={{
        width: '100%', padding: '10px 16px', fontSize: 13, fontWeight: 700,
        background: '#25D366', color: '#fff', border: 'none',
        borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'inherit',
        transition: 'all 0.2s',
      }}>
        {'\u{1F4AC}'} Share countdown on WhatsApp
      </button>
    </div>
  )
}

// Export for other components to read/set trip dates
export { loadTripDates, saveTripDate }
