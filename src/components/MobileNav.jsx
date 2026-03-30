import React from 'react'

/**
 * Mobile bottom navigation bar — appears only on small screens.
 * Provides quick access to key features without scrolling the panel.
 */
export default function MobileNav({
  dark,
  selectedRoute,
  onShowRoutes,
  onShowVetSOS,
  onShowFirstAid,
  onShowNearMe,
  onShowMore,
  activeTab = 'routes',
}) {
  const tabs = [
    { id: 'routes', icon: '🗺️', label: 'Routes', action: onShowRoutes },
    { id: 'nearme', icon: '📍', label: 'Near Me', action: onShowNearMe },
    { id: 'vet', icon: '🏥', label: 'SOS', action: onShowVetSOS, urgent: true },
    { id: 'firstaid', icon: '🩺', label: 'First Aid', action: onShowFirstAid },
    { id: 'more', icon: '•••', label: 'More', action: onShowMore },
  ]

  return (
    <nav className="mobile-bottom-nav" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 300,
      display: 'none', // shown via media query
      background: dark ? 'rgba(20,18,16,0.97)' : 'rgba(253,250,243,0.97)',
      backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.06)'}`,
      padding: '6px 0 env(safe-area-inset-bottom, 6px)',
      boxShadow: '0 -2px 20px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        maxWidth: 500, margin: '0 auto',
      }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={tab.action}
              style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, padding: '6px 4px',
                background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit',
                color: isActive
                  ? 'var(--terracotta)'
                  : (dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)'),
                transition: 'color 0.15s',
                position: 'relative',
              }}
            >
              {/* Active indicator dot */}
              {isActive && (
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%',
                  background: 'var(--terracotta)',
                }} />
              )}

              <span style={{
                fontSize: tab.urgent ? 20 : 18,
                lineHeight: 1,
                filter: tab.urgent && !isActive ? 'none' : undefined,
              }}>
                {tab.icon}
              </span>

              <span style={{
                fontSize: 9, fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}>
                {tab.label}
              </span>

              {/* SOS pulse ring */}
              {tab.urgent && (
                <div style={{
                  position: 'absolute', top: 2, left: '50%', transform: 'translateX(-50%)',
                  width: 24, height: 24, borderRadius: '50%',
                  border: '1.5px solid rgba(220,50,50,0.25)',
                  animation: 'sosPulse 3s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
