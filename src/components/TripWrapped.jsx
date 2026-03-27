import React, { useState, useMemo } from 'react'

const PET_EMOJI = {
  dog: '🐕', 'dog-small': '🐶', 'dog-medium': '🦮', 'dog-large': '🐕',
  cat: '🐱', bird: '🦜', rabbit: '🐰',
}

function petEmoji(type) {
  return PET_EMOJI[type] || '🐾'
}

const SA_COMPARISONS = [
  { km: 50, text: "That's a trip to Stellenbosch!" },
  { km: 120, text: "That's like driving to Hermanus for whale season!" },
  { km: 485, text: "That's like driving the whole Garden Route!" },
  { km: 770, text: "That's Cape Town to Port Elizabeth!" },
  { km: 1398, text: "That's Joburg to Cape Town!" },
  { km: 1660, text: "That's Joburg to Durban... three times!" },
  { km: 3000, text: "That's like driving from Cape Town to Nairobi!" },
  { km: 5000, text: "That's like driving from Cape Town to Cairo!" },
  { km: 8000, text: "That's almost Cape Town to London (if you could drive)!" },
]

function getComparison(km) {
  for (let i = SA_COMPARISONS.length - 1; i >= 0; i--) {
    if (km >= SA_COMPARISONS[i].km) return SA_COMPARISONS[i].text
  }
  return "Every kilometre counts!"
}

function getTravelPersonality(completedIds) {
  const ids = new Set(completedIds)
  const total = ids.size

  if (total === 6) return { type: 'The Completionist', emoji: '🏆', desc: "You've done every single route. Legend status unlocked." }
  if (ids.has('jhb-kruger')) return { type: 'The Safari Seeker', emoji: '🦁', desc: "Kruger called and you answered. Wildlife runs in your veins." }
  if (ids.has('cpt-garden')) return { type: 'The Coastal Cruiser', emoji: '🌊', desc: "Salt air, forest trails, and ocean views. You know the good life." }

  // Check if mostly long routes (>800km)
  const longRoutes = ['jhb-cpt', 'jhb-dbn', 'jhb-kruger']
  const shortRoutes = ['cpt-garden', 'jhb-blm', 'pta-plk']
  const longCount = longRoutes.filter(r => ids.has(r)).length
  const shortCount = shortRoutes.filter(r => ids.has(r)).length

  if (longCount > shortCount && longCount >= 2) return { type: 'The Marathon Muncher', emoji: '🏃', desc: "Long hauls don't scare you. Your pack was born for the open road." }
  if (shortCount > longCount && shortCount >= 2) return { type: 'The Weekend Wanderer', emoji: '🌄', desc: "Quick getaways are your speciality. Max fun, minimum fuss." }

  return { type: 'The Adventurer', emoji: '🧭', desc: "You go where the road takes you. Every trip is a new story." }
}

const SLIDE_GRADIENTS = [
  'linear-gradient(135deg, #C0784B 0%, #A0522D 50%, #8B4513 100%)',   // terracotta warm
  'linear-gradient(135deg, #2D6A4F 0%, #40916C 50%, #52B788 100%)',   // forest greens
  'linear-gradient(135deg, #B8860B 0%, #DAA520 50%, #F0C040 100%)',   // ochre/gold
  'linear-gradient(135deg, #6B4C8A 0%, #8B6CB0 50%, #A78BCA 100%)',   // purple sunset
  'linear-gradient(135deg, #C45B5B 0%, #D88080 50%, #E8A0A0 100%)',   // warm pink
  'linear-gradient(135deg, #2C5F7C 0%, #3A7CA5 50%, #5BA4CC 100%)',   // ocean blue
  'linear-gradient(135deg, #C0784B 0%, #DAA520 40%, #2D6A4F 100%)',   // SA flag vibes
]

