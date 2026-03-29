import React from 'react'
import { STOP_CATEGORIES } from '../data/stops'
import ListVenueCTA from './ListVenueCTA'
import { getMultiPetStopScore, getRecommendedStopInterval } from './MyPackPanel'

const FUEL_RATE = 24 // R/litre
const CONSUMPTION = 9 // litres/100km average

function PawScore({ score, size = 20 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, fontSize: size }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ opacity: i <= score ? 1 : 0.2 }}>🐾</span>
      ))}
    </span>
  )
}

function RouteCard({ route, isSelected, onClick, dark, isWishlisted, onToggleWishlist }) {
  const bg = dark ? 'var(--card-dark)' : '#FFF'
  const border = isSelected ? 'var(--terracotta)' : dark ? 'var(--border-dark)' : 'var(--border)'
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '16px',
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all 0.2s var(--ease-out)',
        boxShadow: isSelected ? '0 4px 16px rgba(196,97,59,0.15)' : '0 1px 4px var(--shadow)',
        transform: isSelected ? 'scale(1.01)' : 'scale(1)',
        fontFamily: 'inherit',
        color: 'inherit',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
            {route.name}
          </h3>
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
            color: 'var(--forest)', textTransform: 'uppercase', marginTop: 2, display: 'block',
          }}>
            {route.freeRoute.road}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {onToggleWishlist && (
            <span
              onClick={(e) => { e.stopPropagation(); onToggleWishlist() }}
              style={{
                fontSize: 16, cursor: 'pointer', transition: 'transform 0.2s',
                filter: isWishlisted ? 'none' : 'grayscale(1) opacity(0.4)',
              }}
              title={isWishlisted ? 'Remove from bucket list' : 'Add to bucket list'}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isWishlisted ? '❤️' : '🤍'}
            </span>
          )}
          <PawScore score={route.pawScore} size={14} />
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
        fontSize: 12, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--forest)', marginBottom: 1 }}>
            {route.freeRoute.distance}km
          </div>
          distance
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--bark)', marginBottom: 1 }}>
            {route.freeRoute.time}
          </div>
          drive time
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--terracotta)', marginBottom: 1 }}>
            R{route.tollRoute.tollCost}
          </div>
          toll saved
        </div>
      </div>
    </button>
  )
}

