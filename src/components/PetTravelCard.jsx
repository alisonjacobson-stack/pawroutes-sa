import React, { useRef, useMemo } from 'react'

const PET_EMOJI = {
  dog: '🐕', 'dog-small': '🐶', 'dog-medium': '🐕', 'dog-large': '🐕',
  cat: '🐱', bird: '🦜', rabbit: '🐰',
}

function petEmoji(type) {
  return PET_EMOJI[type] || '🐾'
}

function getTravelTitle(km) {
  if (km >= 2000) return { title: 'Legendary Explorer', emoji: '🌍' }
  if (km >= 1000) return { title: 'Cross-Country Champion', emoji: '🏅' }
  if (km >= 500) return { title: 'Highway Hero', emoji: '🦸' }
  if (km >= 100) return { title: 'Road Tripper', emoji: '🚗' }
  return { title: 'Backseat Beginner', emoji: '🐶' }
}

const BADGES = [
  { id: 'karoo-crosser', icon: '🏜️', name: 'Karoo Crosser', condition: cr => cr.includes('jhb-cpt') },
  { id: 'garden-route', icon: '🌊', name: 'Garden Route', condition: cr => cr.includes('cpt-garden-route') },
  { id: 'toll-free', icon: '💰', name: 'Toll-Free', condition: cr => cr.length >= 1 },
  { id: 'road-warrior', icon: '🛣️', name: 'Road Warrior', condition: cr => cr.length >= 3 },
  { id: 'night-rider', icon: '🌙', name: 'Night Rider', condition: () => false },
  { id: 'community', icon: '⭐', name: 'Community Hero', condition: () => false },
]

const SA_QUOTES = [
  'Made in Mzansi 🇿🇦',
  'Bilt for the bakkie life 🇿🇦',
  'From the Cape to Limpopo 🇿🇦',
  'Eish, what a journey! 🇿🇦',
  'Lekker road trips only 🇿🇦',
]

export default function PetTravelCard({ pet, completedRoutes = [], routes = [], dark, open, onClose }) {
  const cardRef = useRef(null)

  const stats = useMemo(() => {
    const completed = routes.filter(r => completedRoutes.includes(r.id))
    const totalKm = completed.reduce((sum, r) => sum + (r.freeRoute?.distance || 0), 0)
    const totalTollSaved = completed.reduce((sum, r) => sum + (r.tollRoute?.tollCost || 0), 0)
    const stopsVisited = completed.length * 4
    return { totalKm, routeCount: completed.length, stopsVisited, totalTollSaved }
  }, [completedRoutes, routes])

  const earnedBadges = useMemo(() =>
    BADGES.filter(b => b.condition(completedRoutes)).slice(0, 3),
    [completedRoutes]
  )

  const quote = useMemo(() =>
    SA_QUOTES[Math.floor(Math.random() * SA_QUOTES.length)],
    []
  )

  const { title, emoji } = getTravelTitle(stats.totalKm)

  const shareText = useMemo(() => {
    if (!pet) return ''
    let t = `🐾 ${pet.name}'s Travel Card\n\n`
    t += `${emoji} ${title}\n`
    t += `🛣️ ${stats.totalKm.toLocaleString()} km traveled\n`
    t += `✅ ${stats.routeCount} routes completed\n`
    t += `📍 ~${stats.stopsVisited} stops visited\n`
    if (stats.totalTollSaved > 0) t += `💰 R${stats.totalTollSaved.toLocaleString()} saved on tolls\n`
    if (earnedBadges.length > 0) {
      t += `\n🏆 Badges: ${earnedBadges.map(b => `${b.icon} ${b.name}`).join(', ')}\n`
    }
    t += `\n⭐ Track your pet's SA road trips at PawRoutes SA 🇿🇦`
    return t
  }, [pet, stats, title, emoji, earnedBadges])

  if (!open || !pet) return null

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
  }

  const handleScreenshot = () => {
    const cardEl = cardRef.current
    if (!cardEl) return
    const win = window.open('', '_blank', 'width=400,height=720')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${pet.name}'s Travel Card</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');
  body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #1a1a1a; font-family: 'Fredoka', sans-serif; }
  .card { width: 360px; border-radius: 24px; overflow: hidden; }
  p { margin: 0; } h2, h3 { margin: 0; }
