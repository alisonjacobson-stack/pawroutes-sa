/**
 * Auto-moderation utility for PawRoutes SA reviews.
 * Pure utility module — no React dependencies.
 */

/** Common English & Afrikaans profanity words (no slurs) */
const PROFANITY_LIST = [
  // English
  'shit', 'fuck', 'fucking', 'fucked', 'fucker', 'damn', 'damned', 'dammit',
  'ass', 'asshole', 'bastard', 'bitch', 'crap', 'crappy', 'hell', 'piss',
  'pissed', 'bollocks', 'bugger', 'bloody', 'wanker', 'dickhead', 'cock',
  'twat', 'arse', 'arsehole', 'tosser', 'sod',
  // Afrikaans
  'bliksem', 'donder', 'fok', 'fokken', 'gat', 'kak', 'moer', 'moerse',
  'naaier', 'poes', 'voetsek', 'vokken', 'donnerse', 'kakpraat',
];

/** Known competitor brand names (common pet service platforms in SA) */
const COMPETITOR_NAMES = [
  'pawshake', 'rover', 'wag', 'petbnb', 'dogsitter', 'fetch pets',
  'mad paws', 'madpaws', 'trusted housesitters',
];

/** Low-effort review patterns */
const LOW_EFFORT = ['good', 'bad', 'nice', 'ok', 'okay', 'fine', 'meh', 'great', 'cool', 'yes', 'no'];

/**
 * Build a regex that matches whole words from a list (case-insensitive).
 * @param {string[]} words
 * @returns {RegExp}
 */
