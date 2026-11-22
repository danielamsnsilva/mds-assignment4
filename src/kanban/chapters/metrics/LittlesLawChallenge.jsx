import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { AnswerOptions } from '../../components/common/AnswerOption.jsx';
import { LAW_CHALLENGE } from '../../config/questions.js';

export function LittlesLawChallenge({ pick, onAnswer }) {
  let feedback = '';
  if (pick != null) feedback = pick === LAW_CHALLENGE.answer ? LAW_CHALLENGE.correctFeedback : LAW_CHALLENGE.wrongFeedback;

  return (
    <Blueprint className="metrics-card metrics-card--challenge">
      <h6 className="kicker metrics-card__kicker">Challenge · +40 XP</h6>
      <div className="law-challenge__question">{LAW_CHALLENGE.question}</div>
      <div className="law-challenge__options">
        <AnswerOptions
          options={LAW_CHALLENGE.options}
          answer={LAW_CHALLENGE.answer}
          pick={pick}
          variant="grid"
          onAnswer={onAnswer}
        />
      </div>
      <div className="law-challenge__feedback">{feedback}</div>
    </Blueprint>
  );
}
