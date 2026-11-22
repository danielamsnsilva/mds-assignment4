import { describe, expect, it } from 'vitest';
import { BOTTLENECK_CHALLENGE, StageFlowSimulation, peopleAssigned, restaff } from './StageFlowSimulation.js';

const starting = BOTTLENECK_CHALLENGE.defaultStaffing;
const balanced = { analysis: 3, development: 3, testing: 3 };

function run(days, staffing = starting) {
  let sim = new StageFlowSimulation();
  for (let i = 0; i < days; i++) sim = sim.step(staffing);
  return sim;
}

describe('StageFlowSimulation', () => {
  it('is deterministic for the same staffing', () => {
    expect(run(30).snapshot).toEqual(run(30).snapshot);
  });

  it('does not change the previous snapshot when stepping', () => {
    const start = run(5);
    const before = JSON.stringify(start.snapshot);
    start.step(starting);
    expect(JSON.stringify(start.snapshot)).toBe(before);
  });

  it('keeps one cumulative history band per stage, consistent with the items', () => {
    const sim = run(20);
    expect(sim.history).toHaveLength(21);
    const last = sim.history[20];
    const perStage = sim.itemsPerStage;
    expect(last.analysis).toBe(sim.items.length);
    expect(last.analysis - last.development).toBe(perStage.analysis);
    expect(last.development - last.testing).toBe(perStage.development);
    expect(last.testing - last.done).toBe(perStage.testing);
    expect(last.done).toBe(sim.metrics.finished);
    sim.history.slice(1).forEach((point) => {
      expect(point.analysis).toBeGreaterThanOrEqual(point.development);
      expect(point.development).toBeGreaterThanOrEqual(point.testing);
      expect(point.testing).toBeGreaterThanOrEqual(point.done);
    });
  });

  it('shows no bottleneck before enough days have passed', () => {
    expect(run(BOTTLENECK_CHALLENGE.minDaysToSpot - 1).bottleneckStage()).toBeNull();
  });

  it('puts the bottleneck in Testing with the starting staffing and fails the challenge', () => {
    expect(run(15).bottleneckStage()).toBe('testing');
    expect(run(30).meetsChallenge()).toBe(false);
  });

  it('moves the bottleneck to whichever stage is understaffed', () => {
    expect(run(15, { analysis: 4, development: 1, testing: 4 }).bottleneckStage()).toBe('development');
    expect(run(15, { analysis: 1, development: 4, testing: 4 }).bottleneckStage()).toBe('analysis');
  });

  it('resolves the bottleneck with a balanced team', () => {
    const sim = run(30, balanced);
    expect(sim.bottleneckStage()).toBeNull();
    expect(sim.meetsChallenge()).toBe(true);
  });

  it('never staffs above the team size or below one person per stage', () => {
    const more = restaff(starting, 'testing', 7);
    expect(more.testing).toBe(1);
    expect(peopleAssigned(more)).toBeLessThanOrEqual(BOTTLENECK_CHALLENGE.teamSize);
    expect(restaff(starting, 'analysis', 0).analysis).toBe(1);
    const freed = restaff(restaff(starting, 'analysis', 2), 'testing', 7);
    expect(freed).toEqual({ analysis: 2, development: 4, testing: 3 });
  });
});
