import React, { useState, useCallback } from 'react'

const STAMP_DESIGNS = {
  'jhb-cpt': { emoji: '🏔️', label: 'CAPE TOWN', subtitle: 'Table Mountain', color: '#3B6B4A' },
  'jhb-dbn': { emoji: '🌊', label: 'DURBAN', subtitle: 'Golden Mile', color: '#2C7DA0' },
  'jhb-kruger': { emoji: '🦁', label: 'KRUGER', subtitle: 'Big Five Country', color: '#C4613B' },
  'cpt-garden': { emoji: '🐋', label: 'GARDEN ROUTE', subtitle: 'Whale Coast', color: '#2D6A4F' },
  'jhb-blm': { emoji: '🌾', label: 'BLOEMFONTEIN', subtitle: 'Free State Plains', color: '#B5850B' },
  'pta-plk': { emoji: '🌳', label: 'LIMPOPO', subtitle: 'Baobab Country', color: '#6B4226' },
}

export default function PassportStamps({ completedRoutes = [], routes = [], dark, open, onClose }) {
  const [stampAnimating, setStampAnimating] = useState(null)
  const [localCompleted, setLocalCompleted] = useState(() => {
    try {
      const stored = localStorage.getItem('pawroutes-completed')
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })

  const handleMarkComplete = useCallback((routeId) => {
    setStampAnimating(routeId)
    setTimeout(() => {
      const updated = [...new Set([...localCompleted, routeId])]
      setLocalCompleted(updated)
      localStorage.setItem('pawroutes-completed', JSON.stringify(updated))
      setTimeout(() => setStampAnimating(null), 600)
    }, 100)
  }, [localCompleted])

  if (!open) return null

  // Merge prop + local completed
  const allCompleted = [...new Set([...completedRoutes, ...localCompleted])]
  const completedCount = routes.filter(r => allCompleted.includes(r.id)).length
  const totalRoutes = routes.length
  const pct = totalRoutes > 0 ? Math.round((completedCount / totalRoutes) * 100) : 0

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
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInUp 0.3s var(--ease-out)',
          // Leather passport texture
          background: dark
            ? 'linear-gradient(175deg, #2A1F14 0%, #1A1610 40%, #231A10 100%)'
            : 'linear-gradient(175deg, #8B6F47 0%, #6B4F2E 30%, #5A3E20 70%, #4A3018 100%)',
          position: 'relative',
        }}
      >
        {/* Leather grain overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          pointerEvents: 'none', borderRadius: 'var(--radius-lg)',
          opacity: dark ? 0.3 : 0.15,
        }} />

        {/* Header — Title Page */}
        <div style={{
          padding: '24px 24px 16px',
          borderBottom: '2px solid rgba(255,215,0,0.3)',
          textAlign: 'center', position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: 16, right: 16 }}>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,0.15)',
              border: 'none', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#D4A84B',
            }}>✕</button>
          </div>

          {/* SA coat of arms area */}
          <div style={{ fontSize: 36, marginBottom: 6 }}>🐾</div>
          <h2 style={{
            fontSize: 22, fontWeight: 800, margin: '0 0 2px',
            fontFamily: 'var(--font-display)',
            color: '#D4A84B',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}>
            PawRoutes Travel Passport
          </h2>
          <div style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.12em', color: 'rgba(212,168,75,0.7)',
          }}>
            Republic of South Africa
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 14 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 12, fontWeight: 600, color: 'rgba(212,168,75,0.8)',
              marginBottom: 6,
            }}>
              <span>{completedCount}/{totalRoutes} stamps collected</span>
              <span>{pct}%</span>
            </div>
            <div style={{
              height: 6, borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,0.1)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(90deg, #D4A84B, #E8C547)',
                transition: 'width 0.5s var(--ease-out)',
              }} />
            </div>
          </div>
        </div>

        {/* Stamp Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 14,
          }}>
            {routes.map(route => {
              const design = STAMP_DESIGNS[route.id] || { emoji: '📍', label: route.name, subtitle: '', color: '#666' }
              const isCompleted = allCompleted.includes(route.id)
              const isAnimating = stampAnimating === route.id

              return (
                <div key={route.id} style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 'var(--radius-md)',
                  background: isCompleted
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(255,255,255,0.03)',
                  border: `2px ${isCompleted ? 'solid' : 'dashed'} ${isCompleted ? 'rgba(212,168,75,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: 12,
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                }}>
                  {/* Stamp content */}
                  <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    transform: isAnimating ? 'scale(1.15)' : isCompleted ? `rotate(${(route.id.charCodeAt(0) % 7) - 3}deg)` : 'none',
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    animation: isAnimating ? 'stampSlam 0.5s ease-out' : 'none',
                    opacity: isCompleted ? 1 : 0.35,
                    filter: isCompleted ? 'none' : 'grayscale(1)',
                  }}>
                    {/* Circular stamp border */}
                    <div style={{
                      width: 80, height: 80,
                      borderRadius: 'var(--radius-full)',
                      border: `3px solid ${isCompleted ? design.color : 'rgba(255,255,255,0.2)'}`,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      position: 'relative',
                      boxShadow: isCompleted
                        ? `0 0 20px ${design.color}40, inset 0 0 12px ${design.color}20`
                        : 'none',
                    }}>
                      {/* Inner ring */}
                      <div style={{
                        position: 'absolute', inset: 3,
                        borderRadius: 'var(--radius-full)',
                        border: `1.5px ${isCompleted ? 'solid' : 'dashed'} ${isCompleted ? design.color : 'rgba(255,255,255,0.15)'}`,
                      }} />
                      <div style={{ fontSize: 28 }}>
                        {isCompleted ? design.emoji : '❓'}
                      </div>
                    </div>

                    {/* Label */}
                    <div style={{
                      marginTop: 8,
                      fontSize: 11, fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: isCompleted ? design.color : 'rgba(255,255,255,0.3)',
                      textAlign: 'center',
                      textShadow: isCompleted ? `0 0 8px ${design.color}40` : 'none',
                    }}>
                      {design.label}
                    </div>
                    {isCompleted && (
                      <div style={{
                        fontSize: 9, color: 'rgba(212,168,75,0.6)',
                        marginTop: 2, fontWeight: 500,
                      }}>
                        {design.subtitle}
                      </div>
                    )}
                  </div>

                  {/* Ink splash effect for completed stamps */}
                  {isCompleted && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `radial-gradient(ellipse at 60% 40%, ${design.color}15 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }} />
                  )}

                  {/* Mark as completed button for uncompleted */}
                  {!isCompleted && (
                    <button
                      onClick={() => handleMarkComplete(route.id)}
                      style={{
                        position: 'absolute', bottom: 8,
                        fontSize: 10, fontWeight: 600,
                        padding: '4px 10px', borderRadius: 'var(--radius-full)',
                        background: 'rgba(212,168,75,0.2)',
                        border: '1px solid rgba(212,168,75,0.3)',
                        color: '#D4A84B',
                        cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(212,168,75,0.35)'
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(212,168,75,0.2)'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      Stamp it ✦
                    </button>
                  )}

                  {/* Completed checkmark */}
                  {isCompleted && (
                    <div style={{
                      position: 'absolute', top: 6, right: 6,
                      width: 18, height: 18, borderRadius: 'var(--radius-full)',
                      background: 'var(--forest)', color: '#FFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700,
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Share button */}
          <button style={{
            width: '100%', marginTop: 20, padding: '12px 0',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(212,168,75,0.15)',
            border: '1px solid rgba(212,168,75,0.3)',
            color: '#D4A84B',
            fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,75,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,168,75,0.15)'}
          >
            📤 Share Your Passport
          </button>

          {completedCount === totalRoutes && totalRoutes > 0 && (
            <div style={{
              textAlign: 'center', padding: '16px 0 0',
              fontFamily: 'var(--font-display)', fontSize: 18,
              color: '#D4A84B',
            }}>
              🎉 All stamps collected! True Mzansi Explorer! 🐾
            </div>
          )}
        </div>

        {/* Stamp animation keyframes */}
        <style>{`
          @keyframes stampSlam {
            0% { transform: scale(2.5) rotate(-15deg); opacity: 0; }
            40% { transform: scale(0.9) rotate(2deg); opacity: 1; }
            60% { transform: scale(1.1) rotate(-1deg); }
            80% { transform: scale(0.98) rotate(0.5deg); }
            100% { transform: scale(1) rotate(${Math.random() * 6 - 3}deg); }
          }
        `}</style>
      </div>
    </div>
  )
}
