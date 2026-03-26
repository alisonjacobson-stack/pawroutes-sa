import React from 'react'
import { SEASONAL_ALERTS } from '../data/packList'

export default function AlertsPanel({ open, onClose, dark }) {
  if (!open) return null

  const currentMonth = new Date().getMonth() + 1
  const activeAlerts = SEASONAL_ALERTS.filter(a => a.activeMonths.includes(currentMonth))
  const inactiveAlerts = SEASONAL_ALERTS.filter(a => !a.activeMonths.includes(currentMonth))

  const severityColor = {
    high: 'var(--terracotta)',
    medium: 'var(--ochre)',
    low: 'var(--sage)',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%', maxWidth: 520, maxHeight: '85vh',
          background: dark ? 'var(--bg-dark)' : 'var(--cream)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInUp 0.3s var(--ease-out)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
            ⚠️ Seasonal Alerts
          </h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 'var(--radius-full)',
            background: dark ? 'var(--card-dark)' : 'var(--sand)',
            border: 'none', cursor: 'pointer', fontSize: 16, color: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        {/* Alerts */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
          {activeAlerts.length > 0 && (
            <>
              <div style={{
                fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--terracotta)', marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: 'var(--terracotta)',
                  animation: 'pulse 2s infinite',
                }} />
                Active Now
              </div>
              {activeAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} active dark={dark} severityColor={severityColor} />
              ))}
            </>
          )}

          {inactiveAlerts.length > 0 && (
            <>
              <div style={{
                fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--text-muted)',
                marginBottom: 12, marginTop: activeAlerts.length > 0 ? 20 : 0,
              }}>
                Not Currently Active
              </div>
              {inactiveAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} active={false} dark={dark} severityColor={severityColor} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function AlertCard({ alert, active, dark, severityColor }) {
  return (
    <div style={{
      padding: 16, marginBottom: 12,
      background: active
        ? (dark ? 'rgba(196,97,59,0.1)' : 'rgba(196,97,59,0.05)')
        : (dark ? 'var(--card-dark)' : 'var(--sand-light)'),
      border: `1px solid ${active ? severityColor[alert.severity] + '40' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-md)',
      opacity: active ? 1 : 0.6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 24 }}>{alert.icon}</span>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{alert.title}</h3>
          <span style={{ fontSize: 11, color: severityColor[alert.severity], fontWeight: 600 }}>
            {alert.period}
          </span>
        </div>
        {active && (
          <span style={{
            marginLeft: 'auto', fontSize: 10, fontWeight: 700,
            padding: '3px 8px', borderRadius: 'var(--radius-full)',
            background: severityColor[alert.severity],
            color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {alert.severity}
          </span>
        )}
      </div>

      <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 10, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)' }}>
        {alert.description}
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {alert.tips.map((tip, i) => (
          <li key={i} style={{
            fontSize: 12, lineHeight: 1.5, padding: '4px 0',
            paddingLeft: 18, position: 'relative',
            color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
          }}>
            <span style={{ position: 'absolute', left: 0, top: 4 }}>🐾</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  )
}
