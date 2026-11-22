/** XP, levels, ranks and badges. Ledger keys match the saved progress format. */

export const XP_PER_LEVEL = 150;

export const RANKS = ['Card Mover', 'Flow Apprentice', 'WIP Wrangler', 'Flow Engineer', 'Kanban Coach'];

export const BADGES = [
  { key: 'b:board', name: 'Stop Starting', how: 'Clear the Kanban board', amount: 100 },
  { key: 'b:flow', name: 'Flow Master', how: 'Beat the simulator challenge', amount: 100 },
  { key: 'b:bottleneck', name: 'Bottleneck Buster', how: 'Find and fix the bottleneck (Path B)', amount: 80 },
  { key: 'b:law', name: 'Law Keeper', how: "Solve the Little's Law challenge", amount: 40 },
  { key: 'b:sort', name: 'Sorter', how: '6+ correct in Kanban vs Scrum', amount: 50 },
  { key: 'b:scrumban', name: 'Flow Sprinter', how: '3+ correct in the Sprint flow challenge', amount: 60 },
  { key: 'b:quiz', name: 'Quiz Ace', how: '5+ correct in the final quiz', amount: 60 },
];

export const BADGE_KEYS = {
  boardCleared: 'b:board',
  flowMaster: 'b:flow',
  bottleneckBuster: 'b:bottleneck',
  lawKeeper: 'b:law',
  sorter: 'b:sort',
  flowSprinter: 'b:scrumban',
  quizAce: 'b:quiz',
};

export const THRESHOLDS = {
  sorterCorrectAnswers: 6,
  scrumbanCorrectAnswers: 3,
  quizAceCorrectAnswers: 5,
};

/** Each reward is `{ key, amount, label? }`; without a label the toast shows "+N XP". */
export const REWARDS = {
  chapterCompleted: (chapterKey) => ({ key: `ch:${chapterKey}`, amount: 25 }),
  allMeasuresRevealed: () => ({ key: 'basics:reveal', amount: 30 }),
  sortStatementCorrect: (index) => ({ key: `s:${index}`, amount: 10 }),
  sprintScenarioCorrect: (index) => ({ key: `sb:${index}`, amount: 10 }),
  quizQuestionCorrect: (pathId, index) => ({ key: `q:${pathId}:${index}`, amount: 20 }),
  quickCheckCorrect: (questionId) => ({ key: `qc:${questionId}`, amount: 15 }),
  badge: (badgeKey) => {
    const badge = BADGES.find((b) => b.key === badgeKey);
    return { key: badge.key, amount: badge.amount, label: `Badge: ${badge.name} · +${badge.amount} XP` };
  },
};
