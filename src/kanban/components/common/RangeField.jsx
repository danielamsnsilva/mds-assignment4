/** A labelled slider that shows its current value. */
export function RangeField({ label, value, displayValue = value, min, max, step, onChange }) {
  return (
    <label className="range-field">
      <span className="range-field__header">
        <span>{label}</span>
        <strong>{displayValue}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(parseFloat(event.target.value))}
      />
    </label>
  );
}
