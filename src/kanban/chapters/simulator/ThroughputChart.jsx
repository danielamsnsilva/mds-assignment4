import { SMALL_CHART_HEIGHT, throughputGeometry } from './chartGeometry.js';
import { ChartCard, ChartSvg } from './ChartCard.jsx';

/** H9: items finished per day over the last 30 days. */
export function ThroughputChart({ simulation }) {
  const { day } = simulation;
  const { firstDay, counts } = simulation.dailyThroughput(30);
  const { bars, max } = throughputGeometry(counts);

  const period = day >= 30 ? 'Last 30 days' : day ? `Days 1–${day}` : 'No days simulated';
  const description = day
    ? `Daily throughput from day ${firstDay} to day ${day}. ${counts
        .map((count, i) => `Day ${firstDay + i}: ${count} item${count === 1 ? '' : 's'}`)
        .join('. ')}.`
    : 'No simulation days yet. Each bar will show the number of items finished on that day.';

  return (
    <ChartCard
      title="Throughput · items finished per day"
      legend={<span className="caption">{`${period} · max ${max} / day`}</span>}
      axisLabels={[`Day ${day ? firstDay : 0}`, `Day ${day}`]}
    >
      <ChartSvg id="throughput-chart" title="Daily throughput bar chart" description={description} height={SMALL_CHART_HEIGHT}>
        <line x1="0" y1="90" x2="600" y2="90" className="chart-grid-line" />
        <path d={bars} className="throughput-bars" />
      </ChartSvg>
    </ChartCard>
  );
}
