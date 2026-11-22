import { average, cycleTimeDays, nearestRankPercentile, sortAscending } from './statistics.js';

/** Flow metrics for the team's own work items (Metrics chapter). Rows are `{ id, start, finish }`. */
export class TeamCycleData {
  constructor(rows) {
    this.rows = rows ?? [];
  }

  /** Cycle time of each row; negative values (finish before start) count as 0. */
  get cycleTimes() {
    return this.rows.map((row) => Math.max(0, cycleTimeDays(row.start, row.finish)));
  }

  get averageCycleTime() {
    return average(this.cycleTimes);
  }

  get p85CycleTime() {
    return nearestRankPercentile(sortAscending(this.cycleTimes), 0.85);
  }

  /**
   * P85 over valid (positive) cycle times only. The board uses it to flag
   * ageing cards.
   */
  get agingThreshold() {
    const valid = this.rows
      .map((row) => cycleTimeDays(row.start, row.finish))
      .filter((value) => Number.isFinite(value) && value > 0);
    return nearestRankPercentile(sortAscending(valid), 0.85);
  }

  get periodDays() {
    const lastFinish = Math.max(...this.rows.map((row) => row.finish));
    const firstStart = Math.min(...this.rows.map((row) => row.start));
    return Math.max(1, lastFinish - firstStart + 1);
  }

  get throughputPerDay() {
    return this.rows.length / this.periodDays;
  }
}
