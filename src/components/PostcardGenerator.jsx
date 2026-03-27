import React, { useState, useMemo } from 'react'

const PET_EMOJI = {
  dog: '🐕', 'dog-small': '🐶', 'dog-medium': '🦮', 'dog-large': '🐕',
  cat: '🐱', bird: '🦜', rabbit: '🐰',
}

function petEmoji(type) {
  return PET_EMOJI[type] || '🐾'
}

// Region detection from town name for CSS-art scenes
function getRegion(stop) {
  const town = (stop.town || '').toLowerCase()
  const name = (stop.name || '').toLowerCase()
  const desc = (stop.description || '').toLowerCase()

  if (['knysna', 'plett', 'plettenberg', 'wilderness', 'george', 'mossel', 'robertson', 'montagu'].some(t => town.includes(t)))
    return 'garden'
  if (['graaff-reinet', 'trompsburg', 'hanover', 'middelburg', 'oudtshoorn', 'winburg'].some(t => town.includes(t)))
    return 'karoo'
  if (['dullstroom', 'sabie', 'nelspruit', 'lydenburg', 'kruger'].some(t => town.includes(t) || name.includes(t)))
    return 'kruger'
  if (['durban', 'harrismith', 'bergville', 'hilton', 'pietermaritzburg', 'nottingham', 'mooi river', 'midlands'].some(t => town.includes(t)))
    return 'kzn'
  if (['parys', 'kroonstad', 'bloemfontein'].some(t => town.includes(t)))
    return 'freestate'
  if (['polokwane', 'makhado', 'bela-bela', 'modimolle'].some(t => town.includes(t)))
    return 'limpopo'

  if (desc.includes('ocean') || desc.includes('beach') || desc.includes('coast')) return 'garden'
  if (desc.includes('karoo') || desc.includes('desert') || desc.includes('windmill')) return 'karoo'
  if (desc.includes('bush') || desc.includes('safari') || desc.includes('wildlife')) return 'kruger'

  return 'default'
}

