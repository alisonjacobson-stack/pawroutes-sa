import React, { useState, useEffect, useMemo } from 'react'

const LS_KEY = 'pawroutes-completed'

function getTravelTitle(km) {
  if (km >= 2000) return { title: 'Legendary Explorer', emoji: '🌍' }
  if (km >= 1000) return { title: 'Cross-Country Champion', emoji: '🏅' }
  if (km >= 500) return { title: 'Highway Hero', emoji: '🦸' }
  if (km >= 100) return { title: 'Road Tripper', emoji: '🚗' }
  return { title: 'Backseat Beginner', emoji: '🐶' }
}

// Fun SA distance comparisons (km from Cape Town)
const SA_DISTANCES = [
  { dest: 'Stellenbosch', km: 50 },
  { dest: 'Hermanus', km: 120 },
  { dest: 'Knysna', km: 485 },
  { dest: 'Port Elizabeth', km: 770 },
  { dest: 'Durban', km: 1660 },
  { dest: 'Johannesburg', km: 1400 },
  { dest: 'Polokwane', km: 1700 },
]

function getDistanceFact(totalKm) {
  if (totalKm < 10) return null
  // Find the best comparison
  for (let i = SA_DISTANCES.length - 1; i >= 0; i--) {
    const d = SA_DISTANCES[i]
    const times = totalKm / d.km
    if (times >= 0.5) {
      return times >= 1
        ? `That's like driving from Cape Town to ${d.dest} ${times >= 2 ? `${Math.round(times)} times` : 'and back'}!`
        : `That's already halfway to ${d.dest} from Cape Town!`
    }
  }
  return null
}

