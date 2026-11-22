/** Every chapter of the field manual, keyed by id. */
export const CHAPTERS = {
  start: { title: 'Choose your path', shortTitle: 'Path' },
  basics: { title: 'Kanban in five minutes', shortTitle: 'Basics' },
  board: { title: 'Run the board', shortTitle: 'Board' },
  flow: { title: 'Flow simulator', shortTitle: 'Simulator' },
  metrics: { title: 'Measure flow', shortTitle: 'Metrics' },
  compare: { title: 'Kanban vs Scrum', shortTitle: 'vs Scrum' },
  quiz: { title: 'Final quiz', shortTitle: 'Quiz' },
  finish: { title: 'Debrief', shortTitle: 'Debrief' },
};

/** The two learning paths and the chapters each one visits, in order. */
export const LEARNING_PATHS = {
  beginner: {
    id: 'beginner',
    label: 'Path A · Beginner',
    kicker: 'Path A · 8 chapters',
    name: 'Beginner',
    description:
      'New to Kanban? Learn the practices and four flow metrics before trying the board and challenges.',
    cta: 'Start path A →',
    chapters: ['start', 'basics', 'board', 'flow', 'metrics', 'compare', 'quiz', 'finish'],
  },
  advanced: {
    id: 'advanced',
    label: 'Path B · Advanced',
    kicker: 'Path B · 7 chapters',
    name: 'Advanced',
    description:
      "Already run a board? Skip ahead to WIP control, cumulative flow, Little's Law, and percentile forecasts.",
    cta: 'Start path B →',
    chapters: ['start', 'board', 'flow', 'metrics', 'compare', 'quiz', 'finish'],
  },
};

export const NO_PATH_LABEL = 'No path yet';

/** Until a path is chosen, the beginner chapter list is shown. */
export function getLearningPath(pathId) {
  return pathId === 'advanced' ? LEARNING_PATHS.advanced : LEARNING_PATHS.beginner;
}

export function chaptersForPath(pathId) {
  return getLearningPath(pathId).chapters;
}
