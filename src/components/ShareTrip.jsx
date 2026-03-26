import React, { useState } from 'react'

const PET_EMOJI = {
  dog: '\u{1F9AE}', 'dog-small': '\u{1F436}', 'dog-medium': '\u{1F9AE}', 'dog-large': '\u{1F9AE}',
  cat: '\u{1F431}', bird: '\u{1F99C}', rabbit: '\u{1F430}',
}

function petEmoji(type) {
  return PET_EMOJI[type] || '\u{1F43E}'
}

function buildShareText(route, stops, pets) {
  const petList = pets.map(p => `${p.name} (${petEmoji(p.type)})`).join(' and ')
  const routeName = route?.name || 'our road trip'
  const distance = route?.tollRoute?.distance || route?.freeRoute?.distance || '?'

  let text = `\u{1F43E} Road Trip Alert! We're taking ${petList} on the ${routeName} route!\n\n`
  text += `\u{1F697} Distance: ${distance}km\n`

  if (stops && stops.length > 0) {
    text += `\n\u{1F4CD} Planned Stops:\n`
    stops.forEach((s, i) => {
      const icon = s.category === 'farm' ? '\u{1F3E1}' :
        s.category === 'park' ? '\u{1F333}' :
        s.category === 'stay' ? '\u{1F3E8}' :
        s.category === 'vet' ? '\u{1F3E5}' :
        s.category === 'rest' ? '\u26FD' :
        s.category === 'restaurant' ? '\u{1F37D}\uFE0F' : '\u{1F4CC}'
      text += `  ${icon} ${s.name} (${s.town})\n`
    })
  }

  const estimatedFuel = Math.round(distance * 2.2)
  const estimatedTolls = route?.tollRoute?.tollCost || 0
  text += `\n\u{1F4B0} Est. cost: ~R${estimatedFuel} fuel`
  if (estimatedTolls > 0) text += ` + R${estimatedTolls} tolls`
  text += '\n'

  text += `\n\u{2B50} Planned with PawRoutes SA \u{1F1FF}\u{1F1E6}`
  return text
}

export default function ShareTrip({ route, stops = [], pets = [], dark, open, onClose }) {
  const [copied, setCopied] = useState(false)

  if (!open) return null

  const shareText = buildShareText(route, stops, pets)
  const distance = route?.tollRoute?.distance || route?.freeRoute?.distance || '?'
  const estimatedFuel = Math.round((typeof distance === 'number' ? distance : 0) * 2.2)
  const estimatedTolls = route?.tollRoute?.tollCost || 0

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = shareText
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(shareText)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
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
          width: '90%', maxWidth: 480, maxHeight: '85vh',
          background: dark ? 'var(--bg-dark)' : 'var(--cream)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: 'var(--shadow-heavy)',
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
            <h2 style={{
              fontSize: 22, fontWeight: 800, margin: 0,
              fontFamily: 'var(--font-display)',
            }}>
              {'\u{1F4E4}'} Share Trip Plan
            </h2>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', fontSize: 22, cursor: 'pointer',
              color: 'var(--text-muted)', padding: '4px 8px', lineHeight: 1,
            }}>{'\u2715'}</button>
          </div>
          {route && (
            <div style={{
              fontSize: 13, color: 'var(--text-secondary)', marginTop: 4,
            }}>
              {route.name} &middot; {distance}km &middot; {pets.length} pet{pets.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Preview Card */}
        <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>
            Preview
          </div>
          <div style={{
            background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
          }}>
            {/* Route header */}
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
              {'\u{1F43E}'} Road Trip Alert!
            </div>
            <div style={{ fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>
              Taking {pets.map(p => `${p.name} ${petEmoji(p.type)}`).join(' & ')} on the{' '}
              <strong>{route?.name || 'road trip'}</strong> route
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
              {'\u{1F697}'} {distance}km
            </div>

            {/* Stops */}
            {stops.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  {'\u{1F4CD}'} Planned Stops ({stops.length})
                </div>
                {stops.map((s, i) => (
                  <div key={s.id || i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '2px 0' }}>
                    &bull; {s.name} <span style={{ color: 'var(--text-muted)' }}>({s.town})</span>
                  </div>
                ))}
              </div>
            )}

            {/* Cost */}
            <div style={{
              fontSize: 12, padding: '8px 12px',
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              borderRadius: 'var(--radius-sm)', marginTop: 8,
            }}>
              <span style={{ fontWeight: 600 }}>{'\u{1F4B0}'} Est. cost:</span>{' '}
              ~R{estimatedFuel.toLocaleString()} fuel
              {estimatedTolls > 0 && ` + R${estimatedTolls} tolls`}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={handleCopy} style={{
              flex: 1, padding: '12px 16px', fontSize: 14, fontWeight: 700,
              background: copied ? 'var(--forest)' : (dark ? 'var(--card-dark)' : 'var(--sand)'),
              color: copied ? '#fff' : 'inherit',
              border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
              {copied ? '\u2705 Copied!' : '\u{1F4CB} Copy to Clipboard'}
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
        </div>
      </div>
    </div>
  )
}
