import { SOURCES } from '../../config/content.js';
import { SORT_STATEMENTS } from '../../config/questions.js';
import { THRESHOLDS } from '../../config/rewards.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';
import { ComparisonTable } from './ComparisonTable.jsx';
import { SortStatementCard } from './SortStatementCard.jsx';

export function CompareChapter() {
  const { state, actions } = useFlowLab();
  const answered = SORT_STATEMENTS.filter((s, i) => state.sortAnswers[i] != null).length;
  const correct = SORT_STATEMENTS.filter((s, i) => state.sortAnswers[i] === s.answer).length;

  return (
    <section className="chapter chapter--medium">
      <p className="lead lead--compare">
        <strong>Sort the statements.</strong> Is each one true of Kanban, Scrum, or both? There are{' '}
        {SORT_STATEMENTS.length} statements; get {THRESHOLDS.sorterCorrectAnswers} correct to earn the badge.{' '}
        <span role="status" aria-live="polite" className="compare__score">
          {correct}/{answered} correct
        </span>
      </p>

      <div className="sort-grid">
        {SORT_STATEMENTS.map((statement, index) => (
          <SortStatementCard
            key={statement.statement}
            statement={statement}
            pick={state.sortAnswers[index]}
            onAnswer={(option) => actions.answerSortStatement(index, option)}
          />
        ))}
      </div>

      <ComparisonTable />

      <p className="note">
        Sources:{' '}
        <a href={SOURCES.kanbanGuide} target="_blank" rel="noopener noreferrer">
          The Kanban Guide (2025.5)
        </a>{' '}
        and{' '}
        <a href={SOURCES.scrumGuide} target="_blank" rel="noopener noreferrer">
          The Scrum Guide (2020)
        </a>
        .
      </p>
    </section>
  );
}
