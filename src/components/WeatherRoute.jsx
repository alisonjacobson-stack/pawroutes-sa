import React, { useMemo } from 'react'

const REGION_WEATHER = {
  gauteng: {
    region: 'Gauteng',
    towns: ['Johannesburg', 'Pretoria', 'Midrand'],
    temp: [26, 30], humidity: [55, 75],
    conditions: ['Partly cloudy', 'Afternoon thunderstorms', 'Warm & humid'],
    wind: ['NE 12 km/h', 'NW 18 km/h', 'E 8 km/h'],
    icons: ['🌤️', '⛈️', '⛅'],
  },
  kzn: {
    region: 'KwaZulu-Natal',
    towns: ['Durban', 'Pietermaritzburg', 'Ballito'],
    temp: [28, 33], humidity: [70, 90],
    conditions: ['Humid & warm', 'Scattered showers', 'Hot & sticky'],
    wind: ['SE 15 km/h', 'NE 10 km/h', 'S 20 km/h'],
    icons: ['🌤️', '🌧️', '☀️'],
  },
  karoo: {
    region: 'Karoo',
    towns: ['Beaufort West', 'Three Sisters', 'Graaff-Reinet'],
    temp: [32, 38], humidity: [15, 30],
    conditions: ['Hot & dry', 'Clear skies', 'Scorching'],
    wind: ['W 22 km/h', 'NW 15 km/h', 'SW 18 km/h'],
    icons: ['☀️', '☀️', '☀️'],
  },
  'western-cape': {
    region: 'Western Cape',
    towns: ['Cape Town', 'Stellenbosch', 'Paarl'],
    temp: [24, 29], humidity: [40, 55],
    conditions: ['Warm & clear', 'Light breeze', 'Sunny'],
    wind: ['SE 25 km/h', 'S 18 km/h', 'SE 12 km/h'],
    icons: ['☀️', '🌤️', '☀️'],
  },
  lowveld: {
    region: 'Lowveld / Kruger',
    towns: ['Nelspruit', 'White River', 'Hazyview'],
    temp: [29, 34], humidity: [65, 85],
    conditions: ['Hot & humid', 'Afternoon thunderstorms', 'Muggy'],
    wind: ['NE 10 km/h', 'N 14 km/h', 'E 8 km/h'],
    icons: ['⛅', '⛈️', '🌤️'],
  },
  'garden-route': {
    region: 'Garden Route',
    towns: ['George', 'Knysna', 'Plettenberg Bay'],
    temp: [22, 27], humidity: [60, 75],
    conditions: ['Mild & pleasant', 'Patchy clouds', 'Warm'],
    wind: ['SW 16 km/h', 'W 12 km/h', 'S 10 km/h'],
    icons: ['🌤️', '⛅', '☀️'],
  },
  freestate: {
    region: 'Free State',
    towns: ['Bloemfontein', 'Welkom', 'Bethlehem'],
    temp: [27, 33], humidity: [30, 50],
    conditions: ['Warm & dry', 'Late afternoon storms', 'Clear'],
    wind: ['N 14 km/h', 'NE 20 km/h', 'W 10 km/h'],
    icons: ['☀️', '⛈️', '🌤️'],
  },
  'northern-cape': {
    region: 'Northern Cape',
    towns: ['Kimberley', 'Upington', 'Springbok'],
    temp: [33, 40], humidity: [10, 25],
    conditions: ['Extremely hot', 'Dry & clear', 'Hot'],
    wind: ['NW 18 km/h', 'W 25 km/h', 'N 12 km/h'],
    icons: ['☀️', '☀️', '☀️'],
  },
}

function pickWeather(regionKey, townIndex) {
  const r = REGION_WEATHER[regionKey]
  if (!r) return null
  const idx = townIndex % r.towns.length
  const temp = r.temp[0] + Math.round(Math.random() * (r.temp[1] - r.temp[0]))
  const humidity = r.humidity[0] + Math.round(Math.random() * (r.humidity[1] - r.humidity[0]))
  return {
    town: r.towns[idx],
    region: r.region,
    temp,
    humidity,
    condition: r.conditions[idx],
    wind: r.wind[idx],
    icon: r.icons[idx],
  }
}

