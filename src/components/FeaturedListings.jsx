import React, { useState, useRef } from 'react'
import { STOP_CATEGORIES } from '../data/stops'

// ── Featured stop IDs (accommodation & farm venues) ─────────────────
export const FEATURED_STOPS = [
  'parys-pecan',
  'graaff-reinet-stay',
  'dullstroom-farm',
  'nottingham-stay',
  'oudtshoorn-stay',
  'wilderness-park',
]

// ── Gold palette ────────────────────────────────────────────────────
const GOLD = '#D4A532'
const GOLD_LIGHT = '#F5E6B8'
const GOLD_DARK = '#B8912A'
const GOLD_BG = 'linear-gradient(135deg, #D4A532, #E8C44A)'
const GOLD_BG_SUBTLE = 'linear-gradient(135deg, rgba(212,165,50,0.12), rgba(232,196,74,0.08))'
const GOLD_GLOW = '0 0 12px rgba(212,165,50,0.35)'

// ── FeaturedBadge ───────────────────────────────────────────────────
export function FeaturedBadge({ stop, dark }) {
  if (!stop || !FEATURED_STOPS.includes(stop.id)) return null

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      padding: '2px 8px',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.02em',
      color: dark ? '#1A1408' : '#5C4A1E',
      background: GOLD_BG,
      borderRadius: 'var(--radius-full)',
      boxShadow: GOLD_GLOW,
      whiteSpace: 'nowrap',
      animation: 'featuredGlow 2s ease-in-out infinite alternate',
    }}>
      <style>{`
        @keyframes featuredGlow {
          from { box-shadow: 0 0 8px rgba(212,165,50,0.25); }
          to   { box-shadow: 0 0 16px rgba(212,165,50,0.5); }
        }
      `}</style>
      Featured
    </span>
  )
}

// ── FeaturedListings (horizontal scroll section) ────────────────────
export default function FeaturedListings({ stops = [], dark, onSelectStop }) {
  const scrollRef = useRef(null)

  const featured = stops.filter(s => FEATURED_STOPS.includes(s.id))
  if (featured.length === 0) return null

  const cardBg = dark ? 'var(--card-dark)' : '#FFFDF5'
  const textPrimary = dark ? 'var(--sand)' : 'var(--forest)'
  const textSecondary = dark ? 'var(--text-muted)' : 'var(--text-secondary)'

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 0 10px',
      }}>
        <span style={{ fontSize: 16 }}>&#11088;</span>
        <span style={{
          fontSize: 13, fontWeight: 700,
          fontFamily: 'var(--font-display)',
          color: GOLD,
          letterSpacing: '0.01em',
        }}>
          Featured pet-friendly spots on this route
        </span>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex', gap: 12,
          overflowX: 'auto',
          paddingBottom: 8,
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          .featured-scroll::-webkit-scrollbar { display: none; }
        `}</style>
        {featured.map(stop => {
          const cat = STOP_CATEGORIES[stop.category]
          return (
            <div
              key={stop.id}
              onClick={() => onSelectStop?.(stop)}
              style={{
                minWidth: 180, maxWidth: 200,
                padding: '14px 14px 12px',
                background: cardBg,
                border: `1.5px solid ${GOLD}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                scrollSnapAlign: 'start',
                flexShrink: 0,
                transition: 'all 0.2s',
                boxShadow: `0 2px 10px rgba(212,165,50,0.15)`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = GOLD_GLOW
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(212,165,50,0.15)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Category icon + Featured badge */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 8,
              }}>
                <span style={{
                  width: 28, height: 28,
                  borderRadius: 'var(--radius-sm)',
                  background: dark ? 'rgba(212,165,50,0.12)' : 'rgba(212,165,50,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15,
                }}>
                  {cat?.icon || '📍'}
                </span>
                <FeaturedBadge stop={stop} dark={dark} />
              </div>

              {/* Name */}
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: textPrimary,
                marginBottom: 3,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {stop.name}
              </div>

              {/* Town */}
              <div style={{
                fontSize: 11, color: textSecondary,
                marginBottom: 6,
              }}>
                {stop.town}
              </div>

              {/* Rating */}
              {stop.rating && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 11, color: GOLD_DARK,
                  fontWeight: 600,
                }}>
                  <span style={{ fontSize: 12 }}>&#9733;</span>
                  {stop.rating}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── FeaturedCTA (venue owner call-to-action) ────────────────────────
export function FeaturedCTA({ dark }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{
      background: dark ? GOLD_BG_SUBTLE : 'linear-gradient(135deg, rgba(212,165,50,0.06), rgba(232,196,74,0.04))',
      border: `1px solid ${dark ? 'rgba(212,165,50,0.25)' : 'rgba(212,165,50,0.2)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '16px 18px',
      marginTop: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: 'var(--radius-sm)',
          background: GOLD_BG,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
          boxShadow: '0 2px 8px rgba(212,165,50,0.3)',
        }}>
          &#11088;
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: dark ? GOLD_LIGHT : GOLD_DARK,
            marginBottom: 4,
          }}>
            Want to feature your venue?
          </div>
          <div style={{
            fontSize: 11,
            color: dark ? 'var(--text-muted)' : 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: 4,
          }}>
            Gold badge, priority placement, more bookings.
          </div>
          <div style={{
            fontSize: 11, fontWeight: 600,
            color: GOLD,
            marginBottom: 12,
          }}>
            Featured venues get 3x more clicks
          </div>
          <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              padding: '7px 18px',
              fontSize: 12, fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: hovered ? '#FFF' : GOLD_DARK,
              background: hovered ? GOLD_BG : 'transparent',
              border: `1.5px solid ${GOLD}`,
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: hovered ? GOLD_GLOW : 'none',
            }}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}
