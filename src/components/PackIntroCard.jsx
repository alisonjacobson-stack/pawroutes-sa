import React, { useRef, useMemo } from 'react'

const PET_EMOJI = {
  dog: '🐕', 'dog-small': '🐶', 'dog-medium': '🐕', 'dog-large': '🐕',
  cat: '🐱', bird: '🦜', rabbit: '🐰',
}

function petEmoji(type) {
  return PET_EMOJI[type] || '🐾'
}

function getPackPersonality(pets) {
  const types = pets.map(p => (p.species || p.type || '').toLowerCase())
  const hasDog = types.some(t => t.startsWith('dog'))
  const hasCat = types.includes('cat')
  const hasBird = types.includes('bird')
  const hasReactive = pets.some(p => p.reactive || p.isReactive)

  if (hasBird) return { name: 'The Aviary Express', emoji: '🦜' }
  if (hasReactive) return { name: 'The Careful Cruisers', emoji: '⚡' }
  if (hasDog && hasCat) return { name: 'The Odd Couple Pack', emoji: '🐕🐱' }
  if (pets.length >= 3) return { name: 'The Full House', emoji: '🏠' }
  if (hasDog && !hasCat) return { name: 'The Woof Squad', emoji: '🐕' }
  return { name: 'The Adventure Pack', emoji: '🎒' }
}

