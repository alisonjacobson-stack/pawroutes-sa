import React, { useState } from 'react'

const SEASONS = [
  {
    id: 'summer',
    icon: '\u2600\ufe0f',
    title: 'Summer Road Trips',
    months: 'Nov \u2013 Feb',
    bestMonth: 'December',
    color: '#D4783C',
    gradient: 'linear-gradient(135deg, #D4783C 0%, #E8A85C 100%)',
    intro: 'Long days, warm beaches, and happy tails. Summer is peak road trip season \u2014 but the heat demands extra care.',
    bestRoutes: [
      { name: 'Garden Route', why: 'Beaches, forest walks, and dog-friendly towns from Mossel Bay to Storms River' },
      { name: 'Durban Coast (N3)', why: 'Warm Indian Ocean, pet-friendly beachfront accommodation in Ballito and Umhlanga' },
      { name: 'West Coast', why: 'Quieter beaches, Langebaan lagoon \u2014 shallow and safe for dogs' },
    ],
    packingExtras: [
      'Collapsible water bowl + extra 5L water',
      'Cooling mat or wet bandana',
      'Dog-safe sunscreen (nose and ears)',
      'Paw wax for hot surfaces',
      'Tick and flea treatment (peak season)',
      'Shade cloth for the car windscreen',
    ],
    hazards: [
      'Ticks at peak activity \u2014 check after every stop',
      'Hot tar burns paws \u2014 walk before 9am or after 5pm',
      'Never leave pets in parked cars, even for 5 minutes',
      'Blue-green algae in stagnant dams \u2014 don\u2019t let dogs drink',
    ],
    funFact: 'Dogs cool down primarily through panting and their paw pads. Wetting their paws is the fastest way to cool them down \u2014 faster than wetting their back.',
  },
  {
    id: 'autumn',
    icon: '\ud83c\udf42',
    title: 'Autumn Adventures',
    months: 'Mar \u2013 May',
    bestMonth: 'April',
    color: '#B8762D',
    gradient: 'linear-gradient(135deg, #B8762D 0%, #D4A843 100%)',
    intro: 'Golden light, mild temperatures, and fewer crowds. The sweet spot for pet travel in South Africa.',
    bestRoutes: [
      { name: 'Garden Route', why: 'Whale season starts in June \u2014 catch the early arrivals in Hermanus. Mild and gorgeous.' },
      { name: 'KZN Midlands', why: 'Cool, misty mornings. Perfect hiking weather. Dog-friendly craft beer stops.' },
      { name: 'Panorama Route', why: 'Cooler Lowveld temps, stunning autumn colours at God\u2019s Window and Blyde River Canyon' },
    ],
    packingExtras: [
      'Light fleece or jersey for evening walks',
      'Reflective collar or light (earlier sunsets)',
      'Towel for misty morning walks',
      'Tick prevention (still active)',
    ],
    hazards: [
      'Early frost at altitude (Drakensberg, Sani Pass) \u2014 not all dogs handle cold well',
      'Shorter days mean more driving in the dark \u2014 watch for animals on rural roads',
      'Harvesting season: farm vehicles on gravel roads',
    ],
    funFact: 'A dog\u2019s nose has up to 300 million olfactory receptors. In the cool, damp autumn air, scent molecules travel better \u2014 making autumn hikes the ultimate sniff-venture.',
  },
  {
    id: 'winter',
    icon: '\u2744\ufe0f',
    title: 'Winter Escapes',
    months: 'Jun \u2013 Aug',
    bestMonth: 'July',
    color: '#5B7C9E',
    gradient: 'linear-gradient(135deg, #5B7C9E 0%, #7BA3C4 100%)',
    intro: 'Dry season game drives, warm KZN beaches, and the best stargazing of the year. Winter travel has a special magic.',
    bestRoutes: [
      { name: 'Kruger (Phalaborwa Gate)', why: 'Dry season = thin bush = best game viewing. Dogs can\u2019t enter the park, but pet-friendly lodges surround it.' },
      { name: 'Durban & South Coast', why: 'While Cape Town shivers, KZN stays warm. Dog-friendly beaches year-round.' },
      { name: 'Route 62', why: 'Quirky towns, warm Klein Karoo days, and zero crowds. Oudtshoorn to Montagu.' },
    ],
    packingExtras: [
      'Dog jacket or jersey (especially for short-haired breeds)',
      'Extra blankets for cold Karoo nights',
      'Hot water bottle for the car crate',
      'Paw balm for dry, cracked pads',
      'Reflective gear (long dark evenings)',
    ],
    hazards: [
      'Black ice on mountain passes (Sani, Bain\u2019s Kloof, Du Toitskloof) \u2014 drive slowly',
      'Hypothermia risk for small/thin-coated dogs in Karoo and Highveld',
      'Snow on the Drakensberg passes \u2014 check conditions before departing',
      'Shorter days: plan stops to arrive before dark',
    ],
    funFact: 'A dog\u2019s nose works 40% better in cool air \u2014 winter hikes are sniff paradise. Cold air holds scent molecules closer to the ground, making every bush a novel.',
  },
  {
    id: 'spring',
    icon: '\ud83c\udf38',
    title: 'Spring Wildflowers',
    months: 'Sep \u2013 Oct',
    bestMonth: 'September',
    color: '#7B5EA7',
    gradient: 'linear-gradient(135deg, #7B5EA7 0%, #A88BC7 100%)',
    intro: 'Namaqualand carpets, newborn lambs, and perfect mild weather. Spring is nature\u2019s reward for surviving winter.',
    bestRoutes: [
      { name: 'JHB to CPT (Namaqualand detour)', why: 'The N7 via Clanwilliam to Springbok for the wildflower season. Once-a-year spectacle.' },
      { name: 'West Coast', why: 'Postberg flower reserve, Langebaan \u2014 flower fields meeting the ocean' },
      { name: 'Cederberg', why: 'Mild weather, blooming fynbos, and rock formations. Dog-friendly campsites.' },
    ],
    packingExtras: [
      'Antihistamine (consult vet) \u2014 pollen season for pets too',
      'Camera/phone mount for flower road stops',
      'Light rain jacket for pet (spring showers)',
      'Tick treatment (they\u2019re back with the warmth)',
    ],
    hazards: [
      'Spring rains turn dirt roads to mud \u2014 check road conditions for gravel routes',
      'Newborn livestock: keep dogs on-lead near farms',
      'Snakes becoming active again as temperatures rise',
      'Pollen allergies in dogs: watch for excessive scratching, red eyes',
    ],
    funFact: 'Namaqualand\u2019s flowers only open when the sun shines \u2014 overcast days mean closed petals. Plan your drive for sunny mornings between 10am and 3pm for the full show.',
  },
]

