/**
 * Deterministic linear congruential generator, so every simulator run with
 * the same settings produces the same flow.
 */
export class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  /** @returns {number} a value in [0, 1) */
  next() {
    this.seed = (this.seed * 1103515245 + 12345) % 2147483648;
    return this.seed / 2147483648;
  }
}
