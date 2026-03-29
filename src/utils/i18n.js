import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const LS_KEY = 'pawroutes-lang'

// ── Translations ──────────────────────────────────────────────────

export const translations = {
  en: {
    // Header
    'header.tagline': 'Toll-free travel with your best friend',
    'header.darkMode': 'Dark mode',
    'header.lightMode': 'Light mode',

    // Routes panel
    'routes.title': 'Choose your adventure',
    'routes.distance': 'distance',
    'routes.driveTime': 'drive time',
    'routes.tollSaved': 'toll saved',
    'routes.tollFree': 'Toll-free route',
    'routes.tollRoute': 'Toll route',
    'routes.pawScore': 'Paw Score',
    'routes.stops': 'stops',
    'routes.fuelEstimate': 'fuel estimate',
    'routes.noRoute': 'Select a route to get started',
    'routes.via': 'via',

    // My Pack
    'pack.title': 'My Pack',
    'pack.addPet': 'Add a pet',
    'pack.noPets': 'No pets added yet',
    'pack.petName': 'Pet name',
    'pack.petType': 'Pet type',
    'pack.breed': 'Breed',
    'pack.specialNeeds': 'Special needs',
    'pack.removePet': 'Remove pet',
    'pack.vehicle': 'Vehicle type',
    'pack.alerts': 'Pack alerts',

    // Pet types
    'pet.dogSmall': 'Small Dog',
    'pet.dogMedium': 'Medium Dog',
    'pet.dogLarge': 'Large Dog',
    'pet.cat': 'Cat',
    'pet.bird': 'Bird',
    'pet.rabbit': 'Rabbit/Small',

    // Special needs
    'needs.senior': 'Senior pet',
    'needs.anxious': 'Travel anxiety',
    'needs.reactive': 'Reactive/leash-only',
    'needs.medical': 'On medication',
    'needs.puppy': 'Puppy/kitten',
    'needs.carsick': 'Gets carsick',

    // Stops
    'stops.farm': 'Farm Stalls',
    'stops.park': 'Dog Parks & Walks',
    'stops.stay': 'Pet-Friendly Stays',
    'stops.vet': 'Emergency Vets',
    'stops.rest': 'Rest Stops',
    'stops.restaurant': 'Pet-Friendly Eats',
    'stops.navigate': 'Navigate',
    'stops.call': 'Call',
    'stops.petPolicy': 'Pet policy',
    'stops.afterHours': 'After hours',
    'stops.directions': 'Get directions',
    'stops.verified': 'Verified',
    'stops.stale': 'Needs verification',
    'stops.unverified': 'Not yet verified',
    'stops.confirmInfo': 'Confirm info is current',
    'stops.reportIssue': 'Report an issue',

    // Stop categories filter
    'filter.all': 'All stops',
    'filter.farm': 'Farm Stalls',
    'filter.park': 'Parks & Walks',
    'filter.stay': 'Stays',
    'filter.vet': 'Vets',
    'filter.rest': 'Rest Stops',
    'filter.restaurant': 'Restaurants',

    // Modals — general
    'modal.close': 'Close',
    'modal.save': 'Save',
    'modal.cancel': 'Cancel',
    'modal.back': 'Back',
    'modal.next': 'Next',
    'modal.submit': 'Submit',
    'modal.done': 'Done',
    'modal.share': 'Share',
    'modal.download': 'Download',
    'modal.delete': 'Delete',

    // Trip Timeline
    'timeline.title': 'Trip Timeline',
    'timeline.empty': 'Select a route to see your trip timeline',

    // Trip Cost Calculator
    'cost.title': 'Trip Cost Calculator',
    'cost.fuel': 'Fuel (toll-free route)',
    'cost.tolls': 'Toll costs',
    'cost.petFees': 'Pet fees at stays',
    'cost.food': 'Food stops budget',
    'cost.total': 'Total Estimated Cost (Toll-Free)',
    'cost.vsToll': 'vs Toll Route',
    'cost.save': 'Save',

    // Vet SOS
    'vet.title': 'Vet SOS',
    'vet.nearest': 'Nearest emergency vets',
    'vet.callNow': 'Call now',

    // Weather
    'weather.title': 'Route Weather',
    'weather.today': 'Today',

    // Share
    'share.title': 'Share Your Trip',
    'share.copy': 'Copy link',
    'share.copied': 'Copied!',

    // Achievements
    'achievements.title': 'Achievements',
    'achievements.locked': 'Locked',
    'achievements.unlocked': 'Unlocked',

    // Passport & stamps
    'passport.title': 'Pet Passport',
    'stamps.title': 'Passport Stamps',

    // Postcard
    'postcard.title': 'Create Postcard',
    'postcard.generate': 'Generate',

    // Travel stats
    'stats.title': 'Travel Stats',
    'stats.routesCompleted': 'Routes completed',
    'stats.stopsVisited': 'Stops visited',
    'stats.totalDistance': 'Total distance',

    // List venue CTA
    'venue.cta': 'List your venue',
    'venue.ctaSub': 'Is your business pet-friendly? Get listed!',
    'venue.title': 'List Your Venue',
    'venue.basics': 'Venue Basics',
    'venue.petPolicy': 'Pet Policy',
    'venue.contact': 'Contact & Verify',
    'venue.review': 'Review & Submit',

    // Pack list
    'packList.title': 'Pack List',
    'packList.essential': 'Essential',
    'packList.optional': 'Nice to have',

    // Policies
    'policies.title': 'Pet Travel Policies',

    // Reviews
    'reviews.title': 'Reviews',
    'reviews.addReview': 'Add a review',
    'reviews.noReviews': 'No reviews yet',
    'reviews.writeReview': 'Write your review',
    'reviews.yourRating': 'Your rating',

    // Analytics
    'analytics.title': 'Analytics',
    'analytics.engagement': 'Engagement',
    'analytics.routePopularity': 'Route Popularity',
    'analytics.topStops': 'Top Stops',
    'analytics.freshness': 'Stop Freshness',
    'analytics.recentActivity': 'Recent Activity',
    'analytics.last7': 'Last 7 days',
    'analytics.last30': 'Last 30 days',
    'analytics.allTime': 'All time',

    // Wishlist
    'wishlist.title': 'Route Wishlist',
    'wishlist.add': 'Add to wishlist',
    'wishlist.remove': 'Remove from wishlist',

    // Common
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.share': 'Share',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Try again',
    'common.km': 'km',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.and': 'and',
    'common.or': 'or',

    // Offline
    'offline.title': 'Download for Offline',
    'offline.ready': 'Ready for offline use',

    // Countdown
    'countdown.title': 'Trip Countdown',
    'countdown.days': 'days',
    'countdown.until': 'until your trip',

    // Wrapped
    'wrapped.title': 'Your Year in PawRoutes',

    // Night driving
    'night.toggle': 'Night driving mode',

    // Alerts
    'alerts.title': 'Travel Alerts',
    'alerts.seasonal': 'Seasonal alerts',
  },

  af: {
    // Header
    'header.tagline': 'Tolvrye reis met jou beste maat',
    'header.darkMode': 'Donker modus',
    'header.lightMode': 'Ligte modus',

    // Routes panel
    'routes.title': 'Kies jou avontuur',
    'routes.distance': 'afstand',
    'routes.driveTime': 'rytyd',
    'routes.tollSaved': 'tolgeld gespaar',
    'routes.tollFree': 'Tolvrye roete',
    'routes.tollRoute': 'Tolroete',
    'routes.pawScore': 'Poot-telling',
    'routes.stops': 'stopplekke',
    'routes.fuelEstimate': 'brandstofberaming',
    'routes.noRoute': 'Kies \'n roete om te begin',
    'routes.via': 'via',

    // My Pack
    'pack.title': 'My Trop',
    'pack.addPet': 'Voeg \'n troeteldier by',
    'pack.noPets': 'Nog geen troeteldiere bygevoeg nie',
    'pack.petName': 'Troeteldier se naam',
    'pack.petType': 'Troeteldier tipe',
    'pack.breed': 'Ras',
    'pack.specialNeeds': 'Spesiale behoeftes',
    'pack.removePet': 'Verwyder troeteldier',
    'pack.vehicle': 'Voertuig tipe',
    'pack.alerts': 'Trop-waarskuwings',

    // Pet types
    'pet.dogSmall': 'Klein Hond',
    'pet.dogMedium': 'Mediumgrootte Hond',
    'pet.dogLarge': 'Groot Hond',
    'pet.cat': 'Kat',
    'pet.bird': 'Voel',
    'pet.rabbit': 'Konyn/Klein',

    // Special needs
    'needs.senior': 'Senior troeteldier',
    'needs.anxious': 'Reisangs',
    'needs.reactive': 'Reaktief/slegs aan leiband',
    'needs.medical': 'Op medikasie',
    'needs.puppy': 'Hondjie/katjie',
    'needs.carsick': 'Word karsiek',

    // Stops
    'stops.farm': 'Plaasstalletjies',
    'stops.park': 'Hondeparke & Staproetes',
    'stops.stay': 'Troeteldier-vriendelike Verblyf',
    'stops.vet': 'Noodveeartse',
    'stops.rest': 'Russtopplekke',
    'stops.restaurant': 'Troeteldier-vriendelike Eetplekke',
    'stops.navigate': 'Navigeer',
    'stops.call': 'Bel',
    'stops.petPolicy': 'Troeteldierbeleid',
    'stops.afterHours': 'Na-ure',
    'stops.directions': 'Kry aanwysings',
    'stops.verified': 'Geverifieer',
    'stops.stale': 'Benodig verifikasie',
    'stops.unverified': 'Nog nie geverifieer nie',
    'stops.confirmInfo': 'Bevestig inligting is op datum',
    'stops.reportIssue': 'Rapporteer \'n probleem',

    // Stop categories filter
    'filter.all': 'Alle stopplekke',
    'filter.farm': 'Plaasstalletjies',
    'filter.park': 'Parke & Staproetes',
    'filter.stay': 'Verblyf',
    'filter.vet': 'Veeartse',
    'filter.rest': 'Russtopplekke',
    'filter.restaurant': 'Restaurante',

    // Modals — general
    'modal.close': 'Sluit',
    'modal.save': 'Stoor',
    'modal.cancel': 'Kanselleer',
    'modal.back': 'Terug',
    'modal.next': 'Volgende',
    'modal.submit': 'Dien in',
    'modal.done': 'Klaar',
    'modal.share': 'Deel',
    'modal.download': 'Laai af',
    'modal.delete': 'Verwyder',

    // Trip Timeline
    'timeline.title': 'Reis Tydlyn',
    'timeline.empty': 'Kies \'n roete om jou reis tydlyn te sien',

    // Trip Cost Calculator
    'cost.title': 'Reiskoste Berekener',
    'cost.fuel': 'Brandstof (tolvrye roete)',
    'cost.tolls': 'Tolkoste',
    'cost.petFees': 'Troeteldier-fooie by verblyf',
    'cost.food': 'Kosstop-begroting',
    'cost.total': 'Totale Beraamde Koste (Tolvry)',
    'cost.vsToll': 'vs Tolroete',
    'cost.save': 'Bespaar',

    // Vet SOS
    'vet.title': 'Veearts Nood',
    'vet.nearest': 'Naaste noodveeartse',
    'vet.callNow': 'Bel nou',

    // Weather
    'weather.title': 'Roete Weer',
    'weather.today': 'Vandag',

    // Share
    'share.title': 'Deel Jou Reis',
    'share.copy': 'Kopieer skakel',
    'share.copied': 'Gekopieer!',

    // Achievements
    'achievements.title': 'Prestasies',
    'achievements.locked': 'Gesluit',
    'achievements.unlocked': 'Ontsluit',

    // Passport & stamps
    'passport.title': 'Troeteldier Paspoort',
    'stamps.title': 'Paspoort Stempels',

    // Postcard
    'postcard.title': 'Skep Poskaart',
    'postcard.generate': 'Genereer',

    // Travel stats
    'stats.title': 'Reisstatistieke',
    'stats.routesCompleted': 'Roetes voltooi',
    'stats.stopsVisited': 'Stopplekke besoek',
    'stats.totalDistance': 'Totale afstand',

    // List venue CTA
    'venue.cta': 'Lys jou plek',
    'venue.ctaSub': 'Is jou besigheid troeteldier-vriendelik? Word gelys!',
    'venue.title': 'Lys Jou Plek',
    'venue.basics': 'Plek Basiese',
    'venue.petPolicy': 'Troeteldierbeleid',
    'venue.contact': 'Kontak & Verifieer',
    'venue.review': 'Hersien & Dien In',

    // Pack list
    'packList.title': 'Paklys',
    'packList.essential': 'Noodsaaklik',
    'packList.optional': 'Lekker om te he',

    // Policies
    'policies.title': 'Troeteldier Reisbeleide',

    // Reviews
    'reviews.title': 'Resensies',
    'reviews.addReview': 'Voeg \'n resensie by',
    'reviews.noReviews': 'Nog geen resensies nie',
    'reviews.writeReview': 'Skryf jou resensie',
    'reviews.yourRating': 'Jou gradering',

    // Analytics
    'analytics.title': 'Ontledings',
    'analytics.engagement': 'Betrokkenheid',
    'analytics.routePopularity': 'Roete Gewildheid',
    'analytics.topStops': 'Top Stopplekke',
    'analytics.freshness': 'Stopplek Varsheid',
    'analytics.recentActivity': 'Onlangse Aktiwiteit',
    'analytics.last7': 'Laaste 7 dae',
    'analytics.last30': 'Laaste 30 dae',
    'analytics.allTime': 'Alle tye',

    // Wishlist
    'wishlist.title': 'Roete Wenslys',
    'wishlist.add': 'Voeg by wenslys',
    'wishlist.remove': 'Verwyder van wenslys',

    // Common
    'common.close': 'Sluit',
    'common.save': 'Stoor',
    'common.cancel': 'Kanselleer',
    'common.share': 'Deel',
    'common.loading': 'Laai...',
    'common.error': 'Iets het skeefgeloop',
    'common.retry': 'Probeer weer',
    'common.km': 'km',
    'common.yes': 'Ja',
    'common.no': 'Nee',
    'common.and': 'en',
    'common.or': 'of',

    // Offline
    'offline.title': 'Laai Af vir Vanlyn',
    'offline.ready': 'Gereed vir vanlyn gebruik',

    // Countdown
    'countdown.title': 'Reis Aftelling',
    'countdown.days': 'dae',
    'countdown.until': 'tot jou reis',

    // Wrapped
    'wrapped.title': 'Jou Jaar in PawRoutes',

    // Night driving
    'night.toggle': 'Nagry-modus',

    // Alerts
    'alerts.title': 'Reiswaarskuwings',
    'alerts.seasonal': 'Seisoenale waarskuwings',
  },
}

// ── Context & Provider ────────────────────────────────────────────

export const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
})

export function useLanguage() {
  return useContext(LanguageContext)
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(LS_KEY) || 'en' }
    catch { return 'en' }
  })

  const setLang = useCallback((newLang) => {
    setLangState(newLang)
    try { localStorage.setItem(LS_KEY, newLang) } catch {}
  }, [])

  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations.en?.[key] || key
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// ── Toggle component ──────────────────────────────────────────────

export function LanguageToggle({ dark }) {
  const { lang, setLang } = useLanguage()

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'af' : 'en')}
      title={lang === 'en' ? 'Skakel na Afrikaans' : 'Switch to English'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 10px',
        fontSize: 12, fontWeight: 700, letterSpacing: '0.05em',
        borderRadius: 'var(--radius-full)',
        border: `1px solid ${dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.12)'}`,
        background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
        color: dark ? '#E8DFD4' : '#2C2418',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <span style={{ opacity: lang === 'en' ? 1 : 0.4 }}>EN</span>
      <span style={{ opacity: 0.3 }}>/</span>
      <span style={{ opacity: lang === 'af' ? 1 : 0.4 }}>AF</span>
    </button>
  )
}