function PackCompatBadge({ stops, pets, dark }) {
  if (!pets || pets.length < 2) return null

  const staysAndRestaurants = stops.filter(s => s.category === 'stay' || s.category === 'restaurant')
  const compatible = staysAndRestaurants.filter(s => {
    const { fits } = getMultiPetStopScore(s, pets)
    return fits
  })
  const incompatible = staysAndRestaurants.filter(s => {
    const { fits } = getMultiPetStopScore(s, pets)
    return !fits
  })
  const interval = getRecommendedStopInterval(pets)

  return (
    <div style={{
      padding: '12px 14px', marginBottom: 16,
      background: dark ? 'rgba(196,157,59,0.1)' : 'rgba(196,157,59,0.06)',
      border: `1px solid ${dark ? 'rgba(196,157,59,0.2)' : 'rgba(196,157,59,0.15)'}`,
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        🐾 Pack Compatibility ({pets.length} pets)
      </div>
      <div style={{ display: 'flex', gap: 8, fontSize: 12, flexWrap: 'wrap' }}>
        <span style={{
          padding: '3px 8px', borderRadius: 'var(--radius-full)',
          background: dark ? 'rgba(59,107,74,0.2)' : 'rgba(59,107,74,0.1)',
          color: 'var(--forest)', fontWeight: 600,
        }}>
          ✓ {compatible.length} stops fit your pack
        </span>
        {incompatible.length > 0 && (
          <span style={{
            padding: '3px 8px', borderRadius: 'var(--radius-full)',
            background: dark ? 'rgba(196,91,91,0.15)' : 'rgba(196,91,91,0.08)',
            color: 'var(--terracotta)', fontWeight: 600,
          }}>
            ✕ {incompatible.length} won't fit
          </span>
        )}
        <span style={{
          padding: '3px 8px', borderRadius: 'var(--radius-full)',
          background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
          fontWeight: 500,
        }}>
          ⏱️ Stop every {interval}min
        </span>
      </div>
      {incompatible.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
          {incompatible.map(s => {
            const { note } = getMultiPetStopScore(s, pets)
            return (
              <div key={s.id} style={{ display: 'flex', gap: 4, marginBottom: 2 }}>
                <span style={{ color: 'var(--terracotta)' }}>✕</span>
                <span><strong>{s.name}</strong> — {note}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function RouteDetail({ route, stops, showToll, onToggleToll, dark, pets }) {
  const fuelCost = Math.round((route.freeRoute.distance / 100) * CONSUMPTION * FUEL_RATE)
  const tollFuelCost = Math.round((route.tollRoute.distance / 100) * CONSUMPTION * FUEL_RATE)
  const routeStops = stops.filter(s => s.routeId === route.id || s.alsoOnRoute?.includes(route.id))
  const stopCounts = {}
  routeStops.forEach(s => { stopCounts[s.category] = (stopCounts[s.category] || 0) + 1 })

  return (
    <div style={{ animation: 'slideInUp 0.3s var(--ease-out)' }}>
      {/* Description */}
      <div style={{
        padding: '14px 16px', margin: '0 -16px 16px',
        background: dark ? 'rgba(59,107,74,0.15)' : 'rgba(59,107,74,0.08)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-display)', fontSize: 17, lineHeight: 1.5,
        color: dark ? 'var(--sage-light)' : 'var(--forest-dark)',
      }}>
        {route.freeRoute.description}
      </div>

      {/* Toll comparison toggle */}
      <button
        onClick={onToggleToll}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          padding: '12px 14px', marginBottom: 16,
          background: showToll
            ? (dark ? 'rgba(196,91,91,0.15)' : 'rgba(196,91,91,0.08)')
            : (dark ? 'var(--card-dark)' : 'var(--sand-light)'),
          border: `1px solid ${showToll ? 'var(--terracotta-light)' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'inherit',
          color: 'inherit', fontSize: 13,
        }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: 'var(--radius-full)',
          border: `2px solid ${showToll ? 'var(--terracotta)' : 'var(--text-muted)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: showToll ? 'var(--terracotta)' : 'transparent',
          transition: 'all 0.2s',
        }}>
          {showToll && <span style={{ color: '#FFF', fontSize: 11, fontWeight: 700 }}>✓</span>}
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>Show toll route comparison</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 1 }}>
            {route.tollRoute.road} — {route.tollRoute.distance}km, {route.tollRoute.time}
          </div>
        </div>
      </button>

      {/* Multi-pet compatibility */}
      <PackCompatBadge stops={routeStops} pets={pets} dark={dark} />

      {/* Stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16,
      }}>
        {[
          { label: 'Toll-free distance', value: `${route.freeRoute.distance}km`, color: 'var(--forest)' },
          { label: 'Drive time', value: route.freeRoute.time, color: 'var(--bark)' },
          { label: 'Est. fuel cost', value: `R${fuelCost.toLocaleString()}`, color: 'var(--ochre)' },
          { label: 'Toll savings', value: `R${route.tollRoute.tollCost}`, color: 'var(--terracotta)' },
          { label: 'Pet-friendly stops', value: routeStops.length, color: 'var(--forest-light)' },
          { label: 'Paw Score', value: <PawScore score={route.pawScore} size={12} />, color: 'var(--ochre)' },
        ].map((stat, i) => (
          <div key={i} style={{
            padding: '10px 12px',
            background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
          }}>
            <div style={{ fontSize: 11, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Stop categories on route */}
      <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
        Stops on this route
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {Object.entries(stopCounts).map(([cat, count]) => (
          <span key={cat} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 10px', fontSize: 12, fontWeight: 500,
            background: dark ? 'var(--card-dark)' : '#FFF',
            border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-full)',
          }}>
            {STOP_CATEGORIES[cat]?.icon} {STOP_CATEGORIES[cat]?.label} ({count})
          </span>
        ))}
      </div>

      {/* Individual stop cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {routeStops.map(stop => (
          <div key={stop.id} style={{
            padding: '10px 14px',
            background: dark ? 'var(--card-dark)' : '#FFF',
            border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{STOP_CATEGORIES[stop.category]?.icon}</span>
                  {stop.name}
                </div>
                <div style={{ fontSize: 11, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)', marginTop: 2 }}>
                  {stop.town} · {stop.road}
                </div>
                {stop.petPolicy && (
                  <div style={{ fontSize: 11, color: 'var(--forest)', marginTop: 3 }}>
                    🐾 {stop.petPolicy}
                  </div>
                )}
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${stop.coords[0]},${stop.coords[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '4px 10px', fontSize: 11, fontWeight: 600,
                  background: 'var(--forest)', color: '#FFF',
                  borderRadius: 'var(--radius-full)',
                  textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                Navigate 📍
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison if toll shown */}
      {showToll && (
        <div style={{
          marginTop: 16, padding: 14,
          background: dark ? 'rgba(196,91,91,0.1)' : 'rgba(196,91,91,0.06)',
          borderRadius: 'var(--radius-md)',
          border: `1px dashed ${dark ? 'rgba(196,91,91,0.3)' : 'rgba(196,91,91,0.2)'}`,
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: 'var(--terracotta)' }}>
            ⚠️ Toll Route Comparison
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Toll route:</span><br />
              <strong>{route.tollRoute.distance}km · {route.tollRoute.time}</strong><br />
              <span style={{ color: 'var(--terracotta)' }}>Tolls: R{route.tollRoute.tollCost} + Fuel: R{tollFuelCost.toLocaleString()}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Free route:</span><br />
              <strong>{route.freeRoute.distance}km · {route.freeRoute.time}</strong><br />
              <span style={{ color: 'var(--forest)' }}>Tolls: R0 + Fuel: R{fuelCost.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ marginTop: 10, padding: '8px 10px', background: dark ? 'var(--card-dark)' : '#FFF', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600 }}>
            💰 You save <span style={{ color: 'var(--terracotta)' }}>R{route.tollRoute.tollCost + tollFuelCost - fuelCost}</span> by taking the free route
            <span style={{ fontWeight: 400, fontSize: 11, display: 'block', marginTop: 2, color: 'var(--text-muted)' }}>
              ({route.freeRoute.distance - route.tollRoute.distance > 0 ? '+' : ''}{route.freeRoute.distance - route.tollRoute.distance}km, extra {
                (() => {
                  const [fH, fM] = route.freeRoute.time.replace(/h|m/g, '').trim().split(' ').map(Number)
                  const [tH, tM] = route.tollRoute.time.replace(/h|m/g, '').trim().split(' ').map(Number)
                  const diff = (fH * 60 + (fM || 0)) - (tH * 60 + (tM || 0))
                  const h = Math.floor(diff / 60)
                  const m = diff % 60
                  return h > 0 ? `${h}h ${m}m` : `${m}m`
                })()
              } drive time)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RoutePanel({
  routes, selectedRoute, onSelectRoute, stops,
  showToll, onToggleToll, activeFilters, onToggleFilter, dark, pets,
  wishlist, onToggleWishlist, TripCountdown, RouteWishlist, onListVenue,
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
    }}>
      {/* Route selector */}
      {!selectedRoute && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
          {/* Onboarding hero */}
          <div style={{
            background: dark
              ? 'linear-gradient(135deg, rgba(196,97,59,0.12) 0%, rgba(59,107,74,0.08) 100%)'
              : 'linear-gradient(135deg, rgba(196,97,59,0.08) 0%, rgba(59,107,74,0.06) 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 18px',
            marginBottom: 16,
            border: `1px solid ${dark ? 'rgba(196,97,59,0.15)' : 'rgba(196,97,59,0.12)'}`,
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🐾🚗💨</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
              color: dark ? 'var(--text-dark)' : 'var(--text)',
              lineHeight: 1.2, marginBottom: 6,
            }}>
              Where are you &amp; your pack headed?
            </div>
            <p style={{
              fontSize: 14, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
              margin: 0, lineHeight: 1.5,
            }}>
              Pick a route below. We'll show you the <strong style={{ color: 'var(--forest)' }}>toll-free alternative</strong>, every pet-friendly stop, and exactly how much you'll save.
            </p>
            {/* Quick stats */}
            <div style={{
              display: 'flex', gap: 12, marginTop: 14,
              flexWrap: 'wrap',
            }}>
              {[
                { icon: '🛣️', label: `${routes.length} routes`, color: 'var(--forest)' },
                { icon: '📍', label: `${stops.length} pet stops`, color: 'var(--terracotta)' },
                { icon: '💰', label: 'R85–R580 saved', color: 'var(--ochre)' },
              ].map((s, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 12, fontWeight: 600,
                  padding: '5px 10px',
                  background: dark ? 'var(--card-dark)' : 'rgba(255,255,255,0.8)',
                  borderRadius: 'var(--radius-full)',
                  color: s.color,
                }}>
                  {s.icon} {s.label}
                </span>
              ))}
            </div>
          </div>

          <div style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
            marginBottom: 10, paddingLeft: 2,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>👇</span> Pick your route
          </div>

          {/* Wishlist section */}
          {RouteWishlist}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {routes.map(route => (
              <RouteCard
                key={route.id}
                route={route}
                isSelected={false}
                onClick={() => onSelectRoute(route)}
                dark={dark}
                isWishlisted={wishlist?.includes(route.id)}
                onToggleWishlist={onToggleWishlist ? () => onToggleWishlist(route.id) : undefined}
              />
            ))}
          </div>

          {/* List Your Venue CTA */}
          {onListVenue && (
            <div style={{ marginTop: 16 }}>
              <ListVenueCTA variant="secondary" onClick={onListVenue} dark={dark} />
            </div>
          )}
        </div>
      )}

      {/* Route detail view */}
      {selectedRoute && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
          <button
            onClick={() => onSelectRoute(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, color: 'var(--terracotta)',
              padding: '4px 0', marginBottom: 12, fontFamily: 'inherit',
            }}
          >
            ← All routes
          </button>

          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, lineHeight: 1.2 }}>
            {selectedRoute.name}
          </h2>

          {/* Trip Countdown */}
          {TripCountdown}

          <RouteDetail
            route={selectedRoute}
            stops={stops}
            showToll={showToll}
            onToggleToll={onToggleToll}
            dark={dark}
            pets={pets}
          />

          {/* Stop filter chips */}
          <div style={{
            marginTop: 20, paddingTop: 16,
            borderTop: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
          }}>
            <div style={{ fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: 10 }}>
              Filter map markers
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Object.entries(STOP_CATEGORIES).map(([key, cat]) => {
                const active = activeFilters.length === 0 || activeFilters.includes(key)
                return (
                  <button
                    key={key}
                    onClick={() => onToggleFilter(key)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '6px 12px', fontSize: 12, fontWeight: 500,
                      background: active ? (dark ? 'var(--forest-dark)' : 'var(--forest)') : (dark ? 'var(--card-dark)' : 'var(--sand-light)'),
                      color: active ? '#FFF' : 'inherit',
                      border: `1px solid ${active ? 'transparent' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-full)',
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                  >
                    {cat.icon} {cat.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
