import { SeededRandom } from './SeededRandom.js';
import { average, cycleTimeDays } from './statistics.js';

/** H11: the workflow stages, in order. Each one gets its own band in the CFD. */
export const STAGES = [
  { key: 'analysis', name: 'Analysis' },
  { key: 'development', name: 'Development' },
  { key: 'testing', name: 'Testing' },
];

const DONE = STAGES.length;
const INITIAL_SEED = 4242;
const ARRIVAL_RATE = 2;

/** Rules and targets of the Bottleneck Buster challenge. */
export const BOTTLENECK_CHALLENGE = {
  teamSize: 9,
  minPeoplePerStage: 1,
  defaultStaffing: { analysis: 4, development: 4, testing: 1 },
  /** A stage must hold this many items, after `minDaysToSpot` days, to count as a clear bottleneck. */
  minDaysToSpot: 10,
  minQueueToSpot: 5,
  /** Targets for "resolved". */
  minDays: 30,
  minThroughput: 1.6,
  maxItemsPerStage: 6,
};

const emptyHistoryPoint = () => ({ analysis: 0, development: 0, testing: 0, done: 0 });

/**
 * A team with three stages: Analysis → Development → Testing → Done.
 * Each stage has its own people (1 person = 1 effort unit per day) and works
 * on its oldest items first. An item that finishes a stage moves to the next
 * stage at the end of the day.
 *
 * Like FlowSimulation, it wraps a plain, serialisable snapshot and `step()`
 * returns a new simulation.
 */
export class StageFlowSimulation {
  static initialSnapshot() {
    return { day: 0, items: [], history: [emptyHistoryPoint()], seed: INITIAL_SEED };
  }

  constructor(snapshot = StageFlowSimulation.initialSnapshot()) {
    this.snapshot = snapshot;
  }

  get day() {
    return this.snapshot.day;
  }

  get items() {
    return this.snapshot.items;
  }

  get history() {
    return this.snapshot.history;
  }

  /** Advance one day with `staffing` = people per stage, e.g. `{ analysis: 3, development: 3, testing: 3 }`. */
  step(staffing) {
    const random = new SeededRandom(this.snapshot.seed);
    const day = this.snapshot.day + 1;
    const items = this.snapshot.items.map((item) => ({ ...item, remaining: [...item.remaining] }));

    const arrivals = Math.max(0, Math.round(ARRIVAL_RATE + (random.next() + random.next() - 1) * 1.5));
    for (let i = 0; i < arrivals; i++) {
      const remaining = STAGES.map(() => 0.5 + random.next());
      items.push({ arrivedDay: day, stage: 0, remaining, finishedDay: null });
    }

    // Each stage spends its capacity on its oldest items first.
    const finishedToday = [];
    STAGES.forEach((stage, index) => {
      let capacity = Math.max(0, staffing[stage.key] ?? 0);
      for (const item of items) {
        if (capacity <= 1e-9) break;
        if (item.stage !== index) continue;
        const spent = Math.min(capacity, item.remaining[index]);
        item.remaining[index] -= spent;
        capacity -= spent;
        if (item.remaining[index] <= 1e-9) finishedToday.push(item);
      }
    });

    // Finished work moves on at the end of the day.
    finishedToday.forEach((item) => {
      item.stage += 1;
      if (item.stage === DONE) item.finishedDay = day;
    });

    const history = [...this.snapshot.history, StageFlowSimulation.historyPoint(items)];
    return new StageFlowSimulation({ day, items, history, seed: random.seed });
  }

  /** Cumulative counts: items that have reached each stage (or later) so far. */
  static historyPoint(items) {
    const reached = (index) => items.filter((item) => item.stage >= index).length;
    return { analysis: items.length, development: reached(1), testing: reached(2), done: reached(DONE) };
  }

  /** Items currently in each stage, keyed by stage. */
  get itemsPerStage() {
    return Object.fromEntries(
      STAGES.map((stage, index) => [stage.key, this.items.filter((item) => item.stage === index).length]),
    );
  }

  get metrics() {
    const finished = this.items.filter((item) => item.finishedDay != null);
    return {
      finished: finished.length,
      throughput: this.day ? finished.length / this.day : 0,
      averageLeadTime: average(finished.map((item) => cycleTimeDays(item.arrivedDay, item.finishedDay))),
      perStage: this.itemsPerStage,
    };
  }

  /**
   * The stage where work piles up, or `null` while there is no clear
   * bottleneck yet (too few days, or no stage holding a real queue).
   */
  bottleneckStage() {
    if (this.day < BOTTLENECK_CHALLENGE.minDaysToSpot) return null;
    const perStage = this.itemsPerStage;
    const [busiest] = [...STAGES].sort((a, b) => perStage[b.key] - perStage[a.key]);
    return perStage[busiest.key] >= BOTTLENECK_CHALLENGE.minQueueToSpot ? busiest.key : null;
  }

  /** The bottleneck is resolved: steady throughput and no stage holding a big queue. */
  meetsChallenge() {
    const { throughput } = this.metrics;
    const largestStage = Math.max(...Object.values(this.itemsPerStage));
    return (
      this.day >= BOTTLENECK_CHALLENGE.minDays &&
      throughput >= BOTTLENECK_CHALLENGE.minThroughput &&
      largestStage <= BOTTLENECK_CHALLENGE.maxItemsPerStage
    );
  }
}

/**
 * Sets one stage's people without going over the team size; every stage
 * keeps at least one person.
 */
export function restaff(staffing, stageKey, people) {
  const { teamSize, minPeoplePerStage } = BOTTLENECK_CHALLENGE;
  const others = STAGES.filter((stage) => stage.key !== stageKey).reduce(
    (sum, stage) => sum + staffing[stage.key],
    0,
  );
  const value = Math.max(minPeoplePerStage, Math.min(Math.round(people), teamSize - others));
  return { ...staffing, [stageKey]: value };
}

export const peopleAssigned = (staffing) => STAGES.reduce((sum, stage) => sum + staffing[stage.key], 0);
