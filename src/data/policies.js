// PawRoutes SA — Listing policies & reference data
// These policies govern venue submissions, reviews, and listing quality

export const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape',
]

export const POLICIES = [
  {
    id: 'pet-standards',
    title: 'Pet-Friendliness Standards',
    icon: '🐾',
    content: [
      'Pets must be genuinely welcome at listed venues — not merely tolerated in the parking lot. PawRoutes exists to connect travellers with places that actively embrace animals as part of the experience.',
      'At minimum, a venue must permit dogs OR cats in at least one designated area such as a garden, terrace, indoor space, or guest room. Venues that only allow pets in vehicles or crates do not qualify.',
      'Fresh drinking water must be accessible to animals on the premises during operating hours.',
      'Breed-specific restrictions are not permitted unless there is a documented safety reason — for example, a game reserve with free-roaming wild animals. Any restrictions must be clearly stated in the listing.',
      'Staff should be aware of and supportive of the venue\'s pet-friendly policy. A listing that says "dogs welcome" but where staff turn pets away does not meet our standards.',
      'Venues that go further earn a higher Paw Score on their listing. Enhanced features include: dedicated pet amenities (beds, bowls, treats), fenced or enclosed off-leash areas, a pet menu, and emergency vet contact information available on-site.',
    ],
  },
  {
    id: 'listing-requirements',
    title: 'Listing Requirements',
    icon: '📋',
    content: [
      'Every listing requires the following information: venue name, town, road or street, province, a contact phone number, and a description of the pet policy. Without these, the listing cannot be published.',
      'We strongly recommend also providing photos, a website URL, and a price indication (e.g. "R150/night pet fee" or "Free entry for pets"). Listings with photos and pricing receive significantly more engagement.',
      'The person submitting the listing must be the venue owner or an authorised representative. Submissions from third parties (e.g. a guest who visited) will be verified with the venue before publication.',
      'Only one listing per venue is permitted. If a duplicate submission is received, it will be merged with the existing listing, and the most up-to-date information retained.',
    ],
  },
  {
    id: 'accuracy',
    title: 'Accuracy & Honesty',
    icon: '✅',
    content: [
      'All information provided must be accurate at the time of submission. This includes pet policies, contact details, operating hours, and pricing.',
      'Venues must notify PawRoutes if their pet policy changes — for example, if a new owner takes over or if pets are no longer permitted in certain areas. Listings can be updated at any time by contacting us.',
      'Listings found to contain misleading information will be removed immediately, without prior notice. This includes venues that advertise as pet-friendly but routinely turn animals away.',
      'PawRoutes reserves the right to verify any listing via phone call, WhatsApp message, or in-person visit at any time.',
      'User reviews that contradict a venue\'s listed pet policy will trigger a re-verification process. If the venue cannot confirm its policy, the listing may be suspended or updated.',
    ],
  },
  {
    id: 'reviews',
    title: 'Review & Complaint Handling',
    icon: '⭐',
    content: [
      'Any traveller who has visited a listed venue may submit a review. Reviews help the PawRoutes community make informed decisions and help us maintain listing quality.',
      'Reviews containing hate speech, spam, advertising, or content unrelated to the pet-friendliness of the venue will be removed.',
      'If a venue receives 3 or more reports from different users stating that it is NOT pet-friendly as listed, the listing will be suspended pending re-verification by the PawRoutes team.',
      'Venue owners may respond to reviews or raise concerns by contacting PawRoutes directly. We aim to be fair to both travellers and venue owners.',
      'When submitting a complaint, please include: the date of your visit, a description of what happened, and what the listing stated at the time. Screenshots are helpful but not required.',
    ],
  },
  {
    id: 'removal',
    title: 'Removal Criteria',
    icon: '🚫',
    content: [
      'A listing will be removed from PawRoutes under any of the following circumstances:',
      'The venue owner confirms that pets are no longer welcome at the establishment.',
      'Three or more verified complaints are received from separate travellers reporting that their pets were turned away or treated poorly, despite the listing indicating otherwise.',
      'The venue owner or contact person is unreachable after 3 contact attempts (phone, email, or WhatsApp) over a 30-day period.',
      'The venue has permanently closed.',
      'The listing contains false or deliberately misleading information about pet policies, facilities, or pricing.',
      'There is evidence of animal cruelty or neglect at the venue. PawRoutes takes animal welfare seriously and will report such cases to the relevant SPCA or animal welfare authority.',
    ],
  },
]
