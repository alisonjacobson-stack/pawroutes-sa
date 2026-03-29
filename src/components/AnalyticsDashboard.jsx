import React, { useState, useMemo } from 'react'
import { getStopFreshness } from '../utils/freshness'

const LS_KEY = 'pawroutes-analytics'

// ── Tracking utility ──────────────────────────────────────────────
// Event types: route_view, stop_click, review_added, venue_submitted,
//              trip_planned, share, postcard_created

export function trackEvent(type, data = {}) {
  try {
    const events = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    events.push({ type, data, timestamp: Date.now() })
    // Cap at 2000 events to avoid bloating localStorage
    if (events.length > 2000) events.splice(0, events.length - 2000)
    localStorage.setItem(LS_KEY, JSON.stringify(events))
  } catch { /* localStorage full or unavailable — fail silently */ }
}

function readEvents() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') }
  catch { return [] }
}

// ── Time helpers ──────────────────────────────────────────────────

const RANGES = [
  { key: '7d', label: 'Last 7 days', ms: 7 * 86_400_000 },
  { key: '30d', label: 'Last 30 days', ms: 30 * 86_400_000 },
  { key: 'all', label: 'All time', ms: Infinity },
]

function filterByRange(events, rangeKey) {
  const range = RANGES.find(r => r.key === rangeKey) || RANGES[2]
  if (range.ms === Infinity) return events
  const cutoff = Date.now() - range.ms
  return events.filter(e => e.timestamp >= cutoff)
}

function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const EVENT_LABELS = {
  route_view: { icon: '🗺️', label: 'Viewed route' },
  stop_click: { icon: '📍', label: 'Clicked stop' },
  review_added: { icon: '⭐', label: 'Added review' },
  venue_submitted: { icon: '🏡', label: 'Submitted venue' },
  trip_planned: { icon: '📋', label: 'Planned trip' },
  share: { icon: '📤', label: 'Shared' },
  postcard_created: { icon: '🖼️', label: 'Created postcard' },
}

// ── Bar chart component ───────────────────────────────────────────

