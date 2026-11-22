import { describe, expect, it } from 'vitest';
import { FlowSimulation, NO_WIP_LIMIT } from './FlowSimulation.js';

const config = { arrivalRate: 2, capacity: 5, wipLimit: 4 };

function run(days, cfg = config) {
  let sim = new FlowSimulation();
  for (let i = 0; i < days; i++) sim = sim.step(cfg);
  return sim;
}

describe('FlowSimulation', () => {
  it('is deterministic for the same settings', () => {
    expect(run(30).snapshot).toEqual(run(30).snapshot);
  });

  it('does not change the previous snapshot when stepping', () => {
    const start = new FlowSimulation();
    const before = JSON.stringify(start.snapshot);
    start.step(config);
    expect(JSON.stringify(start.snapshot)).toBe(before);
  });

  it('never exceeds the WIP limit', () => {
    let sim = new FlowSimulation();
    for (let i = 0; i < 40; i++) {
      sim = sim.step({ arrivalRate: 4, capacity: 2, wipLimit: 3 });
      const startedToday = sim.items.filter((it) => it.startedDay != null && (it.finishedDay == null || it.finishedDay === sim.day));
      expect(startedToday.length).toBeLessThanOrEqual(3);
    }
  });

  it('records one history point per day and keeps counts consistent', () => {
    const sim = run(10);
    expect(sim.history).toHaveLength(11);
    const last = sim.history[10];
    expect(last.arrived).toBe(sim.items.length);
    expect(last.finished).toBe(sim.metrics.finished);
    expect(last.started - last.finished).toBe(sim.metrics.wip);
  });

  it('meets the Flow Master challenge only with a tight WIP limit', () => {
    expect(run(30, { ...config, wipLimit: 3 }).meetsChallenge()).toBe(true);
    expect(run(30, { ...config, wipLimit: 6 }).meetsChallenge()).toBe(false);
  });

  it('fails the challenge with no WIP limit and too many arrivals', () => {
    expect(run(30, { arrivalRate: 4, capacity: 3, wipLimit: NO_WIP_LIMIT }).meetsChallenge()).toBe(false);
  });

  it('reports daily throughput for at most the last 30 days', () => {
    const { firstDay, counts } = run(45).dailyThroughput(30);
    expect(firstDay).toBe(16);
    expect(counts).toHaveLength(30);
  });
});
