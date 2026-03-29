import React, { useState, useCallback, useMemo } from 'react'
import MapView from './components/MapView'
import RoutePanel from './components/RoutePanel'
import PackListModal from './components/PackListModal'
import AlertsPanel from './components/AlertsPanel'
import Header from './components/Header'
import MyPackPanel from './components/MyPackPanel'
import TripTimeline from './components/TripTimeline'
import VetSOS from './components/VetSOS'
import TripCostCalculator from './components/TripCostCalculator'
import PetPassport from './components/PetPassport'
import ShareTrip from './components/ShareTrip'
import Achievements from './components/Achievements'
import WeatherRoute from './components/WeatherRoute'
import OfflineDownload from './components/OfflineDownload'
import TravelStats from './components/TravelStats'
import PassportStamps from './components/PassportStamps'
import PetTravelCard from './components/PetTravelCard'
import PackIntroCard from './components/PackIntroCard'
import TripWrapped from './components/TripWrapped'
import TripCountdown from './components/TripCountdown'
import RouteWishlist from './components/RouteWishlist'
import PostcardGenerator from './components/PostcardGenerator'
import ListVenueModal from './components/ListVenueModal'
import ListVenueCTA from './components/ListVenueCTA'
import PoliciesModal from './components/PoliciesModal'
import AmbientMusic from './components/AmbientMusic'
import { ROUTES, CITIES } from './data/routes'
import { STOPS, STOP_CATEGORIES } from './data/stops'
import { SEASONAL_ALERTS } from './data/packList'

