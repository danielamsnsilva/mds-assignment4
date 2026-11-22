import { Blueprint } from '../../../shared/components/Blueprint.jsx';

export function BadgeGrid({ badges }) {
  return (
    <div>
      <h4>Badges</h4>
      <div className="badge-grid">
        {badges.map((badge) => (
          <Blueprint key={badge.key} className={`badge-card${badge.earned ? ' is-earned' : ''}`}>
            <div className="badge-card__state">{badge.earned ? 'Earned' : 'Locked'}</div>
            <div className="badge-card__name">{badge.name}</div>
            <div className="badge-card__how">{badge.how}</div>
          </Blueprint>
        ))}
      </div>
    </div>
  );
}
