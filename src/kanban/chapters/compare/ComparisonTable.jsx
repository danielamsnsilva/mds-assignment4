import { COMPARISON_ROWS, COMPARISON_SUMMARY } from '../../config/content.js';

export function ComparisonTable() {
  return (
    <div role="region" aria-label="Kanban and Scrum comparison table" tabIndex={0} className="table-scroll">
      <h4 id="comparison-table-heading">Side by side</h4>
      <table className="table comparison-table" aria-labelledby="comparison-table-heading">
        <thead>
          <tr>
            <th aria-hidden="true" />
            <th scope="col">Kanban</th>
            <th scope="col">Scrum</th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row) => (
            <tr key={row.aspect}>
              <th scope="row" className="comparison-table__aspect">{row.aspect}</th>
              <td>{row.kanban}</td>
              <td>{row.scrum}</td>
            </tr>
          ))}
          <tr>
            <th scope="row" className="comparison-table__aspect">Together</th>
            <td colSpan={2}>{COMPARISON_SUMMARY}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
