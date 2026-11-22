import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { pluralizeDays } from '../../domain/statistics.js';

function AgeBadge({ age, isOld }) {
  return (
    <div className={`age-chip${isOld ? ' is-old' : ''}`}>
      Age {pluralizeDays(age)}
      {isOld ? ' · older than P85' : ''}
    </div>
  );
}

/**
 * One draggable card. `age` is null for cards that are not in progress.
 */
export function KanbanCard({ card, age, canMoveLeft, canMoveRight, onMove, onUnblock, onDragStart }) {
  return (
    <Blueprint draggable="true" onDragStart={onDragStart} className="kanban-card">
      <div className="kanban-card__meta">
        <span>#{card.id}</span>
        <span>{card.type}</span>
      </div>
      <div className="kanban-card__title">{card.title}</div>
      {age && <AgeBadge age={age.age} isOld={age.isOld} />}
      {card.blocked && (
        <button type="button" onClick={onUnblock} className="btn btn-secondary kanban-card__unblock">
          Blocked · swarm to unblock
        </button>
      )}
      <div className="kanban-card__arrows">
        <button type="button" onClick={() => onMove(-1)} disabled={!canMoveLeft} className="btn btn-ghost kanban-card__arrow" aria-label="Move left">
          ←
        </button>
        <button type="button" onClick={() => onMove(1)} disabled={!canMoveRight} className="btn btn-ghost kanban-card__arrow" aria-label="Move right">
          →
        </button>
      </div>
    </Blueprint>
  );
}