export default function App() {
  const [dark, setDark] = useState(false)
  const [nightDriving, setNightDriving] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [showToll, setShowToll] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])
  const [showPackList, setShowPackList] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [panelOpen, setPanelOpen] = useState(true)
  const [pets, setPets] = useState([])
  const [packCollapsed, setPackCollapsed] = useState(false)

  // New feature modals
  const [showTimeline, setShowTimeline] = useState(false)
  const [showVetSOS, setShowVetSOS] = useState(false)
  const [showCostCalc, setShowCostCalc] = useState(false)
  const [showPassport, setShowPassport] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showStamps, setShowStamps] = useState(false)
  const [showTravelCard, setShowTravelCard] = useState(false)
  const [showPackCard, setShowPackCard] = useState(false)
  const [showWrapped, setShowWrapped] = useState(false)
  const [showPostcard, setShowPostcard] = useState(false)
  const [showListVenue, setShowListVenue] = useState(false)
  const [showPolicies, setShowPolicies] = useState(false)
  const [completedRoutes, setCompletedRoutes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pawroutes-completed') || '[]') } catch { return [] }
  })
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pawroutes-wishlist') || '[]') } catch { return [] }
  })
  const [reviewCount, setReviewCount] = useState(0)

  // Persist completed routes and wishlist
  React.useEffect(() => {
    localStorage.setItem('pawroutes-completed', JSON.stringify(completedRoutes))
  }, [completedRoutes])
  React.useEffect(() => {
    localStorage.setItem('pawroutes-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = useCallback((routeId) => {
    setWishlist(prev => prev.includes(routeId) ? prev.filter(id => id !== routeId) : [...prev, routeId])
  }, [])

  // Active seasonal alerts count
  const currentMonth = new Date().getMonth() + 1
  const activeAlertCount = SEASONAL_ALERTS.filter(a => a.activeMonths.includes(currentMonth)).length

  // Filter stops for selected route
  const visibleStops = useMemo(() => {
    if (!selectedRoute) return []
    return STOPS.filter(s =>
      s.routeId === selectedRoute.id || s.alsoOnRoute?.includes(selectedRoute.id)
    )
  }, [selectedRoute])

  const handleSelectRoute = useCallback((route) => {
    setSelectedRoute(route)
    setShowToll(false)
    setActiveFilters([])
    if (route) {
      setPackCollapsed(true)
      // Track completed routes for achievements
      if (route && !completedRoutes.includes(route.id)) {
        setCompletedRoutes(prev => [...prev, route.id])
      }
    }
  }, [completedRoutes])

  const handleToggleFilter = useCallback((key) => {
    setActiveFilters(prev => {
      if (prev.length === 0) return [key]
      if (prev.includes(key)) {
        const next = prev.filter(k => k !== key)
        return next.length === 0 ? [] : next
      }
      return [...prev, key]
    })
  }, [])

  // Dark mode cycling: light → dark → night driving → light
  const handleToggleDark = useCallback(() => {
    if (!dark) {
      setDark(true)
      setNightDriving(false)
    } else if (!nightDriving) {
      setNightDriving(true)
    } else {
      setDark(false)
      setNightDriving(false)
    }
  }, [dark, nightDriving])

  // Apply dark mode + night driving to body
  React.useEffect(() => {
    document.body.classList.toggle('dark', dark)
    document.body.classList.toggle('night-driving', nightDriving)
  }, [dark, nightDriving])

  const darkIcon = !dark ? '🌙' : nightDriving ? '☀️' : '🔴'
  const darkTitle = !dark ? 'Dark mode' : nightDriving ? 'Light mode' : 'Night driving mode (red light)'

  // Floating button style helper
  const fabStyle = (bg, shadow) => ({
    width: 48, height: 48, borderRadius: 'var(--radius-lg)',
    background: bg || (dark ? 'var(--card-dark)' : '#FFF'),
    border: bg ? 'none' : `2px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
    boxShadow: shadow || '0 4px 16px var(--shadow-heavy)',
    cursor: 'pointer', fontSize: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    transition: 'transform 0.15s var(--ease-bounce)',
  })

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="noise-overlay" />

      {/* Header */}
      <Header
        dark={dark}
        onToggleDark={handleToggleDark}
        panelOpen={panelOpen}
        onTogglePanel={() => setPanelOpen(p => !p)}
        darkIcon={darkIcon}
        darkTitle={darkTitle}
        pets={pets}
        onListVenue={() => setShowListVenue(true)}
      />

      {/* Main layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Side panel — wider when no route selected to emphasise the start flow */}
        <aside
          style={{
            width: selectedRoute ? 380 : 480, flexShrink: 0,
            background: dark ? 'var(--bg-dark)' : 'var(--cream)',
            borderRight: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            transition: 'width 0.4s var(--ease-out), transform 0.3s var(--ease-out)',
            position: 'relative',
            zIndex: 10,
          }}
          className="side-panel"
        >
          {/* Panel header */}
          <div style={{
            padding: '16px 16px 12px',
            borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{
                fontSize: 14, fontWeight: 700, margin: 0,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
              }}>
                {selectedRoute ? 'Route Details' : 'Routes'}
              </h2>
              <div style={{ display: 'flex', gap: 4 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  padding: '3px 10px', borderRadius: 'var(--radius-full)',
                  background: dark ? 'var(--card-dark)' : 'var(--sand)',
                  color: 'var(--forest)',
                }}>
                  {ROUTES.length} routes
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  padding: '3px 10px', borderRadius: 'var(--radius-full)',
                  background: dark ? 'var(--card-dark)' : 'var(--sand)',
                  color: 'var(--bark)',
                }}>
                  {STOPS.length} stops
                </span>
              </div>
            </div>
          </div>

          {/* My Pack */}
          <MyPackPanel
            pets={pets}
            onUpdatePets={setPets}
            dark={dark}
            collapsed={packCollapsed}
            onToggleCollapsed={() => setPackCollapsed(c => !c)}
          />

          {/* Route panel */}
          <RoutePanel
            routes={ROUTES}
            selectedRoute={selectedRoute}
            onSelectRoute={handleSelectRoute}
            stops={STOPS}
            showToll={showToll}
            onToggleToll={() => setShowToll(t => !t)}
            activeFilters={activeFilters}
            onToggleFilter={handleToggleFilter}
            dark={dark}
            pets={pets}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            TripCountdown={selectedRoute ? <TripCountdown route={selectedRoute} pets={pets} dark={dark} /> : null}
            RouteWishlist={!selectedRoute ? <RouteWishlist routes={ROUTES} wishlist={wishlist} onToggleWishlist={toggleWishlist} dark={dark} /> : null}
            onListVenue={() => setShowListVenue(true)}
          />
        </aside>

        {/* Map */}
        <main style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0, zIndex: 1, width: 0 }}>
          <MapView
            selectedRoute={selectedRoute}
            showTollRoute={showToll}
            stops={visibleStops}
            activeFilters={activeFilters}
            cities={CITIES}
            dark={dark}
          />

          {/* Map hint when no route selected */}
          {!selectedRoute && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 40,
              background: dark ? 'rgba(26,22,18,0.4)' : 'rgba(255,253,245,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
              backdropFilter: 'blur(1px)',
            }}>
              <div style={{
                textAlign: 'center', padding: '24px 32px',
                background: dark ? 'rgba(26,22,18,0.85)' : 'rgba(255,253,245,0.9)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                backdropFilter: 'blur(12px)',
                maxWidth: 320,
              }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🐾</div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600,
                  color: dark ? 'var(--text-dark)' : 'var(--text)',
                  marginBottom: 6,
                }}>
                  Your route will appear here
                </div>
                <div style={{
                  fontSize: 13,
                  color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}>
                  ← Pick a route from the panel to see the toll-free path and all pet-friendly stops mapped out
                </div>
                <div style={{ marginTop: 12, pointerEvents: 'auto' }}>
                  <ListVenueCTA variant="inline" onClick={() => setShowListVenue(true)} dark={dark} />
                </div>
              </div>
            </div>
          )}

          {/* Floating action buttons — LEFT column (route tools) */}
          {selectedRoute && (
            <div style={{
              position: 'absolute', top: 16, right: 16,
              display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end',
              zIndex: 50, maxWidth: 280,
            }}>
              <button onClick={() => setShowTimeline(true)} style={fabStyle()} title="Trip Timeline"
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >🗓️</button>
              <button onClick={() => setShowCostCalc(true)} style={fabStyle()} title="Trip Cost Calculator"
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >💰</button>
              <button onClick={() => setShowWeather(true)} style={fabStyle()} title="Weather Along Route"
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >🌤️</button>
              <button onClick={() => setShowShare(true)} style={fabStyle()} title="Share Trip Plan"
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >📤</button>
              <button onClick={() => setShowPostcard(true)} style={fabStyle()} title="Send a Postcard"
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >💌</button>
            </div>
          )}

          {/* Floating action buttons — RIGHT column (always visible) */}
          <div style={{
            position: 'absolute', bottom: 24, right: 24,
            display: 'flex', flexDirection: 'column', gap: 8,
            zIndex: 50,
          }}>
            {/* Travel Stats */}
            <button onClick={() => setShowStats(true)}
              style={fabStyle()} title="Travel Stats"
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >📊</button>

            {/* Passport Stamps */}
            <button onClick={() => setShowStamps(true)}
              style={fabStyle()} title="Passport Stamps"
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >🛂</button>

            {/* Trip Wrapped */}
            <button onClick={() => setShowWrapped(true)}
              style={{...fabStyle('linear-gradient(135deg, var(--terracotta), var(--ochre))'), color: '#FFF'}}
              title="Your PawRoutes Wrapped!"
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >🎁</button>

            {/* Share Cards */}
            {pets.length > 0 && (
              <>
                <button onClick={() => setShowTravelCard(true)}
                  style={fabStyle()} title="Pet Travel Card"
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >🪪</button>
                <button onClick={() => setShowPackCard(true)}
                  style={fabStyle()} title="Pack Intro Card"
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >👥</button>
              </>
            )}

            {/* Achievements */}
            <button onClick={() => setShowAchievements(true)}
              style={fabStyle()} title="Achievements & Badges"
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >🏆</button>

            {/* Pet Passport */}
            {pets.length > 0 && (
              <button onClick={() => setShowPassport(true)}
                style={fabStyle()} title="Pet Health Passport"
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >📋</button>
            )}

            {/* Vet SOS */}
            <button onClick={() => setShowVetSOS(true)}
              className="sos-pulse"
              style={{
                ...fabStyle('#DC3232', '0 4px 16px rgba(220,50,50,0.3)'),
                color: '#FFF',
              }}
              title="🚨 Emergency Vet SOS"
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >🏥</button>

            {/* Alerts */}
            <button onClick={() => setShowAlerts(true)}
              style={fabStyle()} title="Seasonal alerts"
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              ⚠️
              {activeAlertCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--terracotta)', color: '#FFF',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${dark ? 'var(--card-dark)' : '#FFF'}`,
                }}>
                  {activeAlertCount}
                </span>
              )}
            </button>

            {/* Pack list */}
            <button onClick={() => setShowPackList(true)}
              style={fabStyle('var(--terracotta)', '0 4px 16px rgba(196,97,59,0.3)')}
              title="Pack list generator"
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >🎒</button>
          </div>

          {/* Legend */}
          {selectedRoute && (
            <div style={{
              position: 'absolute', bottom: 24, left: 24,
              padding: '10px 16px',
              background: dark ? 'var(--card-dark)' : 'rgba(255,255,255,0.95)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 2px 12px var(--shadow)',
              fontSize: 12, zIndex: 50,
              backdropFilter: 'blur(8px)',
              display: 'flex', gap: 16, alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 24, height: 3, background: '#3B6B4A', borderRadius: 2 }} />
                <span>Toll-free</span>
              </div>
              {showToll && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 24, height: 3, borderRadius: 2,
                    backgroundImage: 'repeating-linear-gradient(90deg, #C45B5B 0px, #C45B5B 6px, transparent 6px, transparent 10px)',
                  }} />
                  <span>Toll route</span>
                </div>
              )}
              {/* Offline download inline */}
              <OfflineDownload route={selectedRoute} stops={visibleStops} dark={dark} />
            </div>
          )}

          {/* Empty state */}
          {!selectedRoute && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center', zIndex: 10,
              pointerEvents: 'none',
            }}>
              <div style={{
                background: dark ? 'rgba(26,22,18,0.9)' : 'rgba(255,253,245,0.92)',
                padding: '32px 40px', borderRadius: 'var(--radius-xl)',
                boxShadow: '0 8px 32px var(--shadow-heavy)',
                backdropFilter: 'blur(12px)',
              }}>
                <div style={{ fontSize: 48, marginBottom: 12, animation: 'pawBounce 3s infinite' }}>
                  🐾
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
                  color: 'var(--terracotta)', margin: '0 0 8px',
                }}>
                  Where are you headed?
                </h2>
                <p style={{
                  fontSize: 14, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
                  maxWidth: 280, lineHeight: 1.5, margin: '0 auto',
                }}>
                  Pick a route from the panel to discover toll-free alternatives and pet-friendly stops across South Africa.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* === All Modals === */}
      <PackListModal open={showPackList} onClose={() => setShowPackList(false)} dark={dark} pets={pets} />
      <AlertsPanel open={showAlerts} onClose={() => setShowAlerts(false)} dark={dark} />
      <TripTimeline open={showTimeline} onClose={() => setShowTimeline(false)} route={selectedRoute} stops={visibleStops} pets={pets} dark={dark} />
      <VetSOS open={showVetSOS} onClose={() => setShowVetSOS(false)} stops={STOPS} dark={dark} selectedRoute={selectedRoute} />
      <TripCostCalculator open={showCostCalc} onClose={() => setShowCostCalc(false)} route={selectedRoute} stops={visibleStops} pets={pets} dark={dark} />
      <PetPassport open={showPassport} onClose={() => setShowPassport(false)} pets={pets} onUpdatePets={setPets} dark={dark} />
      <ShareTrip open={showShare} onClose={() => setShowShare(false)} route={selectedRoute} stops={visibleStops} pets={pets} dark={dark} />
      <Achievements open={showAchievements} onClose={() => setShowAchievements(false)} pets={pets} completedRoutes={completedRoutes} reviewCount={reviewCount} dark={dark} />
      <WeatherRoute open={showWeather} onClose={() => setShowWeather(false)} route={selectedRoute} dark={dark} />
      <TravelStats open={showStats} onClose={() => setShowStats(false)} pets={pets} completedRoutes={completedRoutes} routes={ROUTES} dark={dark} />
      <PassportStamps open={showStamps} onClose={() => setShowStamps(false)} completedRoutes={completedRoutes} routes={ROUTES} dark={dark}
        onComplete={(routeId) => { if (!completedRoutes.includes(routeId)) setCompletedRoutes(prev => [...prev, routeId]) }} />
      <PetTravelCard open={showTravelCard} onClose={() => setShowTravelCard(false)} pet={pets[0]} completedRoutes={completedRoutes} routes={ROUTES} dark={dark} />
      <PackIntroCard open={showPackCard} onClose={() => setShowPackCard(false)} pets={pets} dark={dark} />
      <TripWrapped open={showWrapped} onClose={() => setShowWrapped(false)} pets={pets} completedRoutes={completedRoutes} routes={ROUTES} dark={dark} />
      <PostcardGenerator open={showPostcard} onClose={() => setShowPostcard(false)} stops={STOPS} pets={pets} dark={dark} />
      <ListVenueModal open={showListVenue} onClose={() => setShowListVenue(false)} dark={dark} onViewPolicies={() => { setShowListVenue(false); setShowPolicies(true) }} />
      <PoliciesModal open={showPolicies} onClose={() => setShowPolicies(false)} dark={dark} />

      {/* Ambient music player */}
      <AmbientMusic dark={dark} />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .side-panel {
            position: absolute !important;
            top: 0; left: 0; bottom: 0;
            width: 320px !important;
            z-index: 60 !important;
            box-shadow: 4px 0 24px rgba(0,0,0,0.15);
            transform: translateX(${panelOpen ? '0' : '-100%'}) !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}
