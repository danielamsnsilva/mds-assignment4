import { cycleTimeDays } from '../../domain/statistics.js';

/**
 * SVG path data for the simulator charts. Each chart draws in a fixed
 * viewBox 600 units wide; the SVG stretches to the container.
 */
export const CHART_WIDTH = 600;
export const CFD_HEIGHT = 240;
export const SMALL_CHART_HEIGHT = 180;

/** Stacked areas of the cumulative flow diagram. */
export function cumulativeFlowGeometry(history) {
  const last = history[history.length - 1];
  const maxX = Math.max(30, history.length - 1);
  const maxY = Math.max(10, last.arrived);
  const x = (i) => ((i / maxX) * CHART_WIDTH).toFixed(1);
  const y = (value) => (CFD_HEIGHT - (value / maxY) * 232).toFixed(1);
  const line = (key) => history.map((point, i) => `${x(i)},${y(point[key])}`);
  const area = (top, bottom) => {
    const upper = line(top);
    const lower = bottom ? line(bottom).reverse() : [`${x(history.length - 1)},${CFD_HEIGHT}`, `0,${CFD_HEIGHT}`];
    return `M${upper.join(' L')} L${lower.join(' L')} Z`;
  };
  return {
    waiting: area('arrived', 'started'),
    inProgress: area('started', 'finished'),
    done: area('finished', null),
    maxX,
    maxY,
  };
}

/**
 * H11: stacked bands of a CFD with any number of stages. `keys` are the
 * cumulative history fields from first stage to Done; each band lies between
 * one key and the next, and the last one (Done) sits on the axis.
 */
export function stageFlowGeometry(history, keys) {
  const last = history[history.length - 1];
  const maxX = Math.max(30, history.length - 1);
  const maxY = Math.max(10, last[keys[0]]);
  const x = (i) => ((i / maxX) * CHART_WIDTH).toFixed(1);
  const y = (value) => (CFD_HEIGHT - (value / maxY) * 232).toFixed(1);
  const line = (key) => history.map((point, i) => `${x(i)},${y(point[key])}`);
  const baseline = [`${x(history.length - 1)},${CFD_HEIGHT}`, `0,${CFD_HEIGHT}`];
  const bands = keys.map((key, i) => {
    const lower = i < keys.length - 1 ? line(keys[i + 1]).reverse() : baseline;
    return { key, path: `M${line(key).join(' L')} L${lower.join(' L')} Z` };
  });
  return { bands, maxX, maxY };
}

/** One bar per day of daily throughput. */
export function throughputGeometry(counts) {
  const max = Math.max(1, ...counts);
  const slot = CHART_WIDTH / Math.max(1, counts.length);
  const bars = counts
    .map((count, i) => {
      const x = (i * slot + slot * 0.16).toFixed(1);
      const width = (slot * 0.68).toFixed(1);
      const height = ((count / max) * 150).toFixed(1);
      const y = (170 - height).toFixed(1);
      return `M${x},170 V${y} h${width} V170 Z`;
    })
    .join(' ');
  return { bars, max };
}

/** Dots for finished items (completion day × cycle time) plus the P50/P85 lines. */
export function cycleScatterGeometry(finishedItems, currentDay, sortedCycleTimes, p50, p85) {
  const yMax = Math.max(1, Math.ceil((sortedCycleTimes[sortedCycleTimes.length - 1] || 0) * 1.15));
  const y = (days) => (170 - (days / yMax) * 160).toFixed(1);
  const points = finishedItems
    .map((item) => {
      const x = ((item.finishedDay / Math.max(1, currentDay)) * CHART_WIDTH).toFixed(1);
      const cy = y(cycleTimeDays(item.startedDay, item.finishedDay));
      return `M${(+x - 4).toFixed(1)},${cy}a4,4 0 1,0 8,0a4,4 0 1,0 -8,0`;
    })
    .join(' ');
  const hasData = sortedCycleTimes.length > 0;
  return { points, yMax, p50Y: hasData ? y(p50) : 190, p85Y: hasData ? y(p85) : 190 };
}
