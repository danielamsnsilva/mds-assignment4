import { SeededRandom } from './SeededRandom.js';
import { average, cycleTimeDays, nearestRankPercentile, sortAscending } from './statistics.js';

/** A WIP-limit setting at or above this value means "no limit". */
export const NO_WIP_LIMIT = 15;
const INITIAL_SEED = 12345;

/** Targets of the Flow Master challenge. */
export const FLOW_CHALLENGE = { minDays: 30, maxLeadTime: 5, minThroughput: 1.5 };

/**
 * Simulated team: items arrive every day, share the team's capacity while in
 * progress, and every extra item adds context-switching cost.
 *
 * The class wraps a plain, serialisable snapshot; `step()` returns a new
 * simulation and never changes the current one.
 */
export class FlowSimulation {
  static initialSnapshot() {
    return { day: 0, items: [], history: [{ arrived: 0, started: 0, finished: 0 }], seed: INITIAL_SEED };
  }

  constructor(snapshot = FlowSimulation.initialSnapshot()) {
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

  /** Advance one day. */
  step({ arrivalRate, capacity, wipLimit }) {
    const random = new SeededRandom(this.snapshot.seed);
    const day = this.snapshot.day + 1;
    const limit = wipLimit >= NO_WIP_LIMIT ? Infinity : wipLimit;
    const items = this.snapshot.items.map((item) => ({ ...item }));

    const arrivals = Math.max(0, Math.round(arrivalRate + (random.next() + random.next() - 1) * 1.5));
    for (let i = 0; i < arrivals; i++) {
      items.push({ arrivedDay: day, startedDay: null, remainingEffort: 1 + random.next() * 2, finishedDay: null });
    }

    // Pull waiting items while there is room under the WIP limit.
    const inProgress = items.filter((item) => item.startedDay != null && item.finishedDay == null);
    const waiting = items.filter((item) => item.startedDay == null);
    while (inProgress.length < limit && waiting.length) {
      const item = waiting.shift();
      item.startedDay = day;
      inProgress.push(item);
    }

    // Capacity is shared, and multitasking costs 7% per extra item (floor 35%).
    if (inProgress.length) {
      const effectiveCapacity = capacity * Math.max(0.35, 1 - 0.07 * (inProgress.length - 1));
      const share = effectiveCapacity / inProgress.length;
      inProgress.forEach((item) => {
        item.remainingEffort -= share;
        if (item.remainingEffort <= 1e-9) item.finishedDay = day;
      });
    }

    const history = [
      ...this.snapshot.history,
      {
        arrived: items.length,
        started: items.filter((item) => item.startedDay != null).length,
        finished: items.filter((item) => item.finishedDay != null).length,
      },
    ];
    return new FlowSimulation({ day, items, history, seed: random.seed });
  }

  get finishedItems() {
    return this.items.filter((item) => item.finishedDay != null);
  }

  get metrics() {
    const finished = this.finishedItems;
    return {
      finished: finished.length,
      averageCycleTime: average(finished.map((item) => cycleTimeDays(item.startedDay, item.finishedDay))),
      averageLeadTime: average(finished.map((item) => cycleTimeDays(item.arrivedDay, item.finishedDay))),
      throughput: this.day ? finished.length / this.day : 0,
      wip: this.items.filter((item) => item.startedDay != null && item.finishedDay == null).length,
      waiting: this.items.filter((item) => item.startedDay == null).length,
    };
  }

  get sortedCycleTimes() {
    return sortAscending(this.finishedItems.map((item) => cycleTimeDays(item.startedDay, item.finishedDay)));
  }

  percentile(fraction) {
    return nearestRankPercentile(this.sortedCycleTimes, fraction);
  }

  meetsChallenge() {
    const { finished, averageLeadTime, throughput } = this.metrics;
    return (
      this.day >= FLOW_CHALLENGE.minDays &&
      finished > 0 &&
      averageLeadTime <= FLOW_CHALLENGE.maxLeadTime &&
      throughput >= FLOW_CHALLENGE.minThroughput
    );
  }

  /** Items finished on each day, for the last `windowDays` days. */
  dailyThroughput(windowDays = 30) {
    const firstDay = Math.max(1, this.day - (windowDays - 1));
    const counts = Array.from({ length: Math.max(0, this.day - firstDay + 1) }, (_, i) => {
      const day = firstDay + i;
      return this.history[day].finished - this.history[day - 1].finished;
    });
    return { firstDay, counts };
  }

  /** H10: unfinished items (numbered by arrival), oldest first. */
  workInProgressAges() {
    return this.items
      .map((item, index) => ({ id: index + 1, item }))
      .filter(({ item }) => item.startedDay != null && item.finishedDay == null)
      .map(({ id, item }) => ({ id, age: cycleTimeDays(item.startedDay, this.day) }))
      .sort((a, b) => b.age - a.age);
  }
}
