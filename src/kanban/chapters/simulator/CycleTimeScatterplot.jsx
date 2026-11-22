import { cycleTimeDays, pluralizeDays } from '../../domain/statistics.js';
import { SMALL_CHART_HEIGHT, cycleScatterGeometry } from './chartGeometry.js';
import { ChartCard, ChartSvg } from './ChartCard.jsx';

/** H9: completion day × cycle time, with P50 and P85 reference lines. */
export function CycleTimeScatterplot({ simulation }) {
  const { day } = simulation;
  const finished = simulation.finishedItems;
  const cycles = simulation.sortedCycleTimes;
  const p50 = simulation.percentile(0.5);
  const p85 = simulation.percentile(0.85);
  const geometry = cycleScatterGeometry(finished, day, cycles, p50, p85);

  const description = cycles.length
    ? `Scatterplot of completed items: horizontal axis is completion day and vertical axis is cycle time in days. P50 is ${pluralizeDays(p50)}; P85 is ${pluralizeDays(p85)}. ${finished
        .map((item) => `Day ${item.finishedDay}: ${pluralizeDays(cycleTimeDays(item.startedDay, item.finishedDay))}`)
        .join('. ')}.`
    : 'No items have finished yet, so the scatterplot has no points and P50/P85 are unavailable.';

  return (
    <ChartCard
      title="Cycle time · completion day × days"
      legend={
        <span className="legend legend--wrap">
          <span className="legend__item">
            <span className="legend__dot" />
            Completed item
          </span>
          <span className="legend__p50">P50: {p50 ? pluralizeDays(p50) : '–'}</span>
          <span className="legend__p85">P85: {p85 ? pluralizeDays(p85) : '–'}</span>
        </span>
      }
      axisLabels={['Day 0', `Max ${geometry.yMax} days`, `Day ${day}`]}
    >
      <ChartSvg id="cycle-chart" title="Cycle time scatterplot" description={description} height={SMALL_CHART_HEIGHT}>
        <line x1="0" y1="90" x2="600" y2="90" className="chart-grid-line" />
        <line x1="0" y1={geometry.p50Y} x2="600" y2={geometry.p50Y} className="percentile-line percentile-line--p50" />
        <line x1="0" y1={geometry.p85Y} x2="600" y2={geometry.p85Y} className="percentile-line percentile-line--p85" />
        <path d={geometry.points} className="cycle-points" />
      </ChartSvg>
    </ChartCard>
  );
}
