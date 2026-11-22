/** Small numeric helpers shared by the flow-metric classes. */

export function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function sortAscending(values) {
  return [...values].sort((a, b) => a - b);
}

/** Nearest-rank percentile of an already sorted list; 0 when the list is empty. */
export function nearestRankPercentile(sortedValues, fraction) {
  if (!sortedValues.length) return 0;
  return sortedValues[Math.max(0, Math.ceil(fraction * sortedValues.length) - 1)];
}

/** Cycle time counts both the start and the finish day. */
export function cycleTimeDays(startDay, finishDay) {
  return finishDay - startDay + 1;
}

export function pluralizeDays(days) {
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}
