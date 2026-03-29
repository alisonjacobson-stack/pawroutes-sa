/**
 * Venue Vetting Workflow
 *
 * Automated vetting pipeline for new venue submissions.
 * Since this is a frontend-only app, "automated" means:
 * 1. Client-side validation before submission
 * 2. Generate a verification token for the owner
 * 3. Send verification request via WhatsApp and email
 * 4. Track verification status in localStorage
 * 5. Flag unverified venues until owner confirms
 *
 * In a production backend, this would trigger server-side emails and webhooks.
 * For now, we use WhatsApp deeplinks and mailto: links as the "automation."
 */

const VETTING_KEY = 'pawroutes-venue-vetting'
const VERIFIED_KEY = 'pawroutes-venue-verified'

// Generate a simple verification code (6 chars)
function generateVerificationCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no O/0/1/I confusion
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

/**
 * Step 1: Pre-submission validation
 * Returns { valid: boolean, issues: string[] }
 */
export function validateVenueSubmission(data) {
  const issues = []

  // Required fields
  if (!data.venueName?.trim()) issues.push('Venue name is required')
  if (!data.category) issues.push('Category is required')
  if (!data.town?.trim()) issues.push('Town is required')
  if (!data.road?.trim()) issues.push('Road/street is required')
  if (!data.petPolicy?.trim()) issues.push('Pet policy description is required')
  if (!data.contactName?.trim()) issues.push('Contact name is required')
  if (!data.phone?.trim()) issues.push('Phone number is required')
  if (!data.email?.trim()) issues.push('Email is required')

  // Format checks
  if (data.phone && !/^[\d\s\+\-\(\)]{7,15}$/.test(data.phone.trim())) {
    issues.push('Phone number format looks invalid')
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    issues.push('Email format looks invalid')
  }

  // Spam detection
  if (data.venueName && /https?:\/\//i.test(data.venueName)) {
    issues.push('Venue name cannot contain URLs')
  }
  if (data.petPolicy && data.petPolicy.length < 20) {
    issues.push('Pet policy description is too short — please provide more detail')
  }

  // Duplicate detection
  const existing = getVettingQueue()
  const isDuplicate = existing.some(v =>
    v.venueName?.toLowerCase() === data.venueName?.toLowerCase() &&
    v.town?.toLowerCase() === data.town?.toLowerCase()
  )
  if (isDuplicate) {
    issues.push('A venue with this name in this town has already been submitted')
  }

  return { valid: issues.length === 0, issues }
}

/**
 * Step 2: Create a vetting record with verification code
 */
export function createVettingRecord(data) {
  const code = generateVerificationCode()
  const record = {
    ...data,
    id: `venue-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    verificationCode: code,
    status: 'pending', // pending → verified → approved | rejected
    submittedAt: new Date().toISOString(),
    verifiedAt: null,
    reviewedAt: null,
    flags: [],
  }

  // Auto-flag suspicious submissions
  if (data.petFee && parseInt(data.petFee) > 500) {
    record.flags.push('High pet fee — verify with owner')
  }
  if (data.dogsAllowed === 'No' && data.catsAllowed === 'No') {
    record.flags.push('Neither dogs nor cats allowed — may not be pet-friendly')
  }

  // Save to vetting queue
  const queue = getVettingQueue()
  queue.push(record)
  localStorage.setItem(VETTING_KEY, JSON.stringify(queue))

  return record
}

/**
 * Step 3: Generate WhatsApp verification message for the venue owner
 */
export function getWhatsAppVerificationLink(record) {
  const message = `Hi ${record.contactName}! 🐾

Your venue "${record.venueName}" has been submitted to PawRoutes SA — South Africa's pet-friendly travel guide.

To verify your listing, please reply with your verification code:

🔑 ${record.verificationCode}

This confirms you're the owner/manager and that your pet policy is accurate.

Questions? Visit pawroutes-sa.vercel.app

Thank you!
— PawRoutes Team`

  const phone = (record.whatsapp || record.phone).replace(/\D/g, '')
  const saPhone = phone.startsWith('0') ? '27' + phone.slice(1) : phone
  return `https://wa.me/${saPhone}?text=${encodeURIComponent(message)}`
}

/**
 * Step 4: Generate email verification message
 */
export function getEmailVerificationLink(record) {
  const subject = `Verify your PawRoutes SA listing — ${record.venueName}`
  const body = `Hi ${record.contactName},

Your venue "${record.venueName}" in ${record.town} has been submitted to PawRoutes SA.

To verify your listing, please reply to this email with your verification code:

🔑 ${record.verificationCode}

What we need to confirm:
✓ You are the owner/manager of this venue
✓ Your pet policy is accurate: "${record.petPolicy.slice(0, 100)}..."
✓ Your contact details are correct

Once verified, your venue will appear on PawRoutes for thousands of pet-traveling South Africans to discover!

Questions? Just reply to this email.

Regards,
PawRoutes SA Team
pawroutes-sa.vercel.app`

  return `mailto:${record.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/**
 * Step 5: Verify a venue with a code
 */
export function verifyVenue(venueId, code) {
  const queue = getVettingQueue()
  const venue = queue.find(v => v.id === venueId)
  if (!venue) return { success: false, error: 'Venue not found' }
  if (venue.verificationCode !== code.toUpperCase().trim()) {
    return { success: false, error: 'Invalid verification code' }
  }
  venue.status = 'verified'
  venue.verifiedAt = new Date().toISOString()
  localStorage.setItem(VETTING_KEY, JSON.stringify(queue))

  // Add to verified list
  const verified = getVerifiedVenues()
  verified.push(venueId)
  localStorage.setItem(VERIFIED_KEY, JSON.stringify(verified))

  return { success: true }
}

/**
 * Get all pending/verified/rejected venues
 */
export function getVettingQueue() {
  try { return JSON.parse(localStorage.getItem(VETTING_KEY) || '[]') } catch { return [] }
}

export function getVerifiedVenues() {
  try { return JSON.parse(localStorage.getItem(VERIFIED_KEY) || '[]') } catch { return [] }
}

export function getPendingVenues() {
  return getVettingQueue().filter(v => v.status === 'pending')
}

/**
 * Get vetting stats
 */
export function getVettingStats() {
  const queue = getVettingQueue()
  return {
    total: queue.length,
    pending: queue.filter(v => v.status === 'pending').length,
    verified: queue.filter(v => v.status === 'verified').length,
    rejected: queue.filter(v => v.status === 'rejected').length,
    flagged: queue.filter(v => v.flags.length > 0).length,
  }
}