export default function TravelStats({ pets = [], completedRoutes = [], routes = [], dark, open, onClose }) {
  // Persist completed routes
  useEffect(() => {
    if (completedRoutes.length > 0) {
      localStorage.setItem(LS_KEY, JSON.stringify(completedRoutes))
    }
  }, [completedRoutes])

  // Calculate stats from completed routes
  const stats = useMemo(() => {
    const completed = routes.filter(r => completedRoutes.includes(r.id))
    const totalKm = completed.reduce((sum, r) => sum + (r.freeRoute?.distance || 0), 0)
    const totalTollSaved = completed.reduce((sum, r) => sum + (r.tollRoute?.tollCost || 0), 0)
    const stopsVisited = completed.length * 4 // estimate
    const avgSpeed = 80 // km/h average on SA roads
    const totalHours = Math.round(totalKm / avgSpeed)
    const dogFoodBagCost = 650 // R650 for premium bag
    const dogFoodBags = Math.floor(totalTollSaved / dogFoodBagCost)

    return {
      completed,
      totalKm,
      routeCount: completed.length,
      stopsVisited,
      totalTollSaved,
      totalHours,
      dogFoodBags,
    }
  }, [completedRoutes, routes])

  if (!open) return null

  const distanceFact = getDistanceFact(stats.totalKm)
  const hasData = stats.routeCount > 0

  const cardBg = dark ? 'var(--card-dark)' : '#FFF'
  const borderColor = dark ? 'var(--border-dark)' : 'var(--border)'
  const mutedText = dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%', maxWidth: 500, maxHeight: '85vh',
          background: dark ? 'var(--bg-dark)' : 'var(--cream)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInUp 0.3s var(--ease-out)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: `1px solid ${borderColor}`,
          background: dark ? 'rgba(59,107,74,0.12)' : 'rgba(59,107,74,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>
              📊 Travel Stats
            </h2>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 'var(--radius-full)',
              background: dark ? 'var(--card-dark)' : 'var(--sand)',
              border: 'none', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'inherit',
            }}>✕</button>
          </div>
          <p style={{ fontSize: 13, color: mutedText, margin: '6px 0 0', lineHeight: 1.4 }}>
            Your pack's road trip journey across South Africa
          </p>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>

          {!hasData ? (
            /* Empty state */
            <div style={{
              textAlign: 'center', padding: '40px 20px',
            }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🐾</div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
                color: 'var(--terracotta)', margin: '0 0 10px',
              }}>
                Your adventure starts here!
              </h3>
              <p style={{
                fontSize: 14, color: mutedText, lineHeight: 1.6,
                maxWidth: 280, margin: '0 auto',
              }}>
                Complete your first route to start tracking stats. Every kilometre counts towards your travel titles.
              </p>
              <div style={{
                marginTop: 20, padding: '12px 16px',
                background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: 13, color: mutedText,
              }}>
                Tip: Select a route and explore it to mark it complete
              </div>
            </div>
          ) : (
            <>
              {/* Hero stat cards */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 10, marginBottom: 20,
              }}>
                {[
                  { label: 'Total Distance', value: `${stats.totalKm.toLocaleString()} km`, icon: '🛣️', accent: 'var(--forest)' },
                  { label: 'Routes Completed', value: stats.routeCount, icon: '✅', accent: 'var(--terracotta)' },
                  { label: 'Stops Visited', value: `~${stats.stopsVisited}`, icon: '📍', accent: 'var(--ochre)' },
                  { label: 'Tolls Saved', value: `R${stats.totalTollSaved.toLocaleString()}`, icon: '💰', accent: 'var(--forest)' },
                ].map((card, i) => (
                  <div key={i} style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: cardBg,
                    border: `1px solid ${borderColor}`,
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{card.icon}</div>
                    <div style={{
                      fontSize: 22, fontWeight: 800,
                      fontFamily: 'var(--font-display)',
                      color: card.accent,
                    }}>
                      {card.value}
                    </div>
                    <div style={{
                      fontSize: 11, fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                      color: mutedText, marginTop: 2,
                    }}>
                      {card.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Per-pet stats */}
              {pets.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{
                    fontSize: 14, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.04em', color: 'var(--terracotta)',
                    marginBottom: 10,
                  }}>
                    Travel Buddies
                  </h3>
                  {pets.map(pet => {
                    const { title, emoji } = getTravelTitle(stats.totalKm)
                    const addedDate = pet.addedAt
                      ? new Date(pet.addedAt).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' })
                      : 'recently'
                    return (
                      <div key={pet.id} style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: cardBg,
                        border: `1px solid ${borderColor}`,
                        marginBottom: 8,
                      }}>
                        {/* Photo or emoji fallback */}
                        <div style={{
                          width: 48, height: 48, borderRadius: 'var(--radius-full)',
                          background: dark ? 'rgba(255,255,255,0.08)' : 'var(--sand)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 24, flexShrink: 0,
                          overflow: 'hidden',
                        }}>
                          {pet.photo
                            ? <img src={pet.photo} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : (pet.type?.startsWith('dog') ? '🐕' : pet.type === 'cat' ? '🐱' : pet.type === 'bird' ? '🦜' : '🐾')
                          }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 15, fontWeight: 700 }}>{pet.name}</span>
                            <span style={{
                              fontSize: 10, fontWeight: 600,
                              padding: '2px 8px', borderRadius: 'var(--radius-full)',
                              background: 'var(--forest)', color: '#FFF',
                            }}>
                              {emoji} {title}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: mutedText, marginTop: 2 }}>
                            Travel buddy since {addedDate}
                          </div>
                          <div style={{ fontSize: 12, color: mutedText, marginTop: 2 }}>
                            {stats.totalKm.toLocaleString()} km across {stats.routeCount} routes
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Route log */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{
                  fontSize: 14, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.04em', color: 'var(--terracotta)',
                  marginBottom: 10,
                }}>
                  Route Log
                </h3>
                {stats.completed.map(route => (
                  <div key={route.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 0',
                    borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.04)'}`,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 'var(--radius-full)',
                      background: 'var(--forest)', color: '#FFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, flexShrink: 0,
                    }}>
                      ✓
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{route.name}</div>
                      <div style={{ fontSize: 12, color: mutedText }}>
                        {route.freeRoute?.distance || 0} km via {route.freeRoute?.road || 'toll-free route'}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 12, fontWeight: 600, color: 'var(--forest)',
                    }}>
                      {route.freeRoute?.time || ''}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fun facts */}
              <div>
                <h3 style={{
                  fontSize: 14, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.04em', color: 'var(--terracotta)',
                  marginBottom: 10,
                }}>
                  Fun Facts
                </h3>
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  {distanceFact && (
                    <div style={{
                      padding: '12px 14px', borderRadius: 'var(--radius-md)',
                      background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
                      fontSize: 13, lineHeight: 1.5,
                    }}>
                      🗺️ {distanceFact}
                    </div>
                  )}
                  {stats.totalTollSaved > 0 && (
                    <div style={{
                      padding: '12px 14px', borderRadius: 'var(--radius-md)',
                      background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
                      fontSize: 13, lineHeight: 1.5,
                    }}>
                      💰 You've saved enough on tolls to buy {stats.dogFoodBags || 'almost 1'} bag{stats.dogFoodBags !== 1 ? 's' : ''} of premium dog food (at R650/bag)!
                    </div>
                  )}
                  {stats.totalHours > 0 && (
                    <div style={{
                      padding: '12px 14px', borderRadius: 'var(--radius-md)',
                      background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
                      fontSize: 13, lineHeight: 1.5,
                    }}>
                      ⏱️ Your pack has been on the road for approximately {stats.totalHours} hour{stats.totalHours !== 1 ? 's' : ''} together — that's a lot of tail wags!
                    </div>
                  )}
                  {pets.length > 1 && (
                    <div style={{
                      padding: '12px 14px', borderRadius: 'var(--radius-md)',
                      background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
                      fontSize: 13, lineHeight: 1.5,
                    }}>
                      🐾 Your pack of {pets.length} has collectively covered {(stats.totalKm * pets.length).toLocaleString()} paw-kilometres!
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