export default function PackIntroCard({ pets = [], dark, open, onClose }) {
  const cardRef = useRef(null)

  const personality = useMemo(() => getPackPersonality(pets), [pets])

  const packStats = useMemo(() => {
    const typeSet = new Set(pets.map(p => {
      const t = (p.species || p.type || '').toLowerCase()
      return t.startsWith('dog') ? 'dog' : t
    }))
    const specialNeeds = pets.filter(p =>
      p.reactive || p.isReactive || p.anxious || p.specialNeeds || p.medication
    ).length
    return {
      total: pets.length,
      typesCount: typeSet.size,
      types: [...typeSet],
      specialNeeds,
    }
  }, [pets])

  const shareText = useMemo(() => {
    let t = `🐾 Meet Our Travel Pack!\n\n`
    t += `${personality.emoji} ${personality.name}\n\n`
    pets.forEach(p => {
      t += `${petEmoji(p.type)} ${p.name}\n`
    })
    t += `\n📊 ${packStats.total} pet${packStats.total !== 1 ? 's' : ''}`
    t += ` · ${packStats.typesCount} species`
    if (packStats.specialNeeds > 0) t += ` · ${packStats.specialNeeds} with special needs`
    t += `\n\n⭐ Track your pack's SA road trips at PawRoutes SA 🇿🇦`
    return t
  }, [pets, personality, packStats])

  if (!open || pets.length === 0) return null

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
  }

  const handleScreenshot = () => {
    const cardEl = cardRef.current
    if (!cardEl) return
    const win = window.open('', '_blank', 'width=420,height=700')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Our Travel Pack</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');
  body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #1a1a1a; font-family: 'Fredoka', sans-serif; }
  .card { width: 380px; border-radius: 24px; overflow: hidden; }
  p { margin: 0; } h2, h3 { margin: 0; }
</style></head><body>`)
    win.document.write(cardEl.outerHTML)
    win.document.write(`<p style="text-align:center;color:#999;font-size:13px;margin-top:16px;font-family:sans-serif;">Screenshot this card to save & share!</p>`)
    win.document.write('</body></html>')
    win.document.close()
  }

  // Paw print CSS pattern via radial gradients
  const pawPrintBg = [
    'radial-gradient(circle at 15% 25%, rgba(255,255,255,0.04) 8px, transparent 8px)',
    'radial-gradient(circle at 85% 15%, rgba(255,255,255,0.04) 6px, transparent 6px)',
    'radial-gradient(circle at 45% 75%, rgba(255,255,255,0.03) 7px, transparent 7px)',
    'radial-gradient(circle at 75% 55%, rgba(255,255,255,0.04) 5px, transparent 5px)',
    'radial-gradient(circle at 25% 60%, rgba(255,255,255,0.03) 6px, transparent 6px)',
    'radial-gradient(circle at 60% 35%, rgba(255,255,255,0.03) 5px, transparent 5px)',
    'radial-gradient(circle at 90% 80%, rgba(255,255,255,0.04) 7px, transparent 7px)',
    'radial-gradient(circle at 10% 90%, rgba(255,255,255,0.03) 6px, transparent 6px)',
  ].join(', ')

  const cardContent = (
    <div ref={cardRef} style={{
      width: '100%', maxWidth: 380, margin: '0 auto',
      borderRadius: 20, overflow: 'hidden',
      background: `${pawPrintBg}, linear-gradient(165deg, #5C3D2E 0%, #C1593B 30%, #C4983B 65%, #D4B896 100%)`,
      color: '#FFF', fontFamily: 'var(--font-display), Fredoka, sans-serif',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      position: 'relative',
    }}>
      {/* Large faint paw bg */}
      <div style={{
        position: 'absolute', bottom: 40, left: -30,
        fontSize: 160, opacity: 0.04, pointerEvents: 'none',
        transform: 'rotate(20deg)',
      }}>🐾</div>

      {/* Title */}
      <div style={{ textAlign: 'center', padding: '28px 24px 16px' }}>
        <h2 style={{
          fontSize: 24, fontWeight: 700, margin: '0 0 4px',
          textShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          Meet Our Travel Pack! 🐾
        </h2>
        <div style={{
          display: 'inline-block',
          padding: '4px 14px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(4px)',
          fontSize: 13, fontWeight: 600,
        }}>
          {personality.emoji} {personality.name}
        </div>
      </div>

      {/* Pet grid */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        gap: 16, padding: '8px 20px 20px',
      }}>
        {pets.map(pet => (
          <div key={pet.id} style={{
            textAlign: 'center', width: pets.length <= 2 ? 100 : 80,
          }}>
            <div style={{
              width: pets.length <= 2 ? 80 : 64,
              height: pets.length <= 2 ? 80 : 64,
              borderRadius: '50%',
              margin: '0 auto 8px',
              background: 'rgba(255,255,255,0.2)',
              border: '3px solid rgba(255,255,255,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: pets.length <= 2 ? 36 : 28,
              overflow: 'hidden',
              boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
            }}>
              {pet.photo
                ? <img src={pet.photo} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : petEmoji(pet.type)
              }
            </div>
            <div style={{
              fontSize: 13, fontWeight: 700,
              textShadow: '0 1px 4px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {pet.name}
            </div>
            <div style={{
              fontSize: 10, opacity: 0.75, marginTop: 1,
              textTransform: 'capitalize',
            }}>
              {(pet.type || '').replace('dog-', '')}
            </div>
          </div>
        ))}
      </div>

      {/* Pack stats */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 2,
        margin: '0 20px 16px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 14, overflow: 'hidden',
      }}>
        {[
          { label: 'PETS', value: packStats.total, icon: '🐾' },
          { label: 'SPECIES', value: packStats.typesCount, icon: '🦁' },
          ...(packStats.specialNeeds > 0
            ? [{ label: 'SPECIAL NEEDS', value: packStats.specialNeeds, icon: '💛' }]
            : []
          ),
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, padding: '12px 10px', textAlign: 'center',
            background: 'rgba(255,255,255,0.06)',
          }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
            <div style={{
              fontSize: 9, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.06em', opacity: 0.75, marginTop: 1,
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Species list */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 6,
        padding: '0 20px 16px', flexWrap: 'wrap',
      }}>
        {packStats.types.map(t => (
          <span key={t} style={{
            padding: '4px 12px', borderRadius: 12,
            background: 'rgba(255,255,255,0.14)',
            fontSize: 12, fontWeight: 600,
            textTransform: 'capitalize',
          }}>
            {t === 'dog' ? '🐕' : t === 'cat' ? '🐱' : t === 'bird' ? '🦜' : '🐾'} {t}
          </span>
        ))}
      </div>

      {/* Footer branding */}
      <div style={{
        padding: '14px 24px 18px', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.03em' }}>
          PawRoutes SA 🐾
        </div>
        <div style={{ fontSize: 11, opacity: 0.65, marginTop: 3 }}>
          Pet-friendly road trips across South Africa 🇿🇦
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
          width: '90%', maxWidth: 460, maxHeight: '90vh',
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
            📸 Pack Intro Card
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
          <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 380 }}>
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
