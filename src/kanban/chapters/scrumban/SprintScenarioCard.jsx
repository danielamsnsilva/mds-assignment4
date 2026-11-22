import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { AnswerOptions, answerFeedback } from '../../components/common/AnswerOption.jsx';

/** H15: one situation from inside a Sprint, with three possible responses. */
export function SprintScenarioCard({ scenario, pick, onAnswer }) {
  return (
    <Blueprint role="group" aria-label={`${scenario.event}: ${scenario.scenario}`} className="question-card">
      <h6 className="kicker scenario-card__event">{scenario.event}</h6>
      <p className="scenario-card__text">{scenario.scenario}</p>
      <div className="scenario-card__options">
        <AnswerOptions
          options={scenario.options}
          answer={scenario.answer}
          pick={pick}
          variant="check"
          withPressedState
          onAnswer={onAnswer}
        />
      </div>
      <div role="status" aria-live="polite" className="scenario-card__feedback">
        {answerFeedback(pick, scenario.answer, scenario.explanation)}
      </div>
    </Blueprint>
  );
}