const wordListRegex = (words) =>
  new RegExp(`\\b(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');

const PROFANITY_RE = wordListRegex(PROFANITY_LIST);
const COMPETITOR_RE = wordListRegex(COMPETITOR_NAMES);
const URL_RE = /https?:\/\/\S+|www\.\S+/gi;
const EMAIL_RE = /[\w.-]+@[\w.-]+\.\w{2,}/gi;
const PHONE_RE = /(\+?\d[\d\s\-()]{7,}\d)/g;
const EXCESSIVE_PUNCT_RE = /[!?]{4,}/g;

/**
 * Moderate a review text for profanity, spam, low effort, and competitor mentions.
 *
 * @param {string} text - The raw review text
 * @returns {{ approved: boolean, flags: string[], cleaned: string }}
 *   - approved: true if no flags were raised
 *   - flags: array of human-readable flag reasons
 *   - cleaned: text with profanity replaced by asterisks
 */
export function moderateReview(text) {
  if (typeof text !== 'string') {
    return { approved: false, flags: ['Invalid input: review must be a string'], cleaned: '' };
  }

  const flags = [];
  let cleaned = text;

  // --- Profanity ---
  const profanityMatches = text.match(PROFANITY_RE);
  if (profanityMatches) {
    flags.push(`Profanity detected: ${[...new Set(profanityMatches.map(m => m.toLowerCase()))].join(', ')}`);
    cleaned = cleaned.replace(PROFANITY_RE, (match) => '*'.repeat(match.length));
  }

  // --- Spam: ALL CAPS (>50% uppercase letters) ---
  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 5) {
    const upperRatio = (letters.replace(/[^A-Z]/g, '').length) / letters.length;
    if (upperRatio > 0.5) {
      flags.push('Spam pattern: excessive CAPS (over 50% uppercase)');
    }
  }

  // --- Spam: excessive punctuation ---
  if (EXCESSIVE_PUNCT_RE.test(text)) {
    flags.push('Spam pattern: excessive punctuation (!!!! or ????)');
  }

  // --- Spam: URLs/links ---
  if (URL_RE.test(text)) {
    flags.push('Spam pattern: contains URL/link');
  }

  // --- Spam: email addresses ---
  if (EMAIL_RE.test(text)) {
    flags.push('Spam pattern: contains email address');
  }

  // --- Spam: phone numbers ---
  if (PHONE_RE.test(text)) {
    flags.push('Spam pattern: contains phone number');
  }

  // --- Low effort: too short ---
  const trimmed = text.trim();
  if (trimmed.length < 10) {
    flags.push('Low effort: review is under 10 characters');
  }

  // --- Low effort: generic one-word reviews ---
  if (LOW_EFFORT.includes(trimmed.toLowerCase())) {
    flags.push(`Low effort: generic review ("${trimmed}")`);
  }

  // --- Competitor mentions ---
  const competitorMatches = text.match(COMPETITOR_RE);
  if (competitorMatches) {
    flags.push(`Competitor mention: ${[...new Set(competitorMatches.map(m => m.toLowerCase()))].join(', ')}`);
  }

  return {
    approved: flags.length === 0,
    flags,
    cleaned,
  };
}

/**
 * Score a review on quality (0-100).
 * Higher scores indicate more useful, detailed reviews.
 *
 * Scoring breakdown:
 * - Length (0-30): longer reviews up to 200 chars
 * - Specific details (0-30): pet names, feature mentions, named staff
 * - Helpful language (0-20): descriptive adjectives, recommendations
 * - Structure (0-20): proper sentences, punctuation, no spam patterns
 *
 * Reviews scoring below 30 should be auto-flagged.
 *
 * @param {string} text - The review text
 * @returns {number} Score from 0-100
 */
export function getReviewScore(text) {
  if (typeof text !== 'string' || text.trim().length === 0) return 0;

  let score = 0;
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // --- Length score (0-30) ---
  // Linear scale: 0 chars = 0, 200+ chars = 30
  const lengthScore = Math.min(30, Math.round((trimmed.length / 200) * 30));
  score += lengthScore;

  // --- Specific details (0-30) ---
  let detailScore = 0;

  // Mentions a pet name pattern (e.g., "my dog Rex", "our cat Whiskers")
  const petNamePattern = /\b(my|our)\s+(dog|cat|puppy|kitten|pet|pup|furry friend|fur baby)\s+[A-Z][a-z]+/i;
  if (petNamePattern.test(trimmed)) detailScore += 10;

  // Mentions specific features/amenities
  const featureWords = [
    'parking', 'shade', 'water', 'bowl', 'leash', 'off-leash', 'fenced',
    'grass', 'trail', 'beach', 'pool', 'agility', 'play area', 'seating',
    'clean', 'spacious', 'shady', 'secure', 'menu', 'treats', 'food',
    'coffee', 'staff', 'friendly', 'helpful', 'welcoming',
  ];
  const featureCount = featureWords.filter(w => lower.includes(w)).length;
  detailScore += Math.min(10, featureCount * 3);

  // Mentions specific staff or owner names (capitalized words after "staff"/"owner")
  if (/\b(staff|owner|manager|waiter|waitress)\b.*\b[A-Z][a-z]{2,}\b/i.test(trimmed)) {
    detailScore += 5;
  }

  // Mentions a time reference (visited on, last week, yesterday)
  if (/\b(visited|went|came|last week|yesterday|today|last month|on (monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/i.test(trimmed)) {
    detailScore += 5;
  }

  score += Math.min(30, detailScore);

  // --- Helpful language (0-20) ---
  let helpfulScore = 0;

  // Recommendation language
  if (/\b(recommend|worth|must.visit|highly|definitely|absolutely|perfect for)\b/i.test(trimmed)) {
    helpfulScore += 8;
  }

  // Descriptive adjectives
  const descriptors = [
    'beautiful', 'amazing', 'fantastic', 'excellent', 'wonderful',
    'terrible', 'awful', 'disappointing', 'average', 'decent',
    'relaxing', 'comfortable', 'convenient', 'affordable', 'expensive',
    'crowded', 'quiet', 'peaceful', 'noisy', 'busy',
  ];
  const descCount = descriptors.filter(d => lower.includes(d)).length;
  helpfulScore += Math.min(8, descCount * 3);

  // Balanced review (mentions both positive and negative)
  const hasPositive = /\b(good|great|love|enjoy|nice|best|excellent|amazing)\b/i.test(trimmed);
  const hasNegative = /\b(but|however|only|wish|could|improve|downside|lacking)\b/i.test(trimmed);
  if (hasPositive && hasNegative) helpfulScore += 4;

  score += Math.min(20, helpfulScore);

  // --- Structure (0-20) ---
  let structureScore = 0;

  // Has proper sentence structure (starts with capital, ends with period/exclamation)
  if (/^[A-Z]/.test(trimmed) && /[.!?]$/.test(trimmed)) structureScore += 5;

  // Multiple sentences
  const sentenceCount = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 3).length;
  structureScore += Math.min(10, sentenceCount * 3);

  // No spam patterns (bonus points for clean text)
  const { flags } = moderateReview(text);
  if (flags.length === 0) structureScore += 5;

  score += Math.min(20, structureScore);

  return Math.min(100, Math.max(0, score));
}
