import { Blueprint } from '../../../shared/components/Blueprint.jsx';

/** Frame shared by the simulator charts: title, legend, SVG and axis labels. */
export function ChartCard({ title, legend, axisLabels, children }) {
  return (
    <Blueprint className="chart-card">
      <div className="chart-card__header">
        <span className="chart-card__title">{title}</span>
        {legend}
      </div>
      {children}
      <div className="chart-card__axis">
        {axisLabels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </Blueprint>
  );
}

/** Accessible SVG chart: the title and description are read by screen readers. */
export function ChartSvg({ id, title, description, height, children }) {
  return (
    <svg
      viewBox={`0 0 600 ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      className="chart-svg"
      style={{ height }}
    >
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-description`}>{description}</desc>
      {children}
    </svg>
  );
}

export function LegendSwatch({ className, label }) {
  return (
    <span className="legend__item">
      <span className={`legend__swatch ${className}`} />
      {label}
    </span>
  );
}