function BarChart({ items, dark, maxBars = 8 }) {
  const visible = items.slice(0, maxBars)
  const maxVal = Math.max(...visible.map(i => i.value), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {visible.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 110, fontSize: 12, fontWeight: 600,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            color: dark ? '#E8DFD4' : '#2C2418',
            flexShrink: 0,
          }}>{item.label}</div>
          <div style={{ flex: 1, height: 22, borderRadius: 'var(--radius-sm)', overflow: 'hidden',
            background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
            <div style={{
              width: `${Math.max((item.value / maxVal) * 100, 2)}%`,
              height: '100%',
              background: 'var(--terracotta)',
              borderRadius: 'var(--radius-sm)',
              transition: 'width 0.4s ease-out',
            }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, minWidth: 28, textAlign: 'right',
            color: dark ? '#E8DFD4' : '#2C2418' }}>{item.value}</span>
        </div>
      ))}
      {items.length === 0 && (
        <div style={{ fontSize: 13, color: dark ? 'var(--text-muted)' : 'var(--text-secondary)', textAlign: 'center', padding: 16 }}>
          No data yet
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────

export default function AnalyticsDashboard({ routes = [], stops = [], dark, open, onClose }) {
  const [range, setRange] = useState('30d')

  const allEvents = useMemo(() => readEvents(), [open])
  const events = useMemo(() => filterByRange(allEvents, range), [allEvents, range])

  // Route popularity
  const routeViews = useMemo(() => {
    const counts = {}
    events.filter(e => e.type === 'route_view').forEach(e => {
      const id = e.data?.routeId || e.data?.routeName || 'unknown'
      counts[id] = (counts[id] || 0) + 1
    })
    return routes
      .map(r => ({ label: r.name, value: counts[r.id] || 0 }))
      .sort((a, b) => b.value - a.value)
  }, [events, routes])

  // Top stops
  const topStops = useMemo(() => {
    const counts = {}
    events.filter(e => e.type === 'stop_click').forEach(e => {
      const id = e.data?.stopId || 'unknown'
      counts[id] = (counts[id] || 0) + 1
    })
    return Object.entries(counts)
      .map(([id, count]) => {
        const stop = stops.find(s => s.id === id)
        return { label: stop ? stop.name : id, value: count }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [events, stops])

  // Engagement stats
  const engagement = useMemo(() => {
    const countType = (t) => events.filter(e => e.type === t).length
    return {
      reviews: countType('review_added'),
      venues: countType('venue_submitted'),
      shares: countType('share'),
      trips: countType('trip_planned'),
      postcards: countType('postcard_created'),
    }
  }, [events])

  // Freshness overview
  const freshness = useMemo(() => {
    const counts = { fresh: 0, stale: 0, unverified: 0 }
    stops.forEach(s => {
      const f = getStopFreshness(s.id)
      counts[f.status] = (counts[f.status] || 0) + 1
    })
    return counts
  }, [stops])

  // Recent activity (last 10)
  const recent = useMemo(
    () => [...events].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10),
    [events]
  )

  if (!open) return null

  const cardBg = dark ? 'var(--card-dark)' : '#FFF'
  const borderColor = dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.06)'
  const mutedColor = dark ? 'var(--text-muted)' : 'var(--text-secondary)'

  const cardStyle = {
    padding: 16, marginBottom: 14,
    background: cardBg,
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${borderColor}`,
    boxShadow: '0 2px 8px var(--shadow)',
  }

  const sectionTitle = {
    fontSize: 14, fontWeight: 700, marginBottom: 10,
    fontFamily: 'var(--font-display)',
    color: dark ? '#E8DFD4' : '#2C2418',
  }

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
          width: '90%', maxWidth: 560, maxHeight: '85vh',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>
              📊 Analytics
            </h2>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 'var(--radius-full)',
              background: dark ? 'var(--card-dark)' : 'var(--sand)',
              border: 'none', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'inherit',
            }}>✕</button>
          </div>

          {/* Time range filter */}
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {RANGES.map(r => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                style={{
                  padding: '5px 12px', fontSize: 12, fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${range === r.key ? 'var(--terracotta)' : borderColor}`,
                  background: range === r.key ? 'var(--terracotta)' : 'transparent',
                  color: range === r.key ? '#FFF' : (dark ? '#E8DFD4' : '#2C2418'),
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >{r.label}</button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>

          {/* Engagement stats */}
          <div style={cardStyle}>
            <div style={sectionTitle}>Engagement</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { icon: '⭐', label: 'Reviews', value: engagement.reviews },
                { icon: '🏡', label: 'Venues', value: engagement.venues },
                { icon: '📤', label: 'Shares', value: engagement.shares },
                { icon: '📋', label: 'Trips', value: engagement.trips },
                { icon: '🖼️', label: 'Postcards', value: engagement.postcards },
                { icon: '🗺️', label: 'Route views', value: events.filter(e => e.type === 'route_view').length },
              ].map((s, i) => (
                <div key={i} style={{
                  textAlign: 'center', padding: '10px 4px',
                  background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <div style={{ fontSize: 22 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: 2 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: mutedColor }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Route popularity */}
          <div style={cardStyle}>
            <div style={sectionTitle}>Route Popularity</div>
            <BarChart items={routeViews} dark={dark} />
          </div>

          {/* Top stops */}
          <div style={cardStyle}>
            <div style={sectionTitle}>Top Stops</div>
            <BarChart items={topStops} dark={dark} />
          </div>

          {/* Freshness overview */}
          <div style={cardStyle}>
            <div style={sectionTitle}>Stop Freshness</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'Fresh', count: freshness.fresh, color: '#22c55e', icon: '✅' },
                { label: 'Stale', count: freshness.stale, color: '#f59e0b', icon: '⚠️' },
                { label: 'Unverified', count: freshness.unverified, color: '#9ca3af', icon: '❓' },
              ].map((f, i) => (
                <div key={i} style={{
                  flex: 1, textAlign: 'center', padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  border: `2px solid ${f.color}22`,
                }}>
                  <div style={{ fontSize: 18 }}>{f.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: f.color }}>{f.count}</div>
                  <div style={{ fontSize: 11, color: mutedColor }}>{f.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: mutedColor, marginTop: 8, textAlign: 'center' }}>
              {stops.length} total stops tracked
            </div>
          </div>

          {/* Recent activity */}
          <div style={cardStyle}>
            <div style={sectionTitle}>Recent Activity</div>
            {recent.length === 0 ? (
              <div style={{ fontSize: 13, color: mutedColor, textAlign: 'center', padding: 16 }}>
                No activity recorded yet. Browse routes and stops to start tracking!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {recent.map((evt, i) => {
                  const meta = EVENT_LABELS[evt.type] || { icon: '📌', label: evt.type }
                  const name = evt.data?.routeName || evt.data?.stopName || evt.data?.name || ''
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 0',
                      borderBottom: i < recent.length - 1 ? `1px solid ${borderColor}` : 'none',
                    }}>
                      {/* Timeline dot */}
                      <div style={{
                        width: 28, height: 28, borderRadius: 'var(--radius-full)',
                        background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, flexShrink: 0,
                      }}>{meta.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 600,
                          color: dark ? '#E8DFD4' : '#2C2418',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {meta.label}{name ? ` — ${name}` : ''}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: mutedColor, flexShrink: 0 }}>
                        {timeAgo(evt.timestamp)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