export default function SeasonalGuides({ dark, open, onClose, routes = [] }) {
  const [expanded, setExpanded] = useState(null)

  if (!open) return null

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  const shareToWhatsApp = (season) => {
    const text = `\ud83d\udc3e PawRoutes SA \u2014 ${season.icon} ${season.title} (${season.months})\n\n` +
      `${season.intro}\n\n` +
      `Best routes:\n${season.bestRoutes.map(r => `\u2022 ${r.name}: ${r.why}`).join('\n')}\n\n` +
      `Pack extra: ${season.packingExtras.slice(0, 3).join(', ')}\n\n` +
      `\ud83d\udca1 ${season.funFact}\n\n` +
      `Plan your pet-friendly road trip at pawroutes.co.za`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%', maxWidth: 520, maxHeight: '85vh',
          background: dark ? 'var(--bg-dark)' : 'var(--cream)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInUp 0.3s var(--ease-out)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{
              fontSize: 22, fontWeight: 800, margin: 0,
              fontFamily: 'var(--font-display)',
            }}>
              \ud83d\uddfa\ufe0f Seasonal Guides
            </h2>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 'var(--radius-full)',
              background: dark ? 'var(--card-dark)' : 'var(--sand)',
              border: 'none', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'inherit',
            }}>\u2715</button>
          </div>
          <p style={{
            fontSize: 14, margin: 0, lineHeight: 1.5,
            color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
          }}>
            The best pet-friendly routes for every season in South Africa
          </p>
        </div>

        {/* Season cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
          {SEASONS.map(season => {
            const isOpen = expanded === season.id
            return (
              <div key={season.id} style={{
                marginBottom: 16,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: `1px solid ${isOpen ? season.color + '50' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
                background: dark ? 'var(--card-dark)' : '#FFF',
                boxShadow: isOpen ? `0 6px 20px ${season.color}20` : '0 2px 8px var(--shadow)',
                transition: 'all 0.2s',
              }}>
                {/* Season header — clickable banner */}
                <button
                  onClick={() => toggle(season.id)}
                  style={{
                    width: '100%', padding: 0,
                    background: 'transparent', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                    color: 'inherit', fontFamily: 'inherit',
                  }}
                >
                  <div style={{
                    padding: '16px 18px',
                    background: season.gradient,
                    color: '#FFF',
                    position: 'relative',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 28, lineHeight: 1 }}>{season.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 18, fontWeight: 800,
                          fontFamily: 'var(--font-display)',
                        }}>{season.title}</div>
                        <div style={{ fontSize: 13, opacity: 0.9 }}>{season.months}</div>
                      </div>
                      <span style={{
                        fontSize: 13,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}>\u25bc</span>
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '3px 10px', marginTop: 6,
                      background: 'rgba(255,255,255,0.25)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 11, fontWeight: 700,
                    }}>
                      Best month: {season.bestMonth}
                    </div>
                  </div>
                  <div style={{
                    padding: '12px 18px',
                    fontSize: 13, lineHeight: 1.5,
                    color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
                  }}>
                    {season.intro}
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div style={{
                    padding: '0 18px 18px',
                    borderTop: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
                  }}>
                    {/* Recommended routes */}
                    <div style={{ marginTop: 14, marginBottom: 16 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 700, marginBottom: 10,
                        color: 'var(--forest)',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        \ud83d\udccd Recommended Routes
                      </div>
                      {season.bestRoutes.map((route, i) => {
                        // Try to match to an actual route in the app
                        const matchedRoute = routes.find(r =>
                          r.name.toLowerCase().includes(route.name.toLowerCase().split(' ')[0])
                        )
                        return (
                          <div key={i} style={{
                            padding: '10px 12px', marginBottom: 8,
                            borderRadius: 'var(--radius-sm)',
                            background: dark ? 'var(--bg-dark)' : 'var(--sand-light)',
                            border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
                          }}>
                            <div style={{
                              fontSize: 14, fontWeight: 700, marginBottom: 2,
                              display: 'flex', alignItems: 'center', gap: 6,
                            }}>
                              {route.name}
                              {matchedRoute && (
                                <span style={{
                                  fontSize: 10, fontWeight: 600, padding: '2px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  background: 'var(--terracotta)',
                                  color: '#FFF',
                                }}>
                                  View Route
                                </span>
                              )}
                            </div>
                            <div style={{
                              fontSize: 12, lineHeight: 1.4,
                              color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
                            }}>{route.why}</div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Packing extras */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 700, marginBottom: 8,
                        color: 'var(--terracotta)',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        \ud83c\udf92 Pack Extra This Season
                      </div>
                      <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: 6,
                      }}>
                        {season.packingExtras.map((item, i) => (
                          <span key={i} style={{
                            padding: '5px 12px', fontSize: 12,
                            borderRadius: 'var(--radius-full)',
                            background: dark ? 'var(--bg-dark)' : 'var(--sand-light)',
                            border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
                          }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hazards */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 700, marginBottom: 8,
                        color: '#C45B5B',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        \u26a0\ufe0f Watch Out For
                      </div>
                      {season.hazards.map((hazard, i) => (
                        <div key={i} style={{
                          fontSize: 12, lineHeight: 1.5, padding: '3px 0 3px 18px',
                          position: 'relative',
                          color: dark ? 'var(--text-secondary-dark)' : 'inherit',
                        }}>
                          <span style={{
                            position: 'absolute', left: 0, top: 3,
                            color: '#C45B5B', fontSize: 10, fontWeight: 700,
                          }}>\u2022</span>
                          {hazard}
                        </div>
                      ))}
                    </div>

                    {/* Fun fact */}
                    <div style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: dark ? 'rgba(74,124,89,0.15)' : 'rgba(74,124,89,0.08)',
                      border: '1px solid rgba(74,124,89,0.25)',
                      marginBottom: 14,
                    }}>
                      <div style={{
                        fontSize: 12, fontWeight: 700, marginBottom: 4,
                        color: 'var(--forest)',
                      }}>
                        \ud83d\udca1 Fun Fact
                      </div>
                      <div style={{
                        fontSize: 12, lineHeight: 1.5, fontStyle: 'italic',
                        color: dark ? 'var(--text-secondary-dark)' : 'inherit',
                      }}>{season.funFact}</div>
                    </div>

                    {/* Share button */}
                    <button
                      onClick={() => shareToWhatsApp(season)}
                      style={{
                        width: '100%', padding: '12px 16px',
                        background: '#25D366', color: '#FFF',
                        border: 'none', borderRadius: 'var(--radius-md)',
                        fontSize: 14, fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => e.target.style.opacity = '0.9'}
                      onMouseLeave={e => e.target.style.opacity = '1'}
                    >
                      <span style={{ fontSize: 18 }}>\ud83d\udce4</span> Share on WhatsApp
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
