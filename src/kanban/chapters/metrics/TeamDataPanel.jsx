import { GlossaryTerm } from '../../components/common/GlossaryTerm.jsx';
import { SectionHeader } from '../../components/common/SectionHeader.jsx';
import { StatGrid } from '../../components/common/StatGrid.jsx';
import { CycleTimeBars } from './CycleTimeBars.jsx';
import { CycleTimeTable } from './CycleTimeTable.jsx';

function CsvToolbar({ sourceLabel, actions }) {
  return (
    <div className="csv-toolbar">
      <label className="btn btn-secondary btn-medium csv-toolbar__upload">
        Import CSV
        <input
          type="file"
          accept=".csv,text/csv"
          aria-label="Import CSV file"
          className="visually-hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) actions.importCsvFile(file);
            event.target.value = '';
          }}
        />
      </label>
      <button type="button" onClick={actions.loadSampleData} className="btn btn-secondary btn-medium">
        Load MDS26 example
      </button>
      <span className="note">{sourceLabel}</span>
    </div>
  );
}

function PercentileNote({ isAdvanced, p85 }) {
  const term = <GlossaryTerm term="p85">85th percentile</GlossaryTerm>;
  return isAdvanced ? (
    <p className="body-note">
      <strong>Forecasting with percentiles.</strong> Instead of an average, quote the {term}: "85% of our items finish
      in {p85} days or less." Darker bars sit above that line. Customers get a probability, not a promise.
    </p>
  ) : (
    <p className="body-note">
      Darker bars are the slowest 15% of items (above the {term}). Those outliers are often worth discussing in a
      retrospective: what blocked them?
    </p>
  );
}

/** H12: the team's own work items, imported from CSV or edited by hand. */
export function TeamDataPanel({ teamData, metrics, isAdvanced, actions }) {
  const { importStatus } = teamData;
  const stats = [
    { value: metrics.averageCycleTime.toFixed(1), label: 'Avg cycle time (days)' },
    { value: metrics.p85CycleTime, label: '85th percentile (days)' },
    { value: metrics.throughputPerDay.toFixed(2), label: 'Throughput (items/day)' },
    { value: metrics.periodDays, label: 'Period (days)' },
  ];

  return (
    <div>
      <SectionHeader
        title="Your team's data"
        note="Edit the start and finish days. Cycle time counts both days."
        className="section-header--spaced"
      />
      <CsvToolbar sourceLabel={teamData.sourceLabel || 'Imported or sample data'} actions={actions} />
      <p className="note team-data__help">
        CSV needs a work-item column (Key, ID or Summary), a cycle start date (Start date / Started) and a finish date
        (Finish date / Resolved). Jira's Created date is not a cycle start unless work starts when the issue is created.
        Open or undated items are skipped. Imported dates appear as days from the first start date. The MDS26 example
        uses actual PR open-to-merge dates, a review-time proxy rather than the full work-item cycle time.
      </p>
      <div role="status" aria-live="polite" className={`import-status${importStatus?.isError ? ' is-error' : ''}`}>
        {importStatus?.message ?? ''}
      </div>

      <div className="team-data__layout">
        <CycleTimeTable rows={teamData.rows} onEdit={actions.editTeamRow} />
        <div className="team-data__summary">
          <StatGrid stats={stats} columns="two" />
          <CycleTimeBars rows={teamData.rows} cycleTimes={metrics.cycleTimes} p85={metrics.p85CycleTime} />
          <PercentileNote isAdvanced={isAdvanced} p85={metrics.p85CycleTime} />
        </div>
      </div>
    </div>
  );
}
