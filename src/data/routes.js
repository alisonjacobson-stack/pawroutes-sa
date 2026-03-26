// Real South African routes with toll vs toll-free alternatives
// Coordinates are [lat, lng] for Leaflet

export const CITIES = {
  jhb: { name: 'Johannesburg', coords: [-26.2041, 28.0473] },
  cpt: { name: 'Cape Town', coords: [-33.9249, 18.4241] },
  dbn: { name: 'Durban', coords: [-29.8587, 31.0218] },
  nel: { name: 'Nelspruit', coords: [-25.4753, 30.9694] },
  pta: { name: 'Pretoria', coords: [-25.7479, 28.2293] },
  blm: { name: 'Bloemfontein', coords: [-29.0852, 26.1596] },
  plk: { name: 'Polokwane', coords: [-23.9045, 29.4689] },
  knysna: { name: 'Knysna', coords: [-34.0356, 23.0488] },
  plett: { name: 'Plettenberg Bay', coords: [-34.0523, 23.3716] },
  mossel: { name: 'Mossel Bay', coords: [-34.1833, 22.1455] },
}

export const ROUTES = [
  {
    id: 'jhb-cpt',
    name: 'Joburg → Cape Town',
    from: 'jhb',
    to: 'cpt',
    pawScore: 4,
    tollRoute: {
      road: 'N1 South',
      distance: 1398,
      time: '14h 30m',
      tollCost: 580,
      waypoints: [
        [-26.2041, 28.0473],
        [-26.6849, 27.7742], // Vanderbijlpark
        [-27.6504, 27.2351], // Kroonstad
        [-29.0852, 26.1596], // Bloemfontein
        [-30.7167, 26.0833], // Trompsburg
        [-31.8833, 25.0167], // Graaff-Reinet area
        [-32.3500, 24.5333], // Cradock area
        [-33.0333, 22.4500], // Oudtshoorn area
        [-33.9249, 18.4241], // Cape Town
      ],
    },
    freeRoute: {
      road: 'R59 → N12 → R48 → R63 → N9 → N12',
      distance: 1520,
      time: '16h 45m',
      tollCost: 0,
      waypoints: [
        [-26.2041, 28.0473],
        [-26.9000, 27.4500], // Parys
        [-27.6504, 27.2351], // Kroonstad
        [-28.7667, 26.6667], // Winburg
        [-29.0852, 26.1596], // Bloemfontein
        [-30.2333, 25.5833], // Hanover
        [-31.2167, 24.5333], // Middelburg
        [-32.2500, 24.5333], // Graaff-Reinet
        [-33.3833, 22.0167], // Oudtshoorn
        [-33.9500, 20.8667], // Worcester area
        [-33.9249, 18.4241], // Cape Town
      ],
      description: 'The scenic Karoo route — flat, quiet roads through small towns with amazing farm stalls and wide-open spaces. Perfect for dogs who love sticking their heads out the window.',
    },
  },
  {
    id: 'jhb-dbn',
    name: 'Joburg → Durban',
    from: 'jhb',
    to: 'dbn',
    pawScore: 3,
    tollRoute: {
      road: 'N3 South',
      distance: 568,
      time: '5h 45m',
      tollCost: 320,
      waypoints: [
        [-26.2041, 28.0473],
        [-26.5597, 28.3003], // Heidelberg
        [-27.1833, 28.8833], // Standerton
        [-27.6000, 29.1333], // Volksrust
        [-28.5333, 29.5167], // Harrismith
        [-29.3667, 29.8833], // Estcourt
        [-29.6000, 30.3833], // Pietermaritzburg
        [-29.8587, 31.0218], // Durban
      ],
    },
    freeRoute: {
      road: 'R103 → R74 → R103 → R33',
      distance: 630,
      time: '7h 15m',
      tollCost: 0,
      waypoints: [
        [-26.2041, 28.0473],
        [-26.5597, 28.3003], // Heidelberg
        [-27.1500, 28.8500], // Standerton
        [-27.6000, 29.1333], // Volksrust
        [-28.2833, 29.1000], // Van Reenen area
        [-28.5333, 29.5167], // Harrismith
        [-29.0500, 29.8667], // Winterton/Bergville
        [-29.3667, 29.8833], // Estcourt
        [-29.6000, 30.3833], // Pietermaritzburg
        [-29.8587, 31.0218], // Durban
      ],
      description: 'The old main road through the Midlands — rolling green hills, Midlands Meander stops, and the spectacular Van Reenen Pass. More winding but dog-friendly stops everywhere.',
    },
  },
  {
    id: 'jhb-kruger',
    name: 'Joburg → Kruger (Nelspruit)',
    from: 'jhb',
    to: 'nel',
    pawScore: 5,
    tollRoute: {
      road: 'N4 East (Maputo Corridor)',
      distance: 330,
      time: '3h 30m',
      tollCost: 230,
      waypoints: [
        [-26.2041, 28.0473],
        [-25.9500, 28.8000], // eMalahleni/Witbank
        [-25.7833, 29.4500], // Middelburg
        [-25.6500, 30.1500], // Belfast
        [-25.4753, 30.9694], // Nelspruit
      ],
    },
    freeRoute: {
      road: 'R104 → R540 → R539 → R37',
      distance: 385,
      time: '5h 00m',
      tollCost: 0,
      waypoints: [
        [-26.2041, 28.0473],
        [-25.9500, 28.8000], // eMalahleni
        [-25.6500, 29.4333], // Middelburg
        [-25.6833, 30.0500], // Belfast
        [-25.4333, 30.1000], // Dullstroom
        [-25.0833, 30.7500], // Sabie
        [-25.4753, 30.9694], // Nelspruit
      ],
      description: 'The Panorama Route — Dullstroom for trout and coffee, Long Tom Pass, Sabie waterfalls, God\'s Window. The most scenic drive in SA and incredibly dog-friendly with all the outdoor stops.',
    },
  },
  {
    id: 'cpt-garden',
    name: 'Cape Town → Garden Route',
    from: 'cpt',
    to: 'plett',
    pawScore: 5,
    tollRoute: {
      road: 'N2 East',
      distance: 530,
      time: '6h 00m',
      tollCost: 85,
      waypoints: [
        [-33.9249, 18.4241],
        [-34.0833, 18.8500], // Somerset West
        [-34.2000, 19.8333], // Swellendam
        [-34.1833, 22.1455], // Mossel Bay
        [-33.9667, 22.4500], // George
        [-34.0333, 22.8000], // Wilderness
        [-34.0356, 23.0488], // Knysna
        [-34.0523, 23.3716], // Plettenberg Bay
      ],
    },
    freeRoute: {
      road: 'N2 (mostly toll-free) via R62 inland option',
      distance: 580,
      time: '7h 00m',
      tollCost: 0,
      waypoints: [
        [-33.9249, 18.4241],
        [-33.7167, 19.0333], // Paarl/Franschhoek area
        [-33.7167, 19.4500], // Robertson
        [-33.5833, 19.9000], // Montagu
        [-33.6167, 20.4167], // Barrydale
        [-33.5333, 21.5500], // Calitzdorp
        [-33.5833, 22.2000], // Oudtshoorn
        [-33.9667, 22.4500], // George
        [-34.0356, 23.0488], // Knysna
        [-34.0523, 23.3716], // Plettenberg Bay
      ],
      description: 'The Route 62 alternative — wine farms, hot springs at Montagu, ostrich farms at Oudtshoorn, then drop down to the coast. Dogs love the wide-open Karoo section.',
    },
  },
  {
    id: 'jhb-blm',
    name: 'Joburg → Bloemfontein',
    from: 'jhb',
    to: 'blm',
    pawScore: 3,
    tollRoute: {
      road: 'N1 South',
      distance: 400,
      time: '4h 00m',
      tollCost: 185,
      waypoints: [
        [-26.2041, 28.0473],
        [-26.6849, 27.7742], // Vanderbijlpark/Vereeniging
        [-27.6504, 27.2351], // Kroonstad
        [-29.0852, 26.1596], // Bloemfontein
      ],
    },
    freeRoute: {
      road: 'R59 → R34 → N8',
      distance: 445,
      time: '5h 00m',
      tollCost: 0,
      waypoints: [
        [-26.2041, 28.0473],
        [-26.6700, 27.9333], // Vereeniging
        [-26.9000, 27.4500], // Parys
        [-27.6504, 27.2351], // Kroonstad
        [-28.1333, 26.8167], // Winburg
        [-29.0852, 26.1596], // Bloemfontein
      ],
      description: 'Through Parys on the Vaal River — one of SA\'s best small-town stops with dog-friendly restaurants, river walks, and antique shops. Then straight Freestate farmland to Bloem.',
    },
  },
  {
    id: 'pta-plk',
    name: 'Pretoria → Polokwane',
    from: 'pta',
    to: 'plk',
    pawScore: 4,
    tollRoute: {
      road: 'N1 North',
      distance: 290,
      time: '2h 45m',
      tollCost: 120,
      waypoints: [
        [-25.7479, 28.2293],
        [-25.1000, 28.3167], // Bela-Bela (Warmbaths)
        [-24.5000, 28.7667], // Mokopane (Potgietersrus)
        [-23.9045, 29.4689], // Polokwane
      ],
    },
    freeRoute: {
      road: 'R101 → R518 → R101',
      distance: 310,
      time: '3h 30m',
      tollCost: 0,
      waypoints: [
        [-25.7479, 28.2293],
        [-25.1000, 28.3167], // Bela-Bela
        [-24.8833, 28.3000], // Modimolle (Nylstroom)
        [-24.5000, 28.7667], // Mokopane
        [-23.9045, 29.4689], // Polokwane
      ],
      description: 'The old N1 — now R101 — through Bela-Bela hot springs (great dog walk area), Modimolle, and Mokopane. Bush country with game farm stays that welcome dogs.',
    },
  },
]
