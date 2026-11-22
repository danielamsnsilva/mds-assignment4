import { STAGES } from '../../domain/StageFlowSimulation.js';
import { CFD_HEIGHT, stageFlowGeometry } from '../simulator/chartGeometry.js';
import { ChartCard, ChartSvg, LegendSwatch } from '../simulator/ChartCard.jsx';

const BANDS = [...STAGES, { key: 'done', name: 'Done' }];

/** H11: cumulative flow diagram with one band per stage, plus Done. */
export function StageFlowChart({ simulation }) {
  const { history, day } = simulation;
  const geometry = stageFlowGeometry(
    history,
    BANDS.map((band) => band.key),
  );
  const perStage = simulation.itemsPerStage;
  const done = history[history.length - 1].done;
  const counts = STAGES.map((stage) => `${perStage[stage.key]} in ${stage.name}`).join(', ');
  const description = `Stacked area chart over days 0 to ${day}, with one band per stage: Analysis, Development, Testing and Done. The horizontal axis is day and the vertical axis is number of items. The height of each stage band is the number of items in that stage. On day ${day}: ${counts}, and ${done} done.`;

  return (
    <ChartCard
      title={`Cumulative flow by stage · day ${day}`}
      legend={
        <span className="legend legend--wrap">
          {BANDS.map((band) => (
            <LegendSwatch key={band.key} className={`swatch--${band.key}`} label={band.name} />
          ))}
        </span>
      }
      axisLabels={['Day 0', `Max ${geometry.maxY} items`, `Day ${geometry.maxX}`]}
    >
      <ChartSvg id="stage-cfd-chart" title="Cumulative flow diagram by stage" description={description} height={CFD_HEIGHT}>
        {[60, 120, 180].map((y) => (
          <line key={y} x1="0" y1={y} x2="600" y2={y} className="chart-grid-line" />
        ))}
        {geometry.bands.map((band) => (
          <path key={band.key} d={band.path} className={`cfd-area cfd-area--${band.key}`} />
        ))}
      </ChartSvg>
    </ChartCard>
  );
}
