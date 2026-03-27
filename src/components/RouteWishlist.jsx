import React, { useCallback } from 'react'

const STORAGE_KEY = 'pawroutes-wishlist'

export function loadWishlist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

export function saveWishlist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

/**
 * Heart/bookmark toggle button for individual route cards.
 */
export function WishlistToggle({ routeId, wishlist = [], onToggleWishlist, dark }) {
  const isWished = wishlist.includes(routeId)

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggleWishlist(routeId) }}
      title={isWished ? 'Remove from bucket list' : 'Add to bucket list'}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 18, padding: '4px 6px', lineHeight: 1,
        color: isWished ? 'var(--terracotta)' : (dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)'),
        transition: 'all 0.2s',
        transform: isWished ? 'scale(1.15)' : 'scale(1)',
      }}
      aria-label={isWished ? 'Remove from bucket list' : 'Add to bucket list'}
    >
      {isWished ? '\u2764\uFE0F' : '\u{1F90D}'}
    </button>
  )
}

/**
 * Bucket list section shown at top of route list when wishlist has items.
 */
export default function RouteWishlist({ routes = [], wishlist = [], onToggleWishlist, onSetTripDate, dark }) {
  const wishedRoutes = routes.filter(r => wishlist.includes(r.id))

  const handleShare = useCallback(() => {
    const names = wishedRoutes.map(r => `\u{1F43E} ${r.name}`).join('\n')
    const text = `\u{1F5FA}\uFE0F My PawRoutes Bucket List:\n\n${names}\n\n${wishedRoutes.length}/${routes.length} routes to explore with my pets!\n\nPlan yours at PawRoutes SA \u{1F1FF}\u{1F1E6}`
    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }, [wishedRoutes, routes.length])

  if (wishedRoutes.length === 0) return null

  const borderColor = dark ? 'var(--border-dark)' : '#e0d5c5'
  const cardBg = dark ? 'var(--card-dark)' : 'var(--sand-light)'
  const mutedText = dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)'
  const allWished = wishedRoutes.length === routes.length && routes.length > 0

  return (
    <div style={{
      background: cardBg, borderRadius: 'var(--radius-md)',
      border: `1px solid ${borderColor}`, marginBottom: 16, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, fontFamily: 'var(--font-display)' }}>
            {'\u{1F5FA}\uFE0F'} Your Bucket List
          </div>
          <div style={{ fontSize: 12, color: mutedText, marginTop: 2 }}>
            {wishedRoutes.length}/{routes.length} routes on your bucket list
          </div>
        </div>
        <BucketBadge count={wishedRoutes.length} />
      </div>

      {/* All routes wished message */}
      {allWished && (
        <div style={{
          padding: '10px 16px', fontSize: 13, fontWeight: 600,
          background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(196,97,59,0.06)',
          color: 'var(--terracotta)', textAlign: 'center',
          borderBottom: `1px solid ${borderColor}`,
        }}>
          You want to do them ALL! True adventurer! {'\u{1F3C6}'}
        </div>
      )}

      {/* Route list */}
      <div style={{ padding: '8px 12px' }}>
        {wishedRoutes.map(route => {
          const distance = route.tollRoute?.distance || route.freeRoute?.distance || '?'
          return (
            <div key={route.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 4px',
              borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {route.name}
                </div>
                <div style={{ fontSize: 12, color: mutedText }}>
                  {distance}km
                </div>
              </div>
              {onSetTripDate && (
                <button onClick={() => onSetTripDate(route.id)} style={{
                  background: 'none', border: 'none', fontSize: 12, fontWeight: 600,
                  color: 'var(--forest)', cursor: 'pointer', fontFamily: 'inherit',
                  padding: '4px 8px', whiteSpace: 'nowrap',
                }}>
                  {'\u{1F4C5}'} Set date
                </button>
              )}
              <button
                onClick={() => onToggleWishlist(route.id)}
                title="Remove from bucket list"
                style={{
                  background: 'none', border: 'none', fontSize: 14,
                  color: 'var(--text-muted)', cursor: 'pointer', padding: '4px 6px',
                  lineHeight: 1,
                }}
              >
                {'\u2715'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Share */}
      <div style={{ padding: '8px 12px 12px' }}>
        <button onClick={handleShare} style={{
          width: '100%', padding: '9px 14px', fontSize: 13, fontWeight: 700,
          background: '#25D366', color: '#fff', border: 'none',
          borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 0.2s',
        }}>
          {'\u{1F4AC}'} Share your bucket list
        </button>
      </div>
    </div>
  )
}

/**
 * Small badge showing wishlist count. Use in route selector header.
 */
export function BucketBadge({ count }) {
  if (!count) return null
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 22, height: 22, padding: '0 6px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--terracotta)', color: '#fff',
      fontSize: 11, fontWeight: 800, lineHeight: 1,
    }}>
      {count}
    </span>
  )
}
