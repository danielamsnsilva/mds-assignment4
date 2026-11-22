/** Workflow columns of the practice board. A WIP limit of 0 means "no limit". */
export const BOARD_COLUMNS = [
  { name: 'To do', wipLimit: 0 },
  { name: 'In progress', wipLimit: 3 },
  { name: 'Review', wipLimit: 2 },
  { name: 'Done', wipLimit: 0 },
];

/** H10: "today" on the board, used to compute work item age. */
export const BOARD_TODAY = 10;

/** H10: start day of the cards that begin the exercise already in progress. */
export const DEFAULT_START_DAYS = { 101: 2, 102: 6, 103: 8, 104: 4 };

export const BOARD_MESSAGES = {
  initial: 'Tip: In progress is full (3/3). Finish something before starting more.',
  reset: 'Board reset. In progress is full (3/3).',
};

/**
 * Cards at the start of the exercise. `startDay` is left undefined so the
 * board falls back to DEFAULT_START_DAYS until a card is moved.
 */
export function createInitialCards() {
  return [
    { id: 101, title: 'Password reset email', type: 'Feature', column: 1, blocked: true },
    { id: 102, title: 'Fix checkout rounding bug', type: 'Bug', column: 1, blocked: false },
    { id: 103, title: 'Add CSV export', type: 'Feature', column: 1, blocked: false },
    { id: 104, title: 'Update privacy copy', type: 'Content', column: 2, blocked: false },
    { id: 105, title: 'Search filters', type: 'Feature', column: 0, blocked: false },
    { id: 106, title: 'Upgrade build pipeline', type: 'Tech', column: 0, blocked: false },
    { id: 107, title: 'Dark mode tokens', type: 'Feature', column: 0, blocked: false },
    { id: 108, title: 'Crash on empty cart', type: 'Bug', column: 0, blocked: false },
  ];
}
