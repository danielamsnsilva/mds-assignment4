import { BADGES, RANKS, XP_PER_LEVEL } from '../config/rewards.js';

/**
 * Gamification state over an XP ledger: `{ [rewardKey]: amount }`.
 * Each key can be granted only once, so XP can't be farmed.
 */
export class LearnerProgress {
  constructor(ledger = {}) {
    this.ledger = ledger;
  }

  has(rewardKey) {
    return this.ledger[rewardKey] != null;
  }

  /** @returns {object | null} the new ledger, or null if the reward was already granted */
  grant(rewardKey, amount) {
    if (this.has(rewardKey)) return null;
    return { ...this.ledger, [rewardKey]: amount };
  }

  get xp() {
    return Object.values(this.ledger).reduce((sum, amount) => sum + amount, 0);
  }

  get level() {
    return Math.floor(this.xp / XP_PER_LEVEL) + 1;
  }

  get rank() {
    return RANKS[Math.min(this.level - 1, RANKS.length - 1)];
  }

  get badges() {
    return BADGES.map((badge) => ({ ...badge, earned: this.has(badge.key) }));
  }

  get earnedBadges() {
    return this.badges.filter((badge) => badge.earned);
  }

  isChapterComplete(chapterKey) {
    return this.has(`ch:${chapterKey}`);
  }
}
