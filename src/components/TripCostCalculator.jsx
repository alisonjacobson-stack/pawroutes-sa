import React from 'react'

const R = (n) => 'R' + Math.round(n).toLocaleString('en-ZA')

export default function TripCostCalculator({ route, stops = [], pets = [], dark, open, onClose }) {
  if (!open) return null

  const petCount = Math.max(pets.length, 1)
  const personCount = 2 // default assumption

  // --- Fuel ---
  const freeDistance = route?.freeRoute?.distance || 0
  const litresPer100 = 9
  const pricePerLitre = 24
  const fuelCost = (freeDistance / 100) * litresPer100 * pricePerLitre

  // --- Tolls ---
  const tollCost = route?.tollRoute?.tollCost || 0

  // --- Pet-friendly stays ---
  const routeStays = route
    ? stops.filter(s =>
        s.category === 'stay' &&
        (s.routeId === route.id || s.alsoOnRoute?.includes(route.id))
      )
    : []
  const staysWithPrice = routeStays.filter(s => s.price)
  const petFeePerStay = 200 // avg R150-R250
  const totalPetStayFees = staysWithPrice.length * petFeePerStay * petCount

  // --- Food ---
  const mealStops = 2
  const foodPerPerson = 150
  const foodPerPet = 50
  const foodTotal = (foodPerPerson * personCount + foodPerPet * petCount) * mealStops

  // --- Totals ---
  const totalFreeRoute = fuelCost + totalPetStayFees + foodTotal
  const tollFuel = route?.tollRoute?.distance
    ? (route.tollRoute.distance / 100) * litresPer100 * pricePerLitre
    : fuelCost
  const totalTollRoute = tollFuel + tollCost + totalPetStayFees + foodTotal
  const savings = totalTollRoute - totalFreeRoute

  const cardStyle = {
    padding: 16, marginBottom: 12,
    background: dark ? 'var(--card-dark)' : '#FFF',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
    boxShadow: '0 2px 8px var(--shadow)',
  }

  const labelStyle = {
    fontSize: 13,
    color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
    marginBottom: 4,
  }

  const amountStyle = {
    fontSize: 22, fontWeight: 800,
    fontFamily: 'var(--font-display)',
  }

  const subStyle = {
    fontSize: 12,
    color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
    marginTop: 2,
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
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
                🧮 Trip Cost Calculator
              </h2>
              {route && (
                <div style={{
                  fontSize: 13, marginTop: 4,
                  color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
                }}>
                  {route.name} &bull; {freeDistance}km toll-free route
                </div>
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

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
          {!route ? (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
              <p style={{ fontSize: 14, lineHeight: 1.5 }}>
                Select a route first to calculate trip costs.
              </p>
            </div>
          ) : (
            <>
              {/* Fuel */}
              <div style={cardStyle}>
                <div style={labelStyle}>⛽ Fuel (toll-free route)</div>
                <div style={{ ...amountStyle, color: 'var(--bark)' }}>{R(fuelCost)}</div>
                <div style={subStyle}>
                  {freeDistance}km at {litresPer100}L/100km @ {R(pricePerLitre)}/litre
                </div>
              </div>

              {/* Toll savings */}
              <div style={cardStyle}>
                <div style={labelStyle}>🛣️ Toll costs</div>
                <div style={{ ...amountStyle, color: 'var(--forest)' }}>
                  R0 — you're going toll-free! 🎉
                </div>
                <div style={subStyle}>
                  Toll route would cost {R(tollCost)} in tolls
                </div>
              </div>

              {/* Pet stays */}
              <div style={cardStyle}>
                <div style={labelStyle}>🏨 Pet fees at stays</div>
                <div style={{ ...amountStyle, color: 'var(--bark)' }}>
                  {totalPetStayFees > 0 ? R(totalPetStayFees) : 'R0'}
                </div>
                <div style={subStyle}>
                  {staysWithPrice.length > 0
                    ? `~${R(petFeePerStay)} per pet x ${petCount} pet${petCount > 1 ? 's' : ''} x ${staysWithPrice.length} stay${staysWithPrice.length > 1 ? 's' : ''}`
                    : 'No paid stays on this route'
                  }
                </div>
                {staysWithPrice.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {staysWithPrice.map(s => (
                      <div key={s.id} style={{
                        fontSize: 12, padding: '4px 0',
                        color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
                        borderTop: `1px solid ${dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.04)'}`,
                      }}>
                        {s.name} &bull; {s.price}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Food */}
              <div style={cardStyle}>
                <div style={labelStyle}>🍽️ Food stops budget</div>
                <div style={{ ...amountStyle, color: 'var(--bark)' }}>{R(foodTotal)}</div>
                <div style={subStyle}>
                  {R(foodPerPerson)} x {personCount} people + {R(foodPerPet)} x {petCount} pet{petCount > 1 ? 's' : ''} for {mealStops} meal stops
                </div>
              </div>

              {/* Per-pet breakdown (multi-pet) */}
              {petCount > 1 && (
                <div style={{
                  ...cardStyle,
                  background: dark ? 'rgba(196,129,59,0.1)' : 'rgba(196,129,59,0.06)',
                  border: '1px solid rgba(196,129,59,0.2)',
                }}>
                  <div style={{ ...labelStyle, fontWeight: 600, color: 'var(--ochre)' }}>
                    🐾 Per-pet breakdown
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {pets.map(pet => {
                      const petStay = staysWithPrice.length * petFeePerStay
                      const petFood = foodPerPet * mealStops
                      const petTotal = petStay + petFood
                      return (
                        <div key={pet.name} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '6px 0',
                          borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.04)'}`,
                          fontSize: 14,
                        }}>
                          <span>{pet.name} ({pet.type || pet.breed || 'pet'})</span>
                          <span style={{ fontWeight: 700 }}>{R(petTotal)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Total */}
              <div style={{
                ...cardStyle,
                background: dark ? 'rgba(74,124,89,0.15)' : 'rgba(74,124,89,0.08)',
                border: '2px solid var(--forest)',
              }}>
                <div style={{ ...labelStyle, fontWeight: 700, color: 'var(--forest)' }}>
                  Total Estimated Cost (Toll-Free)
                </div>
                <div style={{ ...amountStyle, fontSize: 28, color: 'var(--forest)' }}>
                  {R(totalFreeRoute)}
                </div>
              </div>

              {/* Toll route comparison */}
              <div style={{
                ...cardStyle,
                background: dark ? 'rgba(196,91,91,0.1)' : 'rgba(196,91,91,0.06)',
                border: `1px dashed ${dark ? 'rgba(196,91,91,0.4)' : 'rgba(196,91,91,0.3)'}`,
              }}>
                <div style={{ ...labelStyle, fontWeight: 600 }}>
                  vs Toll Route
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 4,
                }}>
                  <div>
                    <div style={{ fontSize: 14, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)' }}>
                      Toll route total
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#C45B5B' }}>
                      {R(totalTollRoute)}
                    </div>
                    <div style={subStyle}>
                      {route.tollRoute?.distance}km + {R(tollCost)} tolls
                    </div>
                  </div>
                  <div style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-md)',
                    background: 'var(--forest)', color: '#FFF',
                    fontWeight: 800, fontSize: 16,
                    fontFamily: 'var(--font-display)',
                  }}>
                    Save {R(savings)}
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div style={{
                fontSize: 11, textAlign: 'center', marginTop: 8,
                color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
                lineHeight: 1.5,
              }}>
                Estimates based on {litresPer100}L/100km, {R(pricePerLitre)}/L fuel, ~{R(petFeePerStay)} pet fee/stay.
                Actual costs may vary.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