export default function TripWrapped({ pets = [], completedRoutes = [], routes = [], dark, open, onClose }) {
  const [slide, setSlide] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const stats = useMemo(() => {
    const completed = routes.filter(r => completedRoutes.includes(r.id))
    const totalKm = completed.reduce((sum, r) => sum + (r.freeRoute?.distance || 0), 0)
    const totalTollSaved = completed.reduce((sum, r) => sum + (r.tollRoute?.tollCost || 0), 0)
    const dogFoodBagCost = 650
    const dogFoodBags = Math.floor(totalTollSaved / dogFoodBagCost)
    const personality = getTravelPersonality(completedRoutes)
    const comparison = getComparison(totalKm)

    return { completed, totalKm, totalTollSaved, dogFoodBags, personality, comparison }
  }, [completedRoutes, routes, pets])

  if (!open) return null

  const totalSlides = 7
  const goTo = (next) => {
    if (next >= 0 && next < totalSlides) {
      setSlide(next)
      setAnimKey(k => k + 1)
    }
  }

  const buildShareText = () => {
    const petList = pets.map(p => p.name).join(' & ')
    let text = `🐾 My 2026 PawRoutes Wrapped!\n\n`
    text += `🛣️ ${stats.totalKm.toLocaleString()} km traveled\n`
    text += `✅ ${stats.completed.length} routes completed\n`
    text += `💰 R${stats.totalTollSaved.toLocaleString()} saved on tolls\n`
    text += `${stats.personality.emoji} Travel personality: ${stats.personality.type}\n`
    text += `🐕 Traveling with: ${petList}\n\n`
    text += `⭐ Planned with PawRoutes SA 🇿🇦`
    return text
  }

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(buildShareText())
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  const overlay = {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    animation: 'fadeIn 0.2s',
  }

  const modal = {
    width: '90%', maxWidth: 480, height: '85vh', maxHeight: 640,
    borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    display: 'flex', flexDirection: 'column',
    animation: 'slideInUp 0.3s ease-out',
    position: 'relative',
  }

  const slideContainer = {
    flex: 1,
    background: SLIDE_GRADIENTS[slide % SLIDE_GRADIENTS.length],
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '40px 32px',
    textAlign: 'center',
    color: '#FFF',
    position: 'relative',
    overflow: 'hidden',
  }

  const fadeIn = {
    animation: 'wrappedFadeIn 0.5s ease-out',
    key: animKey,
  }

  const bigNumber = {
    fontSize: 56, fontWeight: 900,
    fontFamily: 'var(--font-display)',
    lineHeight: 1.1, marginBottom: 12,
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
  }

  const subtitle = {
    fontSize: 16, fontWeight: 500,
    opacity: 0.9, lineHeight: 1.5,
    maxWidth: 320,
  }

  const bigEmoji = {
    fontSize: 72, marginBottom: 20,
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
  }

  // Close button
  const closeBtn = (
    <button onClick={onClose} style={{
      position: 'absolute', top: 16, right: 16, zIndex: 10,
      width: 36, height: 36, borderRadius: 'var(--radius-full)',
      background: 'rgba(0,0,0,0.3)', border: 'none',
      color: '#FFF', fontSize: 18, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    }}>✕</button>
  )

  // Progress dots
  const dots = (
    <div style={{
      display: 'flex', gap: 8, justifyContent: 'center',
      padding: '16px 0',
      position: 'absolute', bottom: 60, left: 0, right: 0,
    }}>
      {Array.from({ length: totalSlides }).map((_, i) => (
        <button key={i} onClick={() => goTo(i)} style={{
          width: i === slide ? 24 : 8, height: 8,
          borderRadius: 'var(--radius-full)',
          background: i === slide ? '#FFF' : 'rgba(255,255,255,0.4)',
          border: 'none', cursor: 'pointer',
          transition: 'all 0.3s ease',
        }} />
      ))}
    </div>
  )

  // Navigation bar
  const nav = (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'space-between',
      padding: '12px 24px 20px',
    }}>
      <button onClick={() => goTo(slide - 1)} style={{
        padding: '8px 20px', fontSize: 14, fontWeight: 700,
        background: 'rgba(255,255,255,0.2)', color: '#FFF',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: 'var(--radius-full)', cursor: 'pointer',
        fontFamily: 'inherit',
        visibility: slide === 0 ? 'hidden' : 'visible',
        backdropFilter: 'blur(4px)',
      }}>
        ← Back
      </button>
      <button onClick={() => goTo(slide + 1)} style={{
        padding: '8px 20px', fontSize: 14, fontWeight: 700,
        background: '#FFF', color: '#333',
        border: 'none',
        borderRadius: 'var(--radius-full)', cursor: 'pointer',
        fontFamily: 'inherit',
        visibility: slide === totalSlides - 1 ? 'hidden' : 'visible',
      }}>
        Next →
      </button>
    </div>
  )

  const renderSlide = () => {
    switch (slide) {
      // Slide 0: Intro
      case 0:
        return (
          <div key={animKey} style={{ ...fadeIn, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              ...bigEmoji,
              animation: 'wrappedSpin 2s ease-in-out',
            }}>🐾</div>
            <div style={{
              fontSize: 32, fontWeight: 900,
              fontFamily: 'var(--font-display)',
              lineHeight: 1.2, marginBottom: 12,
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}>
              Your 2026<br />PawRoutes Wrapped
            </div>
            <div style={subtitle}>
              Let's see where you and your pack have been this year...
            </div>
          </div>
        )

      // Slide 1: Total KM
      case 1:
        return (
          <div key={animKey} style={{ ...fadeIn, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={bigEmoji}>🛣️</div>
            <div style={bigNumber}>
              {stats.totalKm.toLocaleString()}
              <span style={{ fontSize: 24 }}> km</span>
            </div>
            <div style={subtitle}>
              {stats.comparison}
            </div>
          </div>
        )

      // Slide 2: Routes completed
      case 2:
        return (
          <div key={animKey} style={{ ...fadeIn, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={bigEmoji}>✅</div>
            <div style={bigNumber}>
              {stats.completed.length}
              <span style={{ fontSize: 20 }}> / {routes.length}</span>
            </div>
            <div style={{ ...subtitle, marginBottom: 20 }}>
              routes completed
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 8,
              justifyContent: 'center', maxWidth: 360,
            }}>
              {routes.map(r => {
                const done = completedRoutes.includes(r.id)
                return (
                  <div key={r.id} style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-full)',
                    fontSize: 12, fontWeight: 600,
                    background: done ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)',
                    color: done ? '#333' : 'rgba(255,255,255,0.5)',
                    border: done ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  }}>
                    {done ? '✓ ' : ''}{r.name}
                  </div>
                )
              })}
            </div>
          </div>
        )

      // Slide 3: Toll savings
      case 3:
        return (
          <div key={animKey} style={{ ...fadeIn, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={bigEmoji}>💰</div>
            <div style={bigNumber}>
              R{stats.totalTollSaved.toLocaleString()}
            </div>
            <div style={subtitle}>
              saved by skipping tolls
            </div>
            {stats.dogFoodBags > 0 && (
              <div style={{
                marginTop: 20, padding: '12px 20px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-full)',
                fontSize: 14, fontWeight: 600,
                backdropFilter: 'blur(4px)',
              }}>
                That's {stats.dogFoodBags} bag{stats.dogFoodBags !== 1 ? 's' : ''} of Montego dog food! 🦴
              </div>
            )}
          </div>
        )

      // Slide 4: Your pack
      case 4:
        return (
          <div key={animKey} style={{ ...fadeIn, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              fontSize: 28, fontWeight: 900,
              fontFamily: 'var(--font-display)',
              marginBottom: 24,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}>
              Your Pack
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 16,
              justifyContent: 'center',
            }}>
              {pets.map(pet => (
                <div key={pet.id} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 8,
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius-lg)',
                  backdropFilter: 'blur(4px)',
                  minWidth: 100,
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 'var(--radius-full)',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 36, overflow: 'hidden',
                    border: '3px solid rgba(255,255,255,0.4)',
                  }}>
                    {pet.photo
                      ? <img src={pet.photo} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : petEmoji(pet.type)
                    }
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{pet.name}</div>
                  <div style={{
                    fontSize: 12, opacity: 0.8,
                    padding: '2px 10px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    {stats.totalKm.toLocaleString()} km
                  </div>
                </div>
              ))}
            </div>
            {pets.length === 0 && (
              <div style={subtitle}>
                Add pets to your pack to see them here!
              </div>
            )}
          </div>
        )

      // Slide 5: Travel personality
      case 5:
        return (
          <div key={animKey} style={{ ...fadeIn, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 80, marginBottom: 16, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
              {stats.personality.emoji}
            </div>
            <div style={{
              fontSize: 14, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.1em', opacity: 0.7, marginBottom: 8,
            }}>
              Your travel personality
            </div>
            <div style={{
              fontSize: 32, fontWeight: 900,
              fontFamily: 'var(--font-display)',
              lineHeight: 1.2, marginBottom: 16,
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}>
              {stats.personality.type}
            </div>
            <div style={{ ...subtitle, maxWidth: 300 }}>
              {stats.personality.desc}
            </div>
          </div>
        )

      // Slide 6: Summary + Share
      case 6:
        return (
          <div key={animKey} style={{ ...fadeIn, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              fontSize: 22, fontWeight: 900,
              fontFamily: 'var(--font-display)',
              marginBottom: 20,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}>
              2026 Recap
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.12)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              width: '100%', maxWidth: 320,
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              {[
                { icon: '🛣️', label: 'Distance', value: `${stats.totalKm.toLocaleString()} km` },
                { icon: '✅', label: 'Routes', value: `${stats.completed.length} of ${routes.length}` },
                { icon: '💰', label: 'Tolls saved', value: `R${stats.totalTollSaved.toLocaleString()}` },
                { icon: '🐾', label: 'Pack size', value: `${pets.length} furry friend${pets.length !== 1 ? 's' : ''}` },
                { icon: stats.personality.emoji, label: 'Personality', value: stats.personality.type },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '8px 0',
                  borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}>
                  <span style={{ fontSize: 14, opacity: 0.8 }}>
                    {row.icon} {row.label}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex', gap: 10, marginTop: 24, width: '100%',
              maxWidth: 320,
            }}>
              <button onClick={handleWhatsApp} style={{
                flex: 1, padding: '12px 16px', fontSize: 14, fontWeight: 700,
                background: '#25D366', color: '#FFF', border: 'none',
                borderRadius: 'var(--radius-full)', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                📤 Share via WhatsApp
              </button>
            </div>
            <div style={{
              marginTop: 12, fontSize: 12, opacity: 0.6,
            }}>
              PawRoutes SA 🇿🇦 — Toll-free, pet-friendly
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <style>{`
        @keyframes wrappedFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wrappedSpin {
          0% { transform: rotate(0deg) scale(0.5); opacity: 0; }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }
      `}</style>
      <div style={overlay} onClick={onClose}>
        <div onClick={e => e.stopPropagation()} style={modal}>
          <div style={slideContainer}>
            {closeBtn}
            {renderSlide()}
            {dots}
            {nav}
          </div>
        </div>
      </div>
    </>
  )
}
