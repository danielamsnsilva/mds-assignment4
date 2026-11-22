export const SAMPLE_ROWS_LABEL = 'Illustrative sample data';
export const MDS26_SAMPLE_NAME = 'MDS26 example';
export const MDS26_SAMPLE_LABEL = 'MDS26 GitHub PRs · opened → merged (calendar days)';

/** Illustrative team data for the Metrics chapter (start and finish days). */
export function createSampleRows() {
  return [
    { id: 'A', start: 1, finish: 3 },
    { id: 'B', start: 1, finish: 6 },
    { id: 'C', start: 2, finish: 4 },
    { id: 'D', start: 3, finish: 11 },
    { id: 'E', start: 4, finish: 6 },
    { id: 'F', start: 5, finish: 7 },
    { id: 'G', start: 6, finish: 9 },
    { id: 'H', start: 8, finish: 10 },
  ];
}

/** H12: real pull requests from this project, as a CSV export. */
export const MDS26_CSV = [
  'Key,Summary,Start date,Finish date',
  'PR-1,"H9 daily throughput and cycle-time charts",2026-11-14,2026-11-16',
  'PR-2,"H5 chapter checks and H8 glossary",2026-11-16,2026-11-16',
].join('\n');
