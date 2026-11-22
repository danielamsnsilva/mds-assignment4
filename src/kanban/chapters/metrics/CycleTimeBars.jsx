import { Blueprint } from '../../../shared/components/Blueprint.jsx';

/** Bar per work item; bars above the 85th percentile are darker. */
export function CycleTimeBars({ rows, cycleTimes, p85 }) {
  const max = Math.max(1, ...cycleTimes);
  const bars = rows.map((row, i) => ({ key: `${row.id}-${i}`, id: row.id, value: cycleTimes[i] }));
  const description = `Cycle time per item, in days. The 85th percentile is ${p85} days. ${bars
    .map((bar) => `${bar.id}: ${bar.value} days`)
    .join('; ')}.`;

  return (
    <Blueprint role="img" aria-label={description} className="cycle-bars">
      <div className="cycle-bars__title">Cycle time per item (days)</div>
      <div className="cycle-bars__plot">
        {bars.map((bar) => (
          <div key={bar.key} className="cycle-bars__column">
            <span className="cycle-bars__value">{bar.value}</span>
            <div
              className={`cycle-bars__bar${bar.value > p85 ? ' is-outlier' : ''}`}
              style={{ height: `${Math.round((bar.value / max) * 92)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="cycle-bars__labels">
        {bars.map((bar) => (
          <span key={bar.key}>{bar.id}</span>
        ))}
      </div>
    </Blueprint>
  );
}
