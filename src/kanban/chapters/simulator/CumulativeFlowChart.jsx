import { CFD_HEIGHT, cumulativeFlowGeometry } from './chartGeometry.js';
import { ChartCard, ChartSvg, LegendSwatch } from './ChartCard.jsx';

export function CumulativeFlowChart({ simulation }) {
  const { history, day } = simulation;
  const geometry = cumulativeFlowGeometry(history);
  const last = history[history.length - 1];
  const description = `Stacked area chart over days 0 to ${day}. The horizontal axis is day and the vertical axis is number of items. Waiting is work not yet started, in progress is started but unfinished work, and done is completed work. On day ${day}: ${last.arrived} items have arrived, ${last.started} have started and ${last.finished} are done.`;

  return (
    <ChartCard
      title={`Cumulative flow · day ${day}`}
      legend={
        <span className="legend">
          <LegendSwatch className="swatch--waiting" label="Waiting" />
          <LegendSwatch className="swatch--progress" label="In progress" />
          <LegendSwatch className="swatch--done" label="Done" />
        </span>
      }
      axisLabels={['Day 0', `Max ${geometry.maxY} items`, `Day ${geometry.maxX}`]}
    >
      <ChartSvg id="cfd-chart" title="Cumulative flow diagram" description={description} height={CFD_HEIGHT}>
        {[60, 120, 180].map((y) => (
          <line key={y} x1="0" y1={y} x2="600" y2={y} className="chart-grid-line" />
        ))}
        <path d={geometry.waiting} className="cfd-area cfd-area--waiting" />
        <path d={geometry.inProgress} className="cfd-area cfd-area--progress" />
        <path d={geometry.done} className="cfd-area cfd-area--done" />
      </ChartSvg>
    </ChartCard>
  );
}
