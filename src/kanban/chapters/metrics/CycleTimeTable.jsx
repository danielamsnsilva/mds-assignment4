import { cycleTimeDays } from '../../domain/statistics.js';

/** Editable start/finish days per work item. */
export function CycleTimeTable({ rows, onEdit }) {
  const dayInput = (index, field, value) => (
    <input
      className="input day-input"
      type="number"
      min="1"
      value={value}
      onChange={(event) => onEdit(index, field, parseInt(event.target.value, 10) || 1)}
    />
  );

  return (
    <div className="table-scroll">
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Start day</th>
            <th>Finish day</th>
            <th>Cycle time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.id}-${index}`}>
              <td className="cycle-table__id">{row.id}</td>
              <td>{dayInput(index, 'start', row.start)}</td>
              <td>{dayInput(index, 'finish', row.finish)}</td>
              <td>{Math.max(0, cycleTimeDays(row.start, row.finish))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
