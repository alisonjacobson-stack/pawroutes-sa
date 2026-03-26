import React, { useState, useEffect } from 'react'

const STORAGE_PREFIX = 'pawroutes-offline-'

export default function OfflineDownload({ route, stops = [], dark }) {
  const [saved, setSaved] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  const storageKey = route ? `${STORAGE_PREFIX}${route.id}` : null

  useEffect(() => {
    if (!storageKey) return
    setSaved(!!localStorage.getItem(storageKey))
    setJustSaved(false)
  }, [storageKey])

  if (!route) return null

  const handleSave = () => {
    const data = {
      route,
      stops,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(storageKey, JSON.stringify(data))
    setSaved(true)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 3000)
  }

  const handleRemove = () => {
    localStorage.removeItem(storageKey)
    setSaved(false)
    setJustSaved(false)
  }

  const stopCount = stops.length

  return (
    <div style={{
      padding: '12px 14px',
      borderRadius: 'var(--radius-md)',
      background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
      border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
    }}>
      {saved ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 14, fontWeight: 700,
              color: 'var(--forest)',
            }}>
              {justSaved ? `✓ Saved! Route + ${stopCount} stop${stopCount !== 1 ? 's' : ''} available offline` : '✓ Saved offline'}
            </span>
          </div>
          <button
            onClick={handleRemove}
            style={{
              fontSize: 12, fontWeight: 600,
              color: 'var(--terracotta)',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 8px', borderRadius: 'var(--radius-sm)',
              textDecoration: 'underline',
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          onClick={handleSave}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%',
            padding: '8px 12px',
            background: dark ? 'var(--forest)' : 'var(--forest)',
            color: '#FFF',
            border: 'none', borderRadius: 'var(--radius-sm)',
            cursor: 'pointer', fontWeight: 700, fontSize: 14,
            fontFamily: 'inherit',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          📥 Save for offline
        </button>
      )}

      <p style={{
        fontSize: 11, lineHeight: 1.5, margin: '8px 0 0',
        color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
      }}>
        Signal drops in the Karoo and Northern Cape — save your route before you leave!
      </p>
    </div>
  )
}