// CSS-art scenes for each region
function RegionScene({ region }) {
  const base = {
    width: '100%', height: 180, position: 'relative',
    overflow: 'hidden', borderRadius: '8px 8px 0 0',
  }

  const scenes = {
    karoo: (
      <div style={{ ...base, background: 'linear-gradient(180deg, #87CEEB 0%, #F4D35E 60%, #D2B48C 60%, #C4A26E 100%)' }}>
        {/* Sun */}
        <div style={{ position: 'absolute', top: 20, right: 40, width: 40, height: 40, borderRadius: '50%', background: '#FFD700', boxShadow: '0 0 20px #FFD700' }} />
        {/* Windmill */}
        <div style={{ position: 'absolute', bottom: 40, left: '25%', width: 6, height: 50, background: '#8B7355' }} />
        <div style={{ position: 'absolute', bottom: 75, left: 'calc(25% - 12px)', fontSize: 28 }}>🌀</div>
        {/* Karoo bush */}
        <div style={{ position: 'absolute', bottom: 20, left: '15%', fontSize: 20 }}>🌵</div>
        <div style={{ position: 'absolute', bottom: 18, left: '55%', fontSize: 16 }}>🌵</div>
        <div style={{ position: 'absolute', bottom: 22, right: '20%', fontSize: 18 }}>🌿</div>
        {/* Sheep */}
        <div style={{ position: 'absolute', bottom: 16, left: '40%', fontSize: 20 }}>🐑</div>
        <div style={{ position: 'absolute', bottom: 14, left: '48%', fontSize: 16 }}>🐑</div>
      </div>
    ),
    garden: (
      <div style={{ ...base, background: 'linear-gradient(180deg, #5BA4CC 0%, #87CEEB 40%, #2E8B57 55%, #228B22 65%, #1E90FF 65%, #4169E1 100%)' }}>
        {/* Trees */}
        <div style={{ position: 'absolute', bottom: 60, left: '10%', fontSize: 32 }}>🌲</div>
        <div style={{ position: 'absolute', bottom: 55, left: '20%', fontSize: 38 }}>🌳</div>
        <div style={{ position: 'absolute', bottom: 58, left: '32%', fontSize: 30 }}>🌲</div>
        {/* Birds */}
        <div style={{ position: 'absolute', top: 20, left: '35%', fontSize: 18 }}>🐦</div>
        <div style={{ position: 'absolute', top: 35, right: '25%', fontSize: 14 }}>🐦</div>
        {/* Waves */}
        <div style={{ position: 'absolute', bottom: 12, left: '50%', fontSize: 16 }}>🐬</div>
        <div style={{ position: 'absolute', bottom: 20, right: '15%', fontSize: 20 }}>🌊</div>
        {/* Whale */}
        <div style={{ position: 'absolute', bottom: 8, right: '35%', fontSize: 22 }}>🐋</div>
      </div>
    ),
    kruger: (
      <div style={{ ...base, background: 'linear-gradient(180deg, #FFB347 0%, #F4A460 30%, #DEB887 50%, #C4A26E 60%, #8B7355 100%)' }}>
        {/* Acacia trees */}
        <div style={{ position: 'absolute', bottom: 45, left: '15%', fontSize: 36 }}>🌴</div>
        <div style={{ position: 'absolute', bottom: 42, right: '20%', fontSize: 32 }}>🌴</div>
        {/* Animals */}
        <div style={{ position: 'absolute', bottom: 16, left: '25%', fontSize: 28 }}>🦁</div>
        <div style={{ position: 'absolute', bottom: 14, left: '50%', fontSize: 26 }}>🦒</div>
        <div style={{ position: 'absolute', bottom: 12, right: '15%', fontSize: 24 }}>🐘</div>
        {/* Sun */}
        <div style={{ position: 'absolute', top: 12, right: 30, width: 50, height: 50, borderRadius: '50%', background: '#FF6347', opacity: 0.8 }} />
        {/* Birds */}
        <div style={{ position: 'absolute', top: 25, left: '40%', fontSize: 16 }}>🦅</div>
      </div>
    ),
    kzn: (
      <div style={{ ...base, background: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 40%, #228B22 55%, #006400 70%, #2F4F4F 100%)' }}>
        {/* Mountains */}
        <div style={{ position: 'absolute', bottom: 60, left: '5%', fontSize: 42 }}>⛰️</div>
        <div style={{ position: 'absolute', bottom: 55, left: '35%', fontSize: 48 }}>🏔️</div>
        <div style={{ position: 'absolute', bottom: 58, right: '10%', fontSize: 40 }}>⛰️</div>
        {/* Waterfall */}
        <div style={{ position: 'absolute', bottom: 40, left: '60%', fontSize: 24 }}>💧</div>
        {/* Flowers */}
        <div style={{ position: 'absolute', bottom: 12, left: '20%', fontSize: 18 }}>🌺</div>
        <div style={{ position: 'absolute', bottom: 14, left: '45%', fontSize: 16 }}>🌸</div>
        <div style={{ position: 'absolute', bottom: 10, right: '25%', fontSize: 18 }}>🌼</div>
      </div>
    ),
    freestate: (
      <div style={{ ...base, background: 'linear-gradient(180deg, #87CEEB 0%, #F5DEB3 50%, #DAA520 70%, #B8860B 100%)' }}>
        {/* Sun */}
        <div style={{ position: 'absolute', top: 15, left: '50%', transform: 'translateX(-50%)', width: 45, height: 45, borderRadius: '50%', background: '#FFD700', boxShadow: '0 0 30px #FFD700' }} />
        {/* Wheat fields */}
        <div style={{ position: 'absolute', bottom: 20, left: '10%', fontSize: 22 }}>🌾</div>
        <div style={{ position: 'absolute', bottom: 18, left: '25%', fontSize: 20 }}>🌾</div>
        <div style={{ position: 'absolute', bottom: 22, left: '40%', fontSize: 24 }}>🌾</div>
        <div style={{ position: 'absolute', bottom: 16, right: '30%', fontSize: 20 }}>🌾</div>
        <div style={{ position: 'absolute', bottom: 20, right: '15%', fontSize: 22 }}>🌾</div>
        {/* Dam */}
        <div style={{ position: 'absolute', bottom: 10, left: '55%', fontSize: 20 }}>🌊</div>
      </div>
    ),
    limpopo: (
      <div style={{ ...base, background: 'linear-gradient(180deg, #FF8C00 0%, #CD853F 40%, #8B4513 60%, #556B2F 80%, #2E8B57 100%)' }}>
        {/* Baobab */}
        <div style={{ position: 'absolute', bottom: 30, left: '20%', fontSize: 42 }}>🌳</div>
        <div style={{ position: 'absolute', bottom: 28, right: '15%', fontSize: 36 }}>🌴</div>
        {/* Animals */}
        <div style={{ position: 'absolute', bottom: 10, left: '40%', fontSize: 22 }}>🦓</div>
        <div style={{ position: 'absolute', bottom: 12, right: '35%', fontSize: 20 }}>🦏</div>
        {/* Sun */}
        <div style={{ position: 'absolute', top: 10, right: 25, width: 45, height: 45, borderRadius: '50%', background: '#FF4500', opacity: 0.7 }} />
      </div>
    ),
    default: (
      <div style={{ ...base, background: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 50%, #228B22 70%, #006400 100%)' }}>
        <div style={{ position: 'absolute', top: 20, right: 35, width: 40, height: 40, borderRadius: '50%', background: '#FFD700', boxShadow: '0 0 20px #FFD700' }} />
        <div style={{ position: 'absolute', bottom: 30, left: '15%', fontSize: 32 }}>🌿</div>
        <div style={{ position: 'absolute', bottom: 28, left: '45%', fontSize: 36 }}>🌳</div>
        <div style={{ position: 'absolute', bottom: 10, right: '20%', fontSize: 22 }}>🐾</div>
      </div>
    ),
  }

  return scenes[region] || scenes.default
}

// Popular postcards — curated stop IDs
const POPULAR_IDS = [
  'knysna-heads-walk',
  'plett-beach',
  'karoo-palace',
  'dullstroom-trout',
  'midlands-meander',
  'parys-pecan',
]

export default function PostcardGenerator({ stops = [], pets = [], dark, open, onClose }) {
  const [selectedStop, setSelectedStop] = useState(null)
  const [copied, setCopied] = useState(false)

  const popularStops = useMemo(() => {
    const popular = POPULAR_IDS.map(id => stops.find(s => s.id === id)).filter(Boolean)
    // Fill with first stops if not enough popular ones found
    if (popular.length < 4) {
      const remaining = stops.filter(s => !POPULAR_IDS.includes(s.id)).slice(0, 6 - popular.length)
      return [...popular, ...remaining].slice(0, 6)
    }
    return popular.slice(0, 6)
  }, [stops])

  if (!open) return null

  const petNames = pets.map(p => p.name).join(' & ') || 'our furry friends'

  const generateMessage = (stop) => {
    if (!stop) return ''
    const descSnippet = stop.description
      ? stop.description.split('.')[0] + '.'
      : 'the scenery is incredible.'
    return `Having an amazing time in ${stop.town} with ${petNames}! The ${stop.name} is incredible \u2014 ${descSnippet} Wish you were here! 🐾`
  }

  const buildFullText = (stop) => {
    if (!stop) return ''
    let text = `📮 Greetings from ${stop.town}!\n\n`
    text += `Dear friends,\n\n`
    text += generateMessage(stop) + '\n\n'
    text += `From ${petNames} & their humans\n\n`
    text += `🇿🇦 PawRoutes SA — Toll-free, pet-friendly`
    return text
  }

  const handleCopy = async () => {
    if (!selectedStop) return
    const text = buildFullText(selectedStop)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleWhatsApp = () => {
    if (!selectedStop) return
    const encoded = encodeURIComponent(buildFullText(selectedStop))
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  const region = selectedStop ? getRegion(selectedStop) : 'default'

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
          width: '90%', maxWidth: 480, maxHeight: '85vh',
          background: dark ? 'var(--bg-dark)' : 'var(--cream)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
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
              📮 Postcard Generator
            </h2>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 'var(--radius-full)',
              background: dark ? 'var(--card-dark)' : 'var(--sand)',
              border: 'none', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'inherit',
            }}>✕</button>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '6px 0 0' }}>
            Send a vintage SA postcard from your trip
          </p>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>

          {/* Popular postcards grid */}
          {!selectedStop && (
            <>
              <div style={{
                fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 10,
              }}>
                Popular Postcards
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
                marginBottom: 20,
              }}>
                {popularStops.map(stop => (
                  <button key={stop.id} onClick={() => setSelectedStop(stop)} style={{
                    padding: 0, border: `2px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                    borderRadius: 'var(--radius-md)', overflow: 'hidden',
                    cursor: 'pointer', background: dark ? 'var(--card-dark)' : '#FFF',
                    textAlign: 'left', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}>
                    <div style={{
                      height: 60, overflow: 'hidden',
                      background: getRegion(stop) === 'karoo' ? 'linear-gradient(#87CEEB, #D2B48C)'
                        : getRegion(stop) === 'garden' ? 'linear-gradient(#5BA4CC, #228B22)'
                        : getRegion(stop) === 'kruger' ? 'linear-gradient(#FFB347, #C4A26E)'
                        : getRegion(stop) === 'kzn' ? 'linear-gradient(#87CEEB, #228B22)'
                        : 'linear-gradient(#87CEEB, #98FB98)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28,
                    }}>
                      {getRegion(stop) === 'karoo' ? '🏜️'
                        : getRegion(stop) === 'garden' ? '🌊'
                        : getRegion(stop) === 'kruger' ? '🦁'
                        : getRegion(stop) === 'kzn' ? '⛰️'
                        : '🌿'}
                    </div>
                    <div style={{ padding: '8px 10px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
                        {stop.town}
                      </div>
                      <div style={{
                        fontSize: 11, color: 'var(--text-muted)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {stop.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* All stops dropdown */}
              <div style={{
                fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8,
              }}>
                Or pick any stop
              </div>
              <select
                onChange={e => {
                  const stop = stops.find(s => s.id === e.target.value)
                  if (stop) setSelectedStop(stop)
                }}
                value=""
                style={{
                  width: '100%', padding: '10px 14px', fontSize: 14,
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                  background: dark ? 'var(--card-dark)' : '#FFF',
                  color: 'inherit', fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                <option value="" disabled>Choose a stop...</option>
                {stops.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.town})</option>
                ))}
              </select>
            </>
          )}

          {/* Postcard preview */}
          {selectedStop && (
            <>
              <button onClick={() => setSelectedStop(null)} style={{
                padding: '6px 14px', fontSize: 13, fontWeight: 600,
                background: 'none', border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                borderRadius: 'var(--radius-full)', cursor: 'pointer',
                color: 'inherit', fontFamily: 'inherit', marginBottom: 16,
              }}>
                ← Pick another stop
              </button>

              {/* The Postcard */}
              <div style={{
                border: '4px double var(--bark, #8B6914)',
                borderRadius: 12,
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #FFFEF5 0%, #FFF8E7 50%, #F5ECD7 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                position: 'relative',
                color: '#333',
              }}>
                {/* Scene */}
                <RegionScene region={region} />

                {/* Curved greeting text */}
                <div style={{
                  position: 'absolute', top: 140, left: 0, right: 0,
                  textAlign: 'center', zIndex: 2,
                }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 20px',
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}>
                    <span style={{
                      fontSize: 18, fontWeight: 900,
                      fontFamily: 'var(--font-display)',
                      color: 'var(--terracotta, #C0784B)',
                      letterSpacing: '0.02em',
                    }}>
                      Greetings from {selectedStop.town}!
                    </span>
                  </div>
                </div>

                {/* Stamp */}
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 56, height: 64,
                  border: '2px dashed rgba(0,0,0,0.3)',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.9)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: 4, zIndex: 3,
                  transform: 'rotate(3deg)',
                }}>
                  <div style={{ fontSize: 22 }}>🇿🇦</div>
                  <div style={{
                    fontSize: 7, fontWeight: 700, textAlign: 'center',
                    lineHeight: 1.2, color: '#666', marginTop: 2,
                  }}>
                    PawRoutes<br />SA
                  </div>
                </div>

                {/* Message area */}
                <div style={{
                  padding: '28px 20px 20px',
                  minHeight: 160,
                }}>
                  <div style={{
                    fontSize: 14, fontStyle: 'italic',
                    color: '#666', marginBottom: 12,
                    fontFamily: 'Georgia, serif',
                  }}>
                    Dear friends,
                  </div>
                  <div style={{
                    fontSize: 13, lineHeight: 1.7,
                    color: '#444',
                    fontFamily: 'Georgia, serif',
                    marginBottom: 16,
                  }}>
                    {generateMessage(selectedStop)}
                  </div>
                  <div style={{
                    fontSize: 14, fontWeight: 600,
                    color: '#555',
                    fontFamily: 'Georgia, serif',
                  }}>
                    From {petNames} & their humans
                  </div>

                  {/* Pet emojis */}
                  <div style={{
                    display: 'flex', gap: 6, marginTop: 8,
                  }}>
                    {pets.map(p => (
                      <span key={p.id} style={{ fontSize: 20 }} title={p.name}>
                        {petEmoji(p.type)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button onClick={handleCopy} style={{
                  flex: 1, padding: '12px 16px', fontSize: 14, fontWeight: 700,
                  background: copied ? 'var(--forest)' : (dark ? 'var(--card-dark)' : 'var(--sand)'),
                  color: copied ? '#fff' : 'inherit',
                  border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                }}>
                  {copied ? '✅ Copied!' : '📋 Copy Message'}
                </button>
                <button onClick={handleWhatsApp} style={{
                  flex: 1, padding: '12px 16px', fontSize: 14, fontWeight: 700,
                  background: '#25D366', color: '#FFF', border: 'none',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                }}>
                  💬 WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