function getRouteRegions(route) {
  if (!route) return ['gauteng', 'karoo', 'western-cape']
  const name = (route.name || '').toLowerCase()
  const from = (route.from || '').toLowerCase()
  const to = (route.to || '').toLowerCase()
  const combined = `${name} ${from} ${to}`

  const mapping = []
  if (combined.includes('jhb') || combined.includes('johannesburg') || combined.includes('gauteng') || combined.includes('pretoria'))
    mapping.push('gauteng')
  if (combined.includes('durban') || combined.includes('kzn') || combined.includes('pietermaritzburg'))
    mapping.push('kzn')
  if (combined.includes('karoo') || combined.includes('beaufort') || combined.includes('three sisters'))
    mapping.push('karoo')
  if (combined.includes('cape town') || combined.includes('cpt') || combined.includes('western cape') || combined.includes('stellenbosch'))
    mapping.push('western-cape')
  if (combined.includes('kruger') || combined.includes('nelspruit') || combined.includes('lowveld') || combined.includes('mpumalanga'))
    mapping.push('lowveld')
  if (combined.includes('garden route') || combined.includes('knysna') || combined.includes('george') || combined.includes('plett'))
    mapping.push('garden-route')
  if (combined.includes('bloemfontein') || combined.includes('free state'))
    mapping.push('freestate')
  if (combined.includes('kimberley') || combined.includes('northern cape') || combined.includes('upington'))
    mapping.push('northern-cape')

  return mapping.length >= 2 ? mapping : ['gauteng', 'karoo', 'western-cape']
}

function getPetTips(weatherCards) {
  const tips = []
  const maxTemp = Math.max(...weatherCards.map(w => w.temp))
  const hasStorm = weatherCards.some(w => w.condition.toLowerCase().includes('thunder') || w.condition.toLowerCase().includes('storm'))
  const highHumidity = weatherCards.some(w => w.humidity >= 70)

  if (maxTemp >= 33) {
    const hotTown = weatherCards.find(w => w.temp >= 33)
    tips.push(`🌡️ ${hotTown.temp}°C in ${hotTown.town} — never leave pets in the car, even with windows cracked`)
  }
  if (hasStorm) {
    tips.push('⛈️ Afternoon storms expected — anxious pets may need calming aids or a thunder shirt')
  }
  if (highHumidity) {
    const humidCard = weatherCards.find(w => w.humidity >= 70)
    tips.push(`💧 High humidity in ${humidCard.region} — pack extra water for all pets`)
  }
  if (maxTemp >= 28) {
    tips.push('🐾 Hot tar burns paws — test the road surface with your hand before walks')
  }
  if (tips.length === 0) {
    tips.push('✅ Mild conditions along this route — great day for travelling with pets!')
  }
  return tips
}

export default function WeatherRoute({ route, dark, open, onClose }) {
  if (!open) return null

  const weatherCards = useMemo(() => {
    const regions = getRouteRegions(route)
    return regions.map((r, i) => pickWeather(r, i)).filter(Boolean)
  }, [route])

  const tips = useMemo(() => getPetTips(weatherCards), [weatherCards])

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
          background: dark ? 'rgba(76,111,64,0.12)' : 'rgba(76,111,64,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>
                🌤️ Weather Along Route
              </h2>
              {route && (
                <p style={{
                  margin: '4px 0 0', fontSize: 13,
                  color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
                }}>
                  {route.name}
                </p>
              )}
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 'var(--radius-full)',
              background: dark ? 'var(--card-dark)' : 'var(--sand)',
              border: 'none', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'inherit',
            }}>✕</button>
          </div>
        </div>

        {/* Weather cards */}
        <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {weatherCards.map((w, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px',
                background: dark ? 'var(--card-dark)' : '#FFF',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
              }}>
                <div style={{ fontSize: 36, lineHeight: 1 }}>{w.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{w.town}</div>
                      <div style={{
                        fontSize: 11, textTransform: 'uppercase', fontWeight: 600,
                        letterSpacing: '0.05em', color: 'var(--forest)',
                      }}>
                        {w.region}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 24, fontWeight: 800, color: w.temp >= 33 ? 'var(--terracotta)' : 'var(--forest)',
                    }}>
                      {w.temp}°C
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', gap: 12, marginTop: 6, fontSize: 12,
                    color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
                  }}>
                    <span>{w.condition}</span>
                    <span>💧 {w.humidity}%</span>
                    <span>💨 {w.wind}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pet tips */}
          <div style={{
            marginTop: 16, padding: '14px 16px',
            background: dark ? 'rgba(196,152,59,0.12)' : 'rgba(196,152,59,0.08)',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${dark ? 'rgba(196,152,59,0.25)' : 'rgba(196,152,59,0.2)'}`,
          }}>
            <div style={{
              fontSize: 13, fontWeight: 700, marginBottom: 8,
              color: dark ? 'var(--ochre)' : 'var(--bark)',
            }}>
              Pet Weather Tips
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tips.map((tip, i) => (
                <div key={i} style={{
                  fontSize: 13, lineHeight: 1.5,
                  color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
                }}>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <p style={{
            fontSize: 11, textAlign: 'center', marginTop: 12,
            color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
          }}>
            Simulated weather based on typical March conditions in South Africa
          </p>
        </div>
      </div>
    </div>
  )
}
