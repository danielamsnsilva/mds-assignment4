import { GlossaryTerm } from '../../components/common/GlossaryTerm.jsx';
import { MessageBox } from '../../components/common/MessageBox.jsx';
import { StatGrid } from '../../components/common/StatGrid.jsx';
import { BADGE_KEYS } from '../../config/rewards.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';
import { selectProgress, selectSimulation } from '../../state/selectors.js';
import { CumulativeFlowChart } from './CumulativeFlowChart.jsx';
import { CycleTimeScatterplot } from './CycleTimeScatterplot.jsx';
import { SimulatorControls } from './SimulatorControls.jsx';
import { ThroughputChart } from './ThroughputChart.jsx';
import { WorkItemAgePanel } from './WorkItemAgePanel.jsx';

/** Coaching message under the charts. */
function simulatorFeedback(simulation, hasFlowBadge) {
  const { day } = simulation;
  const { waiting, wip } = simulation.metrics;
  if (day === 0) {
    return { text: 'Press Run 30 days to start. Then try again with a different WIP limit.', success: false };
  }
  if (hasFlowBadge && simulation.meetsChallenge()) {
    return { text: 'Stable flow: short lead time and steady throughput. Flow Master earned.', success: true };
  }
  if (waiting > 12) {
    return { text: 'The queue is growing faster than the team finishes. Try lowering the WIP limit or reducing arrivals.', success: false };
  }
  if (wip > 8) {
    return { text: 'Lots of items in progress. Each one gets a thin slice of capacity, so everything finishes late.', success: false };
  }
  return {
    text: day < 30 ? `Day ${day}. Keep running to at least day 30.` : 'Close. Check lead time and throughput against the targets.',
    success: false,
  };
}

function simulatorStats(metrics) {
  const hasFinished = metrics.finished > 0;
  return [
    { value: metrics.wip, label: 'WIP now' },
    { value: metrics.waiting, label: 'Waiting' },
    { value: metrics.throughput.toFixed(2), label: 'Throughput / day' },
    { value: hasFinished ? metrics.averageCycleTime.toFixed(1) : '–', label: 'Avg cycle time (d)' },
    { value: hasFinished ? metrics.averageLeadTime.toFixed(1) : '–', label: 'Avg lead time (d)' },
  ];
}

export function SimulatorChapter() {
  const { state, actions } = useFlowLab();
  const simulation = selectSimulation(state);
  const feedback = simulatorFeedback(simulation, selectProgress(state).has(BADGE_KEYS.flowMaster));

  return (
    <section className="chapter chapter--compact">
      <p className="lead lead--simulator">
        A simulated team receives new requests every day. Each item in progress shares the team's capacity, and every
        extra item adds context-switching cost. Watch the{' '}
        <GlossaryTerm term="cfd">cumulative flow diagram (CFD)</GlossaryTerm> as you change the WIP limit.{' '}
        <strong>Challenge:</strong> after 30+ days, keep average lead time at 5 days or less with{' '}
        <GlossaryTerm term="tp">throughput</GlossaryTerm> of at least 1.5 items/day.
      </p>

      <div className="simulator-layout">
        <SimulatorControls config={state.simConfig} running={state.simulation.running} actions={actions} />
        <div className="simulator-results">
          <StatGrid stats={simulatorStats(simulation.metrics)} />
          <CumulativeFlowChart simulation={simulation} />
          <ThroughputChart simulation={simulation} />
          <CycleTimeScatterplot simulation={simulation} />
          <MessageBox highlighted={feedback.success}>{feedback.text}</MessageBox>
        </div>
      </div>

      <p className="body-note simulator__cfd-note">
        <strong>Reading a CFD.</strong> The vertical distance across the "in progress" band is WIP. The horizontal
        distance is approximate cycle time. The slope of the Done band is throughput. A band that keeps widening means
        work is entering faster than it leaves.
      </p>

      <WorkItemAgePanel simulation={simulation} />
    </section>
  );
}