</style></head><body>`)
    win.document.write(cardEl.outerHTML)
    win.document.write(`<p style="text-align:center;color:#999;font-size:13px;margin-top:16px;font-family:sans-serif;">Screenshot this card to save & share!</p>`)
    win.document.write('</body></html>')
    win.document.close()
  }

  // Card content (the shareable visual)
  const cardContent = (
    <div ref={cardRef} style={{
      width: '100%', maxWidth: 360, margin: '0 auto',
      borderRadius: 20, overflow: 'hidden',
      background: 'linear-gradient(165deg, #C1593B 0%, #C4983B 40%, #D4B896 75%, #E8D5B7 100%)',
      color: '#FFF', fontFamily: 'var(--font-display), Fredoka, sans-serif',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      position: 'relative',
    }}>
      {/* Subtle paw watermark */}
      <div style={{
        position: 'absolute', top: 30, right: -20,
        fontSize: 140, opacity: 0.06, pointerEvents: 'none',
        transform: 'rotate(-15deg)',
      }}>🐾</div>

      {/* Top section */}
      <div style={{ textAlign: 'center', padding: '32px 24px 20px', position: 'relative' }}>
        {/* Pet photo */}
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          margin: '0 auto 16px',
          background: 'rgba(255,255,255,0.2)',
          border: '4px solid rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 56, overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          {pet.photo
            ? <img src={pet.photo} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : petEmoji(pet.type)
          }
        </div>

        {/* Pet name */}
        <h2 style={{
          fontSize: 28, fontWeight: 700, margin: '0 0 6px',
          textShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          {pet.name}
        </h2>

        {/* Travel title */}
        <div style={{
          display: 'inline-block',
          padding: '5px 16px',
          borderRadius: 20,
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(4px)',
          fontSize: 14, fontWeight: 600,
          letterSpacing: '0.02em',
        }}>
          {emoji} {title}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 1, margin: '0 20px 16px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 16, overflow: 'hidden',
      }}>
        {[
          { label: 'KM TRAVELED', value: stats.totalKm.toLocaleString(), icon: '🛣️' },
          { label: 'ROUTES', value: stats.routeCount, icon: '✅' },
          { label: 'STOPS', value: `~${stats.stopsVisited}`, icon: '📍' },
          { label: 'TOLLS SAVED', value: `R${stats.totalTollSaved.toLocaleString()}`, icon: '💰' },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '14px 12px', textAlign: 'center',
            background: 'rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontSize: 20, marginBottom: 2 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</div>
            <div style={{
              fontSize: 9, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.08em', opacity: 0.8, marginTop: 2,
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Badges */}
      {earnedBadges.length > 0 && (
        <div style={{ padding: '0 24px 16px', textAlign: 'center' }}>
          <div style={{
            fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.08em', opacity: 0.7, marginBottom: 8,
          }}>
            Badges Earned
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            {earnedBadges.map(b => (
              <div key={b.id} style={{
                padding: '8px 14px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.15)',
                fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span style={{ fontSize: 18 }}>{b.icon}</span>
                <span>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer branding */}
      <div style={{
        padding: '14px 24px 18px', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.12)',
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.03em' }}>
          PawRoutes SA 🐾
        </div>
        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 3 }}>
          {quote}
        </div>
      </div>
    </div>
  )

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
          width: '90%', maxWidth: 440, maxHeight: '90vh',
          background: dark ? 'var(--bg-dark)' : 'var(--cream)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInUp 0.3s var(--ease-out)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px 12px',
          borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h2 style={{
            fontSize: 18, fontWeight: 800, margin: 0,
            fontFamily: 'var(--font-display)',
          }}>
            📸 {pet.name}'s Travel Card
          </h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 'var(--radius-full)',
            background: dark ? 'var(--card-dark)' : 'var(--sand)',
            border: 'none', cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'inherit',
          }}>✕</button>
        </div>

        {/* Card preview */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '16px 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          {cardContent}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 360 }}>
            <button onClick={handleScreenshot} style={{
              flex: 1, padding: '12px 16px', fontSize: 14, fontWeight: 700,
              background: dark ? 'var(--card-dark)' : 'var(--sand)',
              color: 'inherit',
              border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
              📱 Save as Image
            </button>
            <button onClick={handleWhatsApp} style={{
              flex: 1, padding: '12px 16px', fontSize: 14, fontWeight: 700,
              background: '#25D366', color: '#fff', border: 'none',
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
              💬 WhatsApp
            </button>
          </div>

          <div style={{
            fontSize: 12, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
            textAlign: 'center', lineHeight: 1.5, padding: '0 8px 8px',
          }}>
            Tip: Use "Save as Image" to open the card full-size — then screenshot to save!
          </div>
        </div>
      </div>
    </div>
  )
}
