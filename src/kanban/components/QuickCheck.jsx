import { Blueprint } from '../../shared/components/Blueprint.jsx';
import { QUICK_CHECKS } from '../config/questions.js';
import { useFlowLab } from '../state/FlowLabContext.jsx';
import { AnswerOptions, answerFeedback } from './common/AnswerOption.jsx';
import { SectionHeader } from './common/SectionHeader.jsx';

/** H5: two questions at the end of a chapter, +15 XP per correct answer. */
export function QuickCheck({ chapterKey }) {
  const { state, actions } = useFlowLab();
  const questions = QUICK_CHECKS[chapterKey];
  if (!questions?.length) return null;

  const pickFor = (index) => state.quickChecks[`${chapterKey}:${index}`];
  const score = questions.filter((q, i) => pickFor(i) === q.answer).length;

  return (
    <section aria-label="Quick check" className="quick-check">
      <SectionHeader
        title="Quick check"
        note={`Check your understanding before moving on · +15 XP per correct answer · ${score}/${questions.length} correct`}
      />
      <div className="quick-check__grid">
        {questions.map((question, index) => {
          const pick = pickFor(index);
          return (
            <Blueprint key={question.question} className="question-card">
              <div className="question-card__question">{question.question}</div>
              <div className="quick-check__options">
                <AnswerOptions
                  options={question.options}
                  answer={question.answer}
                  pick={pick}
                  variant="check"
                  onAnswer={(option) => actions.answerQuickCheck(chapterKey, index, option)}
                />
              </div>
              <div role="status" className="quick-check__feedback">
                {answerFeedback(pick, question.answer, question.explanation)}
              </div>
            </Blueprint>
          );
        })}
      </div>
    </section>
  );
}
