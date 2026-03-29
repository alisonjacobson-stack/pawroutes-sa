/**
 * Venue freshness/expiry system for PawRoutes SA.
 * Tracks when stops were last confirmed by users and flags stale data.
 * Pure utility module — no React dependencies.
 *
 * localStorage schema for `pawroutes-confirmations`:
 * {
 *   [stopId: string]: {
 *     lastConfirmed: string (ISO date),
 *     confirmCount: number
 *   }
 * }
 */

const STORAGE_KEY = 'pawroutes-confirmations';
const FRESH_DAYS = 90;
const STALE_DAYS = 180;
const MS_PER_DAY = 86_400_000;

/**
 * Read all confirmations from localStorage.
 * @returns {Record<string, { lastConfirmed: string, confirmCount: number }>}
 */
function readConfirmations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Calculate days between a date and now.
 * @param {string|Date} date
 * @returns {number}
 */
function daysSince(date) {
  const then = date instanceof Date ? date : new Date(date);
  if (isNaN(then.getTime())) return Infinity;
  return Math.floor((Date.now() - then.getTime()) / MS_PER_DAY);
}

/**
 * Get the freshness status of a stop based on its confirmation history.
 *
 * @param {string} stopId - Unique identifier for the stop/venue
 * @returns {{ status: 'fresh'|'stale'|'unverified', lastConfirmed: Date|null, confirmCount: number, daysSince: number }}
 *   - status: 'fresh' (<90 days), 'stale' (90-180 days), 'unverified' (>180 days or never)
 *   - lastConfirmed: Date of last confirmation, or null if never confirmed
 *   - confirmCount: total number of times this stop has been confirmed
 *   - daysSince: days since last confirmation (Infinity if never confirmed)
 */
export function getStopFreshness(stopId) {
  const confirmations = readConfirmations();
  const entry = confirmations[stopId];

  if (!entry || !entry.lastConfirmed) {
    return {
      status: 'unverified',
      lastConfirmed: null,
      confirmCount: 0,
      daysSince: Infinity,
    };
  }

  const lastDate = new Date(entry.lastConfirmed);
  if (isNaN(lastDate.getTime())) {
    return {
      status: 'unverified',
      lastConfirmed: null,
      confirmCount: entry.confirmCount || 0,
      daysSince: Infinity,
    };
  }

  const days = daysSince(lastDate);

  let status;
  if (days <= FRESH_DAYS) {
    status = 'fresh';
  } else if (days <= STALE_DAYS) {
    status = 'stale';
  } else {
    status = 'unverified';
  }

  return {
    status,
    lastConfirmed: lastDate,
    confirmCount: entry.confirmCount || 0,
    daysSince: days,
  };
}

/**
 * Get a display label for a freshness status.
 *
 * @param {'fresh'|'stale'|'unverified'} status - The freshness status
 * @param {number} [days=0] - Days since last confirmation (used in stale label)
 * @returns {{ text: string, color: string, icon: string }}
 */
export function getFreshnessLabel(status, days = 0) {
  switch (status) {
    case 'fresh':
      return { text: 'Verified', color: '#22c55e', icon: '\u2705' };
    case 'stale':
      return { text: `Last verified ${days} day${days === 1 ? '' : 's'} ago`, color: '#f59e0b', icon: '\u26a0\ufe0f' };
    case 'unverified':
    default:
      return { text: 'Not yet verified', color: '#9ca3af', icon: '\u2753' };
  }
}

/**
 * Filter an array of stops to return only those that are stale or unverified.
 * Each stop must have an `id` property.
 *
 * @param {Array<{ id: string, [key: string]: any }>} stops - Array of stop objects
 * @returns {Array<{ id: string, [key: string]: any, freshness: { status: string, lastConfirmed: Date|null, confirmCount: number, daysSince: number } }>}
 *   Stops that need attention, each enriched with a `freshness` property.
 */
export function getStaleStops(stops) {
  if (!Array.isArray(stops)) return [];

  return stops
    .map((stop) => {
      const freshness = getStopFreshness(stop.id);
      return { ...stop, freshness };
    })
    .filter((stop) => stop.freshness.status !== 'fresh');
}

/**
 * Scan all confirmations in localStorage and return stop IDs that haven't
 * been confirmed in 180+ days. These stops should show a warning banner.
 *
 * @returns {string[]} Array of stop IDs that are expired (>180 days since confirmation)
 */
export function autoFlagExpiredStops() {
  const confirmations = readConfirmations();
  const expiredIds = [];

  for (const [stopId, entry] of Object.entries(confirmations)) {
    if (!entry.lastConfirmed) {
      expiredIds.push(stopId);
      continue;
    }

    const days = daysSince(entry.lastConfirmed);
    if (days > STALE_DAYS) {
      expiredIds.push(stopId);
    }
  }

  return expiredIds;
}
