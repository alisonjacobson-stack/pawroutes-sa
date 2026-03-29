import React from 'react'

// ── Affiliate link generators ─────────────────────────────────────

/**
 * Generate affiliate links for a stop based on its category and town.
 * Accommodation stops get Booking.com links; all stops with a town get Airbnb.
 * Restaurants return null (no affiliate programme).
 *
 * @param {object} stop - Stop object with at least { category, town }
 * @returns {string|null} Primary affiliate URL, or null if no affiliate
 */
export function getAffiliateLink(stop) {
  if (!stop?.town) return null

  // Accommodation stops → Booking.com with pet-friendly filter
  if (stop.category === 'stay') {
    return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(stop.town + ' South Africa')}&nflt=hotelfacility%3D4`
  }

  // Restaurants → no affiliate
  if (stop.category === 'restaurant') return null

  // All other stops → Airbnb pet-friendly search
  return `https://www.airbnb.com/s/${encodeURIComponent(stop.town + '--South-Africa')}/homes?pets=1`
}

/**
 * Get affiliate badge info for a stop.
 *
 * @param {object} stop - Stop object with at least { category, town }
 * @returns {{ platform: string, icon: string, label: string, url: string }|null}
 */
export function getAffiliateBadge(stop) {
  if (!stop?.town) return null

  if (stop.category === 'stay') {
    return {
      platform: 'booking',
      icon: '\uD83C\uDFE8', // 🏨
      label: 'Book pet-friendly stays',
      url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(stop.town + ' South Africa')}&nflt=hotelfacility%3D4`,
    }
  }

  if (stop.category === 'restaurant') return null

  return {
    platform: 'airbnb',
    icon: '\uD83C\uDFE1', // 🏡
    label: 'Find pet-friendly Airbnbs',
    url: `https://www.airbnb.com/s/${encodeURIComponent(stop.town + '--South-Africa')}/homes?pets=1`,
  }
}

// ── React component ───────────────────────────────────────────────

/**
 * Compact inline affiliate buttons shown below a stop card.
 * Props: stop (object), dark (boolean)
 */
export function AffiliateLinks({ stop, dark }) {
  if (!stop?.town) return null

  const links = []

  // Booking.com for stays
  if (stop.category === 'stay') {
    links.push({
      platform: 'booking',
      icon: '🏨',
      label: 'Book pet-friendly stays',
      url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(stop.town + ' South Africa')}&nflt=hotelfacility%3D4`,
    })
  }

  // Airbnb for all stops (except restaurants)
  if (stop.category !== 'restaurant') {
    links.push({
      platform: 'airbnb',
      icon: '🏡',
      label: 'Find pet-friendly Airbnbs',
      url: `https://www.airbnb.com/s/${encodeURIComponent(stop.town + '--South-Africa')}/homes?pets=1`,
    })
  }

  if (links.length === 0) return null

  const mutedColor = dark ? 'var(--text-muted)' : 'var(--text-secondary)'

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {links.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '5px 10px',
              fontSize: 12, fontWeight: 600,
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.1)'}`,
              background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
              color: dark ? '#E8DFD4' : '#2C2418',
              textDecoration: 'none',
              transition: 'all 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--terracotta)'
              e.currentTarget.style.color = '#FFF'
              e.currentTarget.style.borderColor = 'var(--terracotta)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = dark ? 'var(--card-dark)' : 'var(--sand-light)'
              e.currentTarget.style.color = dark ? '#E8DFD4' : '#2C2418'
              e.currentTarget.style.borderColor = dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.1)'
            }}
          >
            <span style={{ fontSize: 14 }}>{link.icon}</span>
            {link.label}
            <span style={{ fontSize: 10, opacity: 0.6 }}>↗</span>
          </a>
        ))}
      </div>
      <div style={{
        fontSize: 10, marginTop: 4,
        color: mutedColor,
        fontStyle: 'italic',
      }}>
        We may earn a commission from bookings
      </div>
    </div>
  )
}
