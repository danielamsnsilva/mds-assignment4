/** Thin accent bar; `percent` goes from 0 to 100. */
export function ProgressBar({ percent, animated = false }) {
  return (
    <div className="progress-bar">
      <div
        className={`progress-bar__fill${animated ? ' progress-bar__fill--animated' : ''}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
