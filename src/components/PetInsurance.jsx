import React, { useState, useEffect } from 'react'

const STORAGE_KEY = 'pawroutes-insurance-dismissed'

/**
 * Pet insurance affiliate banner.
 * Shows contextually on route selection or vet SOS.
 * Dismissible, shows only once per session.
 */
export default function PetInsurance({ dark, route, vetMode = false }) {
  const [dismissed, setDismissed] = useState(false)
  const [sessionShown, setSessionShown] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored === 'true') {
      setDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }

  // Don't render if dismissed or already shown & dismissed this session
  if (dismissed) return null

  // Only show when there's context (route selected or vet mode)
  if (!route && !vetMode) return null

  // Mark as shown for this session
  if (!sessionShown) {
    // We'll track this but still show — dismiss is explicit
  }

  const headline = vetMode
    ? "This is why pet insurance matters."
    : "Traveling with pets? Make sure they're covered."

  const cardBg = dark ? 'var(--card-dark)' : 'var(--sand-light)'
  const borderColor = dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.08)'
  const textPrimary = dark ? 'var(--sand)' : 'var(--forest)'
  const textMuted = dark ? 'var(--text-muted)' : 'var(--text-secondary)'

  return (
    <div style={{
      background: cardBg,
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      position: 'relative',
      animation: 'fadeIn 0.3s ease',
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          position: 'absolute', top: 8, right: 8,
          width: 22, height: 22,
          borderRadius: 'var(--radius-full)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: 12,
          color: textMuted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0.6,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
      >
        &#10005;
      </button>

      {/* Content */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingRight: 16 }}>
        <div style={{
          width: 36, height: 36,
          borderRadius: 'var(--radius-sm)',
          background: dark ? 'rgba(76,124,89,0.12)' : 'rgba(76,124,89,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>
          {vetMode ? '🩺' : '🛡️'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Headline */}
          <div style={{
            fontSize: 13, fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: textPrimary,
            marginBottom: 6,
            lineHeight: 1.3,
          }}>
            {headline}
          </div>

          {/* Links */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8,
            marginBottom: 8,
          }}>
            <InsuranceLink
              href="https://www.oneplan.co.za/pet-insurance"
              label="Oneplan Pet Insurance"
              dark={dark}
            />
            <InsuranceLink
              href="https://www.medpet.co.za"
              label="MedPet"
              dark={dark}
            />
          </div>

          {/* Disclaimer */}
          <div style={{
            fontSize: 10,
            color: textMuted,
            fontStyle: 'italic',
            opacity: 0.7,
          }}>
            We may earn a commission
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Insurance link pill ──────────────────────────────────────────────
function InsuranceLink({ href, label, dark }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '5px 12px',
        fontSize: 11, fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        border: `1px solid ${hovered ? 'var(--forest)' : (dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.1)')}`,
        background: hovered
          ? (dark ? 'var(--forest)' : 'var(--forest)')
          : (dark ? 'transparent' : '#FFF'),
        color: hovered ? '#FFF' : (dark ? 'var(--sand)' : 'var(--forest)'),
        textDecoration: 'none',
        transition: 'all 0.15s',
        cursor: 'pointer',
      }}
    >
      {label}
      <span style={{ fontSize: 9, opacity: 0.6 }}>&#8599;</span>
    </a>
  )
}
