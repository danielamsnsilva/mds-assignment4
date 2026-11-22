import { BOARD_MESSAGES, createInitialCards } from '../config/board.js';
import { SAMPLE_ROWS_LABEL, createSampleRows } from '../config/teamData.js';
import { FlowSimulation } from '../domain/FlowSimulation.js';
import { BOTTLENECK_CHALLENGE, StageFlowSimulation } from '../domain/StageFlowSimulation.js';

export const createInitialBoard = () => ({
  cards: createInitialCards(),
  moves: 0,
  wipLimitHits: 0,
  message: BOARD_MESSAGES.initial,
});

export const createInitialQuiz = () => ({ index: 0, pick: null, score: 0, done: false });

export const createInitialTeamData = () => ({
  rows: createSampleRows(),
  sourceLabel: SAMPLE_ROWS_LABEL,
  importStatus: null, // { message, isError }
});

export const createInitialSimulation = () => ({
  snapshot: FlowSimulation.initialSnapshot(),
  running: false,
  runUntilDay: 0,
});

/** H11: the multi-stage simulator of the "Find the bottleneck" chapter. */
export const createInitialStageSimulation = () => ({
  snapshot: StageFlowSimulation.initialSnapshot(),
  running: false,
  runUntilDay: 0,
});

export const createDefaultStaffing = () => ({ ...BOTTLENECK_CHALLENGE.defaultStaffing });

/** The whole application state. Everything except `ui`, `simulation` and `stageSimulation` is saved. */
export function createInitialState() {
  return {
    path: null,
    chapterIndex: 0,
    xp: {},
    board: createInitialBoard(),
    revealedMeasures: {},
    sortAnswers: {},
    lawAnswer: null,
    littlesLaw: { wip: 12, throughput: 3 },
    teamData: createInitialTeamData(),
    quiz: createInitialQuiz(),
    quickChecks: {},
    simConfig: { arrivalRate: 2, capacity: 5, wipLimit: 4 },
    simulation: createInitialSimulation(),
    stageConfig: createDefaultStaffing(),
    stageSimulation: createInitialStageSimulation(),
    bottleneckGuess: null, // { stage, correct }
    ui: {
      glossaryOpen: false,
      glossaryTerm: null,
      chatOpen: false,
      toast: null, // { id, label }
      certificateName: '',
    },
  };
}
