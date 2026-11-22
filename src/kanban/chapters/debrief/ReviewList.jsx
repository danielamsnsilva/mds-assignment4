import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { CHAPTERS } from '../../config/chapters.js';

const questionCount = (n) => `${n} ${n === 1 ? 'question' : 'questions'}`;

function reviewSummary({ answeredCount, missedCount }) {
  if (!answeredCount) {
    return 'Answer the quick checks, the Kanban vs Scrum statements and the final quiz. The questions you miss will be listed here, with a link back to the chapter.';
  }
  return missedCount
    ? `${questionCount(missedCount)} to review, grouped by chapter.`
    : 'Nothing to review: every answer you gave was correct.';
}

/** H14: wrong answers grouped by chapter, each group linking back to its chapter. */
export function ReviewList({ plan, onGoToChapter, onOpenGlossary }) {
  return (
    <div>
      <h4>What to review</h4>
      <p className="body-note review__summary">{reviewSummary(plan)}</p>
      <div className="review__groups">
        {plan.groups.map((group) => {
          const inPath = group.chapterIndex >= 0;
          const chapter = CHAPTERS[group.chapter];
          return (
            <Blueprint key={group.chapter} className="review-group">
              <div className="review-group__header">
                <span className="review-group__title">
                  {chapter?.title ?? group.chapter} · {questionCount(group.items.length)}
                </span>
                <button
                  type="button"
                  onClick={inPath ? () => onGoToChapter(group.chapterIndex) : onOpenGlossary}
                  className="btn btn-secondary btn-medium"
                >
                  {inPath ? `Review ${chapter.shortTitle} →` : 'Open glossary'}
                </button>
              </div>
              <ul className="review-group__items">
                {group.items.map((item) => (
                  <li key={`${item.source}-${item.text}`}>
                    <span className="caption">{item.source} · </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </Blueprint>
          );
        })}
      </div>
    </div>
  );
}
