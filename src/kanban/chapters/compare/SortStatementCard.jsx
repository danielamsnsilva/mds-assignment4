import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { AnswerOptions, answerFeedback } from '../../components/common/AnswerOption.jsx';
import { SORT_CATEGORIES } from '../../config/questions.js';

export function SortStatementCard({ statement, pick, onAnswer }) {
  return (
    <Blueprint role="group" aria-label={statement.statement} className="question-card">
      <p className="sort-card__statement">{statement.statement}</p>
      <div className="sort-card__options">
        <AnswerOptions
          options={SORT_CATEGORIES}
          answer={statement.answer}
          pick={pick}
          variant="compact"
          withPressedState
          onAnswer={onAnswer}
        />
      </div>
      <div role="status" aria-live="polite" className="sort-card__feedback">
        {answerFeedback(pick, statement.answer, statement.explanation)}
      </div>
    </Blueprint>
  );
}
