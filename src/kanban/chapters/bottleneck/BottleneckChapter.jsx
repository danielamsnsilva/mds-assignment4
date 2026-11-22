import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { GlossaryTerm } from '../../components/common/GlossaryTerm.jsx';
import { MessageBox } from '../../components/common/MessageBox.jsx';
import { StatGrid } from '../../components/common/StatGrid.jsx';
import { BADGE_KEYS } from '../../config/rewards.js';
import { BOTTLENECK_CHALLENGE, STAGES } from '../../domain/StageFlowSimulation.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';
import { selectProgress, selectStageSimulation } from '../../state/selectors.js';
import { BottleneckGuess } from './BottleneckGuess.jsx';
import { StageControls } from './StageControls.jsx';
import { StageFlowChart } from './StageFlowChart.jsx';

const { minDays, minThroughput, maxItemsPerStage } = BOTTLENECK_CHALLENGE;

function stageStats(metrics) {
  return [
    ...STAGES.map((stage) => ({ value: metrics.perStage[stage.key], label: `In ${stage.name}` })),
    { value: metrics.throughput.toFixed(2), label: 'Throughput / day' },
    { value: metrics.finished > 0 ? metrics.averageLeadTime.toFixed(1) : '–', label: 'Avg lead time (d)' },
  ];
}

/** Coaching message for step 2. */
function resolveFeedback(simulation, guess, hasBadge) {
  if (!guess?.correct) {
    return { text: 'Finish step 1 first: find the stage where work piles up.', success: false };
  }
  if (hasBadge && simulation.meetsChallenge()) {
    return { text: 'Bottleneck resolved: every stage keeps up with demand. Bottleneck Buster earned.', success: true };
  }
  if (hasBadge) {
    return { text: 'Bottleneck Buster already earned. Keep experimenting with other staffings.', success: true };
  }
  if (simulation.day === 0) {
    return { text: 'Move people into the bottleneck stage, then press Run 30 days.', success: false };
  }
  if (simulation.day < minDays) {
    return { text: `Day ${simulation.day}. Keep running to at least day ${minDays}.`, success: false };
  }
  const { throughput, perStage } = simulation.metrics;
  const crowded = STAGES.filter((stage) => perStage[stage.key] > maxItemsPerStage).map((stage) => stage.name);
  if (crowded.length) {
    return {
      text: `Work is still piling up in ${crowded.join(' and ')}. Move people there, press Reset and run again.`,
      success: false,
    };
  }
  if (throughput < minThroughput) {
    return {
      text: `The queue is gone, but throughput over the whole run is ${throughput.toFixed(2)}/day. Press Reset and run 30 days with this staffing.`,
      success: false,
    };
  }
  return { text: 'Close. Check throughput and stage counts against the targets.', success: false };
}

export function BottleneckChapter() {
  const { state, actions } = useFlowLab();
  const simulation = selectStageSimulation(state);
  const hasBadge = selectProgress(state).has(BADGE_KEYS.bottleneckBuster);
  const feedback = resolveFeedback(simulation, state.bottleneckGuess, hasBadge);

  return (
    <section className="chapter chapter--compact">
      <p className="lead lead--simulator">
        This team has three stages: Analysis, Development and Testing. It has {BOTTLENECK_CHALLENGE.teamSize} people,
        and each stage works only on its own items. The{' '}
        <GlossaryTerm term="cfd">cumulative flow diagram</GlossaryTerm> has one band per stage.{' '}
        <strong>Challenge:</strong> find the <GlossaryTerm term="bottleneck">bottleneck</GlossaryTerm> in the CFD.
        Then move people so that after {minDays}+ days throughput is at least {minThroughput} items/day and no stage
        holds more than {maxItemsPerStage} items.
      </p>

      <div className="simulator-layout">
        <StageControls staffing={state.stageConfig} running={state.stageSimulation.running} actions={actions} />
        <div className="simulator-results">
          <StatGrid stats={stageStats(simulation.metrics)} />
          <StageFlowChart simulation={simulation} />
        </div>
      </div>

      <div className="metrics-cards">
        <BottleneckGuess simulation={simulation} guess={state.bottleneckGuess} onGuess={actions.guessBottleneck} />
        <Blueprint className="metrics-card bottleneck-step">
          <h6 className="kicker metrics-card__kicker">Step 2 · Fix · Badge +80 XP</h6>
          <div className="bottleneck-step__question">Rebalance the team</div>
          <ul className="bottleneck-step__targets">
            <li>At least {minDays} days</li>
            <li>Throughput ≥ {minThroughput} items/day</li>
            <li>No more than {maxItemsPerStage} items in any stage</li>
          </ul>
          <MessageBox highlighted={feedback.success}>{feedback.text}</MessageBox>
        </Blueprint>
      </div>

      <p className="body-note simulator__cfd-note">
        <strong>Reading a multi-stage CFD.</strong> The height of each band is the number of items in that stage. A
        band that keeps getting taller is where work piles up: that stage is the bottleneck. The bands after it stay
        thin because work reaches them slowly, and the slope of Done can never be steeper than what the bottleneck
        finishes. Adding people anywhere else does not raise throughput.
      </p>
    </section>
  );
}
