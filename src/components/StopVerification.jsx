import React, { useState, useMemo, useCallback } from 'react'

const LS_CONFIRMATIONS = 'pawroutes-confirmations'
const LS_REPORTS = 'pawroutes-reports'

function getConfirmations() {
  try { return JSON.parse(localStorage.getItem(LS_CONFIRMATIONS) || '{}') }
  catch { return {} }
}

function getReports() {
  try { return JSON.parse(localStorage.getItem(LS_REPORTS) || '[]') }
  catch { return [] }
}

function daysAgo(ts) {
  const diff = Date.now() - ts
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

export default function StopVerification({ stopId, dark }) {
  const [, rerender] = useState(0)
  const [showReport, setShowReport] = useState(false)

  const bump = useCallback(() => rerender(n => n + 1), [])

  const confirmation = useMemo(() => getConfirmations()[stopId], [stopId, rerender])
  const stopReports = useMemo(
    () => getReports().filter(r => r.stopId === stopId),
    [stopId, rerender]
  )

  const handleConfirm = () => {
    const all = getConfirmations()
    const prev = all[stopId]
    all[stopId] = {
      confirmedAt: Date.now(),
      confirmerCount: (prev?.confirmerCount || 0) + 1,
    }
    localStorage.setItem(LS_CONFIRMATIONS, JSON.stringify(all))
    bump()
  }

  const handleReport = (type) => {
    const all = getReports()
    all.push({ stopId, type, reportedAt: Date.now() })
    localStorage.setItem(LS_REPORTS, JSON.stringify(all))
    setShowReport(false)
    bump()
  }

  const reportTypes = [
    'Permanently closed',
    'Not actually pet-friendly',
    'Wrong information',
    'Other',
  ]

  const hasWarning = stopReports.length >= 3
  const textColor = dark ? 'var(--sand)' : 'var(--forest)'
  const mutedColor = dark ? 'var(--sand)' : 'var(--forest)'

  return (
    <div style={{ fontSize: 12, fontFamily: 'inherit' }}>
      {/* Warning badge */}
      {hasWarning && (
        <div style={{
          background: dark ? 'rgba(220,120,50,0.12)' : 'rgba(220,120,50,0.08)',
          border: '1px solid rgba(220,120,50,0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 10px', marginBottom: 8,
          fontSize: 11, fontWeight: 600,
          color: '#D07830',
        }}>
          ⚠️ Under review — multiple reports received
        </div>
      )}

      {/* Confirmation row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={handleConfirm}
          style={{
            padding: '5px 12px', fontSize: 11, fontWeight: 600,
            background: dark ? 'rgba(80,140,80,0.15)' : 'rgba(60,120,60,0.08)',
            color: '#4A9A4A',
            border: '1px solid rgba(80,140,80,0.3)',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}
        >
          Still open ✓
        </button>
        <span style={{ color: mutedColor, opacity: 0.55, fontSize: 11 }}>
          {confirmation
            ? `Last confirmed ${daysAgo(confirmation.confirmedAt)}`
            : 'Not yet confirmed'}
        </span>
      </div>

      {/* Confirmer count */}
      {confirmation?.confirmerCount > 0 && (
        <div style={{
          fontSize: 10, color: mutedColor, opacity: 0.45,
          marginTop: 4,
        }}>
          Confirmed by {confirmation.confirmerCount} traveler{confirmation.confirmerCount !== 1 ? 's' : ''}
        </div>
      )}

      {/* Report section */}
      <div style={{ marginTop: 8 }}>
        {!showReport ? (
          <button
            onClick={() => setShowReport(true)}
            style={{
              padding: 0, fontSize: 11, fontWeight: 500,
              background: 'none', border: 'none',
              color: mutedColor, opacity: 0.5,
              cursor: 'pointer', fontFamily: 'inherit',
              textDecoration: 'underline',
            }}
          >
            Report a Problem
          </button>
        ) : (
          <div style={{
            background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 10px',
            animation: 'fadeIn 0.15s',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, marginBottom: 6,
              color: textColor,
            }}>
              What's wrong?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {reportTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleReport(type)}
                  style={{
                    padding: '5px 10px', fontSize: 11,
                    background: dark ? 'var(--bg-dark)' : '#FFF',
                    color: textColor,
                    border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border, #e0d5c5)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReport(false)}
              style={{
                marginTop: 6, padding: 0, fontSize: 10,
                background: 'none', border: 'none',
                color: mutedColor, opacity: 0.5,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
