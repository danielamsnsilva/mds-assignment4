/**
 * Grid of key figures separated by hairlines.
 * @param {{ value: string|number, label: string }[]} stats
 * @param {'auto' | 'two'} columns
 */
export function StatGrid({ stats, columns = 'auto' }) {
  return (
    <div className={`stat-grid stat-grid--${columns}`}>
      {stats.map((stat) => (
        <div key={stat.label} className="stat-grid__cell">
          <div className="stat-grid__value">{stat.value}</div>
          <div className="stat-grid__label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

/** A single figure with a caption, e.g. "12 / moves". */
export function Stat({ value, label, className = '' }) {
  return (
    <div className={className}>
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}
