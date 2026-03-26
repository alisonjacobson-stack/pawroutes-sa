import React from 'react'

export default function VetSOS({ stops = [], dark, open, onClose, selectedRoute }) {
  if (!open) return null

  // Filter to vet stops, optionally scoped to selected route
  const allVets = stops.filter(s => s.category === 'vet')
  const vets = selectedRoute
    ? allVets.filter(s => s.routeId === selectedRoute.id || s.alsoOnRoute?.includes(selectedRoute.id))
    : allVets

  const sorted = [...vets].sort((a, b) => a.name.localeCompare(b.name))

  const fmt = (phone) => phone?.replace(/\s/g, '')

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
          width: '90%', maxWidth: 520, maxHeight: '85vh',
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
          borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
          background: dark ? 'rgba(196,91,91,0.15)' : 'rgba(196,91,91,0.08)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#C45B5B' }}>
              🚨 Vet SOS
            </h2>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 'var(--radius-full)',
              background: dark ? 'var(--card-dark)' : 'var(--sand)',
              border: 'none', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'inherit',
            }}>✕</button>
          </div>

          <div style={{
            padding: '10px 14px', borderRadius: 'var(--radius-md)',
            background: dark ? 'rgba(196,91,91,0.2)' : 'rgba(196,91,91,0.1)',
            border: '1px solid rgba(196,91,91,0.3)',
            fontSize: 14, lineHeight: 1.5,
            color: dark ? '#FFF' : 'var(--bark)',
          }}>
            Pet emergency? Stay calm. Here are the nearest vets{selectedRoute ? ' on your route' : ''}.
          </div>

          {selectedRoute && (
            <div style={{
              marginTop: 8, fontSize: 12, fontWeight: 600,
              color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
            }}>
              Showing vets on: {selectedRoute.name}
            </div>
          )}
        </div>

        {/* Vet list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
          {sorted.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏥</div>
              <p style={{ fontSize: 14, lineHeight: 1.5 }}>
                No vets found{selectedRoute ? ' on this route' : ''}. Try selecting a different route or check all routes.
              </p>
            </div>
          ) : (
            sorted.map(vet => (
              <div key={vet.id} style={{
                padding: 16, marginBottom: 12,
                background: dark ? 'var(--card-dark)' : '#FFF',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
                boxShadow: '0 2px 8px var(--shadow)',
              }}>
                {/* Name + after-hours badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>🏥</span>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, flex: 1 }}>
                    {vet.name}
                  </h3>
                  {vet.afterHours && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(74,124,89,0.15)',
                      color: 'var(--forest)',
                      border: '1px solid rgba(74,124,89,0.3)',
                      whiteSpace: 'nowrap',
                    }}>
                      24hr
                    </span>
                  )}
                </div>

                {/* Town + road */}
                <div style={{
                  fontSize: 13,
                  color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
                  marginBottom: 8,
                }}>
                  {vet.town}{vet.road ? ` \u2022 ${vet.road}` : ''}
                </div>

                {/* Description */}
                {vet.description && (
                  <p style={{
                    fontSize: 13, lineHeight: 1.5, margin: '0 0 10px',
                    color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
                  }}>
                    {vet.description}
                  </p>
                )}

                {/* Rating */}
                {vet.rating && (
                  <div style={{
                    fontSize: 12, marginBottom: 12,
                    color: 'var(--ochre)', fontWeight: 600,
                  }}>
                    {'★'.repeat(Math.round(vet.rating))}{'☆'.repeat(5 - Math.round(vet.rating))}
                    {' '}{vet.rating}
                  </div>
                )}

                {/* Call button */}
                {vet.phone ? (
                  <a
                    href={`tel:${fmt(vet.phone)}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 8, width: '100%', padding: '12px 16px',
                      background: '#C45B5B', color: '#FFF',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 15, fontWeight: 700,
                      textDecoration: 'none',
                      fontFamily: 'inherit',
                      transition: 'opacity 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>📞</span> Call Now — {vet.phone}
                  </a>
                ) : (
                  <div style={{
                    textAlign: 'center', padding: '10px 16px',
                    fontSize: 13, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
                    background: dark ? 'var(--bg-dark)' : 'var(--sand-light)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    No phone number available
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
