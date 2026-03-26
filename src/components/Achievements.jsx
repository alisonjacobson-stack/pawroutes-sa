import React, { useMemo } from 'react'

const BADGES = [
  {
    id: 'first-paw',
    icon: '🐾',
    name: 'First Paw',
    description: 'Add your first pet to the pack',
    hint: 'Add a pet to get started',
    rarity: 'common',
    condition: ({ pets }) => pets.length >= 1,
  },
  {
    id: 'pack-leader',
    icon: '👑',
    name: 'Pack Leader',
    description: 'Travel with 3 or more pets — that\'s a proper pack',
    hint: 'Add 3 pets to your pack',
    rarity: 'rare',
    condition: ({ pets }) => pets.length >= 3,
  },
  {
    id: 'karoo-crosser',
    icon: '🏜️',
    name: 'Karoo Crosser',
    description: 'Survived the long stretch from Jozi to Cape Town',
    hint: 'Complete the JHB → CPT route',
    rarity: 'common',
    condition: ({ completedRoutes }) => completedRoutes.includes('jhb-cpt'),
  },
  {
    id: 'garden-route-explorer',
    icon: '🌊',
    name: 'Garden Route Explorer',
    description: 'Cruised the most scenic road in Mzansi',
    hint: 'Complete the CPT → Garden Route',
    rarity: 'common',
    condition: ({ completedRoutes }) => completedRoutes.includes('cpt-garden-route'),
  },
  {
    id: 'toll-free-champion',
    icon: '💰',
    name: 'Toll-Free Champion',
    description: 'Saved those rands by taking the scenic route',
    hint: 'Complete any route',
    rarity: 'common',
    condition: ({ completedRoutes }) => completedRoutes.length >= 1,
  },
  {
    id: 'multi-species',
    icon: '🦜🐱🐕',
    name: 'Multi-Species',
    description: 'A dog, a cat, AND a bird — Noah\'s Bakkie',
    hint: 'Have a dog, cat, and bird in your pack',
    rarity: 'legendary',
    condition: ({ pets }) => {
      const types = pets.map(p => (p.species || p.type || '').toLowerCase())
      return types.includes('dog') && types.includes('cat') && types.includes('bird')
    },
  },
  {
    id: 'night-rider',
    icon: '🌙',
    name: 'Night Rider',
    description: 'Switched to dark mode — easier on the eyes for late-night trip planning',
    hint: 'Enable dark mode',
    rarity: 'common',
    condition: ({ dark }) => !!dark,
  },
  {
    id: 'community-hero',
    icon: '⭐',
    name: 'Community Hero',
    description: 'Left 3+ reviews to help fellow pet travellers',
    hint: 'Leave 3 reviews on stops',
    rarity: 'rare',
    condition: ({ reviewCount }) => reviewCount >= 3,
  },
  {
    id: 'braai-master',
    icon: '🔥',
    name: 'Braai Master',
    description: 'Found the perfect braai spot — pets welcome, obviously',
    hint: 'Visit a braai-friendly stop',
    rarity: 'rare',
    condition: ({ completedRoutes }) => completedRoutes.some(r => r.includes('braai')),
  },
  {
    id: 'stargazer',
    icon: '✨',
    name: 'Stargazer',
    description: 'Stopped to watch the Karoo skies with your furry co-pilot',
    hint: 'Visit a stargazing stop',
    rarity: 'rare',
    condition: ({ completedRoutes }) => completedRoutes.some(r => r.includes('stargaze')),
  },
  {
    id: 'vet-ready',
    icon: '🏥',
    name: 'Vet Ready',
    description: 'Pet passport filled in — ready for anything on the road',
    hint: 'Complete a pet passport',
    rarity: 'rare',
    condition: ({ pets }) => pets.some(p => p.passport || p.vaccinations || p.microchipId),
  },
  {
    id: 'road-warrior',
    icon: '🛣️',
    name: 'Road Warrior',
    description: 'Three routes done — you and your pets are proper road trippers',
    hint: 'Complete 3 different routes',
    rarity: 'legendary',
    condition: ({ completedRoutes }) => completedRoutes.length >= 3,
  },
]

const RARITY_COLORS = {
  common: { bg: 'var(--forest)', label: 'Common' },
  rare: { bg: 'var(--terracotta)', label: 'Rare' },
  legendary: { bg: 'var(--ochre)', label: 'Legendary' },
}

export default function Achievements({ pets = [], completedRoutes = [], reviewCount = 0, dark, open, onClose }) {
  if (!open) return null

  const ctx = { pets, completedRoutes, reviewCount, dark }

  const evaluated = useMemo(() =>
    BADGES.map(badge => ({
      ...badge,
      unlocked: badge.condition(ctx),
    })),
    [pets, completedRoutes, reviewCount, dark]
  )

  const unlockedCount = evaluated.filter(b => b.unlocked).length
  const total = evaluated.length
  const pct = Math.round((unlockedCount / total) * 100)

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
          background: dark ? 'rgba(196,152,59,0.12)' : 'rgba(196,152,59,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>
              🏆 Achievements
            </h2>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 'var(--radius-full)',
              background: dark ? 'var(--card-dark)' : 'var(--sand)',
              border: 'none', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'inherit',
            }}>✕</button>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 4 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600,
              color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
              marginBottom: 6,
            }}>
              <span>{unlockedCount}/{total} badges unlocked</span>
              <span>{pct}%</span>
            </div>
            <div style={{
              height: 8, borderRadius: 'var(--radius-full)',
              background: dark ? 'rgba(255,255,255,0.1)' : 'var(--sand)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(90deg, var(--forest), var(--ochre))',
                transition: 'width 0.5s var(--ease-out)',
              }} />
            </div>
          </div>
        </div>

        {/* Badge Grid */}
        <div style={{
          padding: '16px 24px 24px', overflowY: 'auto', flex: 1,
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12,
          }}>
            {evaluated.map(badge => {
              const rarity = RARITY_COLORS[badge.rarity]
              return (
                <div key={badge.id} style={{
                  padding: 14,
                  borderRadius: 'var(--radius-md)',
                  background: dark ? 'var(--card-dark)' : '#FFF',
                  border: `1px solid ${badge.unlocked
                    ? (badge.rarity === 'legendary' ? 'var(--ochre)' : 'var(--forest)')
                    : dark ? 'var(--border-dark)' : 'var(--border)'}`,
                  opacity: badge.unlocked ? 1 : 0.5,
                  position: 'relative',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  boxShadow: badge.unlocked
                    ? `0 0 16px ${badge.rarity === 'legendary' ? 'rgba(196,152,59,0.35)' : 'rgba(76,111,64,0.2)'}`
                    : 'none',
                }}>
                  {/* Rarity tag */}
                  <span style={{
                    position: 'absolute', top: 6, right: 6,
                    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '2px 6px', borderRadius: 'var(--radius-full)',
                    background: rarity.bg, color: '#FFF',
                  }}>
                    {rarity.label}
                  </span>

                  <div style={{
                    fontSize: 32, marginBottom: 6, marginTop: 4,
                    filter: badge.unlocked ? 'none' : 'grayscale(1)',
                  }}>
                    {badge.icon}
                  </div>

                  <div style={{
                    fontSize: 13, fontWeight: 700, marginBottom: 4,
                    color: badge.unlocked
                      ? (dark ? '#FFF' : 'var(--bark)')
                      : (dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)'),
                  }}>
                    {badge.name}
                  </div>

                  <div style={{
                    fontSize: 11, lineHeight: 1.4,
                    color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
                  }}>
                    {badge.unlocked ? badge.description : badge.hint}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
