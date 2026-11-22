/** An h4 with a muted note beside it. */
export function SectionHeader({ title, note, className = '' }) {
  return (
    <div className={`section-header ${className}`.trim()}>
      <h4>{title}</h4>
      {note != null && <span className="note">{note}</span>}
    </div>
  );
}
