import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { GlossaryTerm } from '../../components/common/GlossaryTerm.jsx';
import { RangeField } from '../../components/common/RangeField.jsx';

export function LittlesLawCalculator({ law, onChange }) {
  const cycleTime = (law.wip / law.throughput).toFixed(1);

  return (
    <Blueprint className="metrics-card metrics-card--calculator">
      <h6 className="kicker metrics-card__kicker">
        <GlossaryTerm term="little">Little's Law</GlossaryTerm>
      </h6>
      <div className="law-formula">Lead time = WIP / Throughput</div>
      <RangeField label="Average WIP (items)" value={law.wip} min="1" max="30" step="1" onChange={(v) => onChange('wip', v)} />
      <RangeField
        label="Average throughput (items/day)"
        value={law.throughput}
        min="0.5"
        max="6"
        step="0.5"
        onChange={(v) => onChange('throughput', v)}
      />
      <div className="law-result">
        <span className="law-result__value">{cycleTime}</span>
        <span>days average cycle time</span>
      </div>
      <p className="note metrics-card__note">
        One of Kanban’s strengths is WIP limits, setting caps on how much work can be in each stage. Using Little’s Law,
        you can calculate how much WIP your system can handle if you want to maintain a specific lead time: WIP = Lead
        Time × Throughput
      </p>
    </Blueprint>
  );
}
