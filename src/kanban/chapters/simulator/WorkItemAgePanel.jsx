import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { GlossaryTerm } from '../../components/common/GlossaryTerm.jsx';
import { pluralizeDays } from '../../domain/statistics.js';

const MAX_LISTED = 40;

/** H10: age of every item still in progress in the simulator, oldest first. */
export function WorkItemAgePanel({ simulation }) {
  const { day } = simulation;
  const hasP85 = simulation.sortedCycleTimes.length > 0;
  const p85 = simulation.percentile(0.85);
  const inProgress = simulation.workInProgressAges();
  const isOld = (age) => hasP85 && age > p85;
  const oldCount = hasP85 ? inProgress.filter((item) => isOld(item.age)).length : 0;

  let summary;
  if (!day) {
    summary = 'Run the simulation to see ages';
  } else {
    summary = hasP85
      ? `P85 cycle time ${p85} d · ${oldCount} of ${inProgress.length} older`
      : 'P85 appears after the first item finishes';
    if (inProgress.length > MAX_LISTED) summary += ` · showing the ${MAX_LISTED} oldest`;
  }

  return (
    <Blueprint className="age-panel">
      <div className="age-panel__header">
        <span className="age-panel__title">
          <GlossaryTerm term="age">Work item age</GlossaryTerm> · items in progress on day {day}
        </span>
        <span className="caption">{summary}</span>
      </div>
      {inProgress.length > 0 && (
        <ul aria-label="Items in progress, oldest first" className="age-panel__list">
          {inProgress.slice(0, MAX_LISTED).map((item) => (
            <li key={item.id} className={`age-chip age-chip--list${isOld(item.age) ? ' is-old' : ''}`}>
              #{item.id} · {pluralizeDays(item.age)}
            </li>
          ))}
        </ul>
      )}
      <p className="age-panel__tip">
        {oldCount > 0
          ? 'Highlighted items have been in progress longer than 85% of finished items took in total. Swarm on them before starting new work.'
          : 'Age grows every day an item stays in progress. An item older than the 85th percentile cycle time is an early warning that it is at risk.'}
      </p>
    </Blueprint>
  );
}
