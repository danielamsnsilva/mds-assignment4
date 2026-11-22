import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { AnswerOption } from '../../components/common/AnswerOption.jsx';
import { BOTTLENECK_CHALLENGE, STAGES } from '../../domain/StageFlowSimulation.js';

const stageName = (key) => STAGES.find((stage) => stage.key === key)?.name ?? key;

function optionState(guess, stageKey) {
  if (!guess) return 'idle';
  if (guess.correct) return guess.stage === stageKey ? 'correct' : 'dimmed';
  return guess.stage === stageKey ? 'wrong' : 'idle';
}

/** Step 1 of the H11 challenge: name the stage that causes the bottleneck. */
export function BottleneckGuess({ simulation, guess, onGuess }) {
  const found = Boolean(guess?.correct);
  const canGuess = !found && simulation.bottleneckStage() != null;

  let feedback;
  if (found) {
    feedback = `Correct. ${stageName(guess.stage)} has the least capacity for the demand, so its band keeps widening while the stages after it starve.`;
  } else if (guess) {
    feedback = `Not quite. ${stageName(guess.stage)} is not where work piles up. Look for the band that keeps getting taller.`;
  } else if (simulation.day < BOTTLENECK_CHALLENGE.minDaysToSpot) {
    feedback = `Run at least ${BOTTLENECK_CHALLENGE.minDaysToSpot} days, then read the CFD.`;
  } else if (!canGuess) {
    feedback = 'No stage is holding a queue in this run. Use the starting staffing, press Reset and run again.';
  } else {
    feedback = 'Which band keeps getting taller?';
  }

  return (
    <Blueprint className="metrics-card bottleneck-step">
      <h6 className="kicker metrics-card__kicker">Step 1 · Find</h6>
      <div className="bottleneck-step__question">Which stage is the bottleneck?</div>
      <div className="bottleneck-step__options" role="group" aria-label="Stages">
        {STAGES.map((stage) => (
          <AnswerOption
            key={stage.key}
            label={stage.name}
            variant="compact"
            state={optionState(guess, stage.key)}
            disabled={!canGuess}
            aria-pressed={guess?.stage === stage.key}
            onSelect={() => onGuess(stage.key)}
          />
        ))}
      </div>
      <p className="bottleneck-step__feedback" aria-live="polite">
        {feedback}
      </p>
    </Blueprint>
  );
}
