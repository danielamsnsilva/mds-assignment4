import { FLOW_MEASURES } from '../config/content.js';
import { LAW_CHALLENGE, QUICK_CHECKS, SORT_STATEMENTS, finalQuizForPath } from '../config/questions.js';
import { BADGE_KEYS, REWARDS, THRESHOLDS } from '../config/rewards.js';
import { MDS26_SAMPLE_LABEL, MDS26_SAMPLE_NAME } from '../config/teamData.js';
import { BOARD_MESSAGES } from '../config/board.js';
import { CsvImporter } from '../domain/CsvImporter.js';
import { FlowSimulation } from '../domain/FlowSimulation.js';
import { KanbanBoard } from '../domain/KanbanBoard.js';
import { LearnerProgress } from '../domain/LearnerProgress.js';
import {
  createInitialBoard,
  createInitialQuiz,
  createInitialSimulation,
  createInitialTeamData,
} from './initialState.js';
import { selectCurrentChapter } from './selectors.js';

export const ActionTypes = {
  pathChosen: 'path/chosen',
  chapterSelected: 'chapter/selected',
  chapterCompleted: 'chapter/completed',
  progressRestarted: 'progress/restarted',

  cardMoved: 'board/cardMoved',
  cardUnblocked: 'board/cardUnblocked',
  boardReset: 'board/reset',

  measureRevealed: 'basics/measureRevealed',

  simConfigured: 'simulation/configured',
  simStepped: 'simulation/stepped',
  simRunToggled: 'simulation/runToggled',
  simTicked: 'simulation/ticked',
  simReset: 'simulation/reset',

  lawChanged: 'law/changed',
  lawAnswered: 'law/answered',

  teamRowEdited: 'teamData/rowEdited',
  csvImported: 'teamData/csvImported',
  csvImportFailed: 'teamData/csvImportFailed',

  sortAnswered: 'compare/sortAnswered',

  quizAnswered: 'quiz/answered',
  quizAdvanced: 'quiz/advanced',
  quizRestarted: 'quiz/restarted',

  quickCheckAnswered: 'quickCheck/answered',

  glossaryTermShown: 'glossary/termShown',
  glossaryOpened: 'glossary/opened',
  glossaryClosed: 'glossary/closed',
  glossaryTermClosed: 'glossary/termClosed',
  escapePressed: 'ui/escapePressed',

  certificateNameChanged: 'certificate/nameChanged',
  chatToggled: 'chat/toggled',
  chatOpened: 'chat/opened',
  chatClosed: 'chat/closed',
  toastDismissed: 'toast/dismissed',
};

const csvImporter = new CsvImporter();

/** Grants a reward once and shows a toast for it. */
export function grantReward(state, { key, amount, label }) {
  const ledger = new LearnerProgress(state.xp).grant(key, amount);
  if (!ledger) return state;
  const toast = { id: (state.ui.toast?.id ?? 0) + 1, label: label || `+${amount} XP` };
  return { ...state, xp: ledger, ui: { ...state.ui, toast } };
}

const updateUi = (state, changes) => ({ ...state, ui: { ...state.ui, ...changes } });

function clampChapter(state, index) {
  const { total } = selectCurrentChapter(state);
  return Math.max(0, Math.min(total - 1, index));
}

function applyBoardMove(state, outcome, cardId) {
  if (outcome.status === 'ignored') return state;
  if (outcome.status === 'rejected') {
    return {
      ...state,
      board: {
        ...state.board,
        message: outcome.message,
        wipLimitHits: state.board.wipLimitHits + (outcome.wipLimitHit ? 1 : 0),
      },
    };
  }
  const moves = state.board.moves + 1;
  const cleared = new KanbanBoard(outcome.cards).isCleared;
  const next = {
    ...state,
    board: {
      ...state.board,
      cards: outcome.cards,
      moves,
      message: cleared ? `Board cleared in ${moves} moves.` : `#${cardId} → ${outcome.column.name}.`,
    },
  };
  return cleared ? grantReward(next, REWARDS.badge(BADGE_KEYS.boardCleared)) : next;
}

function stepSimulation(state) {
  const simulation = new FlowSimulation(state.simulation.snapshot).step(state.simConfig);
  const next = { ...state, simulation: { ...state.simulation, snapshot: simulation.snapshot } };
  return simulation.meetsChallenge() ? grantReward(next, REWARDS.badge(BADGE_KEYS.flowMaster)) : next;
}

function importCsv(state, text, label) {
  try {
    const imported = csvImporter.import(text);
    const skipped = imported.skipped ? `; skipped ${imported.skipped} without both dates` : '';
    return {
      ...state,
      teamData: {
        rows: imported.rows,
        sourceLabel: label === MDS26_SAMPLE_NAME ? MDS26_SAMPLE_LABEL : `${label} · ${imported.sourceLabel}`,
        importStatus: { message: `Imported ${imported.rows.length} work items${skipped}.`, isError: false },
      },
    };
  } catch (error) {
    return csvFailed(state, error.message || 'Could not import this CSV.');
  }
}

const csvFailed = (state, message) => ({
  ...state,
  teamData: { ...state.teamData, importStatus: { message, isError: true } },
});

export function flowLabReducer(state, action) {
  switch (action.type) {
    // — navigation and progress —
    case ActionTypes.pathChosen:
      return { ...state, path: action.path, chapterIndex: 1, quiz: createInitialQuiz() };

    case ActionTypes.chapterSelected:
      return { ...state, chapterIndex: clampChapter(state, action.index) };

    case ActionTypes.chapterCompleted: {
      const { index, key } = selectCurrentChapter(state);
      const next = grantReward(state, REWARDS.chapterCompleted(key));
      return { ...next, chapterIndex: clampChapter(next, index + 1) };
    }

    case ActionTypes.progressRestarted:
      return {
        ...state,
        path: null,
        chapterIndex: 0,
        xp: {},
        board: createInitialBoard(),
        revealedMeasures: {},
        sortAnswers: {},
        lawAnswer: null,
        teamData: createInitialTeamData(),
        quiz: createInitialQuiz(),
        quickChecks: {},
        simulation: createInitialSimulation(),
      };

    // — board —
    case ActionTypes.cardMoved: {
      const board = new KanbanBoard(state.board.cards);
      const outcome =
        action.direction != null
          ? board.move(action.cardId, action.direction)
          : board.moveTo(action.cardId, action.column);
      return applyBoardMove(state, outcome, action.cardId);
    }

    case ActionTypes.cardUnblocked:
      return {
        ...state,
        board: {
          ...state.board,
          cards: new KanbanBoard(state.board.cards).unblock(action.cardId),
          message: `Team swarmed on #${action.cardId}. It can move again.`,
        },
      };

    case ActionTypes.boardReset:
      return { ...state, board: { ...createInitialBoard(), message: BOARD_MESSAGES.reset } };

    // — basics —
    case ActionTypes.measureRevealed: {
      const revealedMeasures = { ...state.revealedMeasures, [action.index]: true };
      const next = { ...state, revealedMeasures };
      return Object.keys(revealedMeasures).length >= FLOW_MEASURES.length
        ? grantReward(next, REWARDS.allMeasuresRevealed())
        : next;
    }

    // — simulator —
    case ActionTypes.simConfigured:
      return { ...state, simConfig: { ...state.simConfig, [action.field]: action.value } };

    case ActionTypes.simStepped:
      return stepSimulation(state);

    case ActionTypes.simRunToggled:
      return state.simulation.running
        ? { ...state, simulation: { ...state.simulation, running: false } }
        : {
            ...state,
            simulation: { ...state.simulation, running: true, runUntilDay: state.simulation.snapshot.day + 30 },
          };

    case ActionTypes.simTicked:
      if (!state.simulation.running) return state;
      if (state.simulation.snapshot.day >= state.simulation.runUntilDay) {
        return { ...state, simulation: { ...state.simulation, running: false } };
      }
      return stepSimulation(state);

    case ActionTypes.simReset:
      return { ...state, simulation: createInitialSimulation() };

    // — Little's Law —
    case ActionTypes.lawChanged:
      return { ...state, littlesLaw: { ...state.littlesLaw, [action.field]: action.value } };

    case ActionTypes.lawAnswered: {
      if (state.lawAnswer != null) return state;
      const next = { ...state, lawAnswer: action.option };
      return action.option === LAW_CHALLENGE.answer ? grantReward(next, REWARDS.badge(BADGE_KEYS.lawKeeper)) : next;
    }

    // — team data —
    case ActionTypes.teamRowEdited:
      return {
        ...state,
        teamData: {
          ...state.teamData,
          rows: state.teamData.rows.map((row, i) => (i === action.index ? { ...row, [action.field]: action.value } : row)),
        },
      };

    case ActionTypes.csvImported:
      return importCsv(state, action.text, action.label);

    case ActionTypes.csvImportFailed:
      return csvFailed(state, action.message);

    // — Kanban vs Scrum —
    case ActionTypes.sortAnswered: {
      if (state.sortAnswers[action.statement] != null) return state;
      const sortAnswers = { ...state.sortAnswers, [action.statement]: action.option };
      let next = { ...state, sortAnswers };
      if (action.option === SORT_STATEMENTS[action.statement].answer) {
        next = grantReward(next, REWARDS.sortStatementCorrect(action.statement));
      }
      const correct = SORT_STATEMENTS.filter((s, i) => sortAnswers[i] === s.answer).length;
      return correct >= THRESHOLDS.sorterCorrectAnswers ? grantReward(next, REWARDS.badge(BADGE_KEYS.sorter)) : next;
    }

    // — final quiz —
    case ActionTypes.quizAnswered: {
      const { quiz } = state;
      if (quiz.pick != null) return state;
      const { questions } = finalQuizForPath(state.path);
      const question = questions[Math.min(quiz.index, questions.length - 1)];
      const isCorrect = action.option === question.answer;
      const next = { ...state, quiz: { ...quiz, pick: action.option, score: quiz.score + (isCorrect ? 1 : 0) } };
      return isCorrect ? grantReward(next, REWARDS.quizQuestionCorrect(state.path, quiz.index)) : next;
    }

    case ActionTypes.quizAdvanced: {
      const { quiz } = state;
      const { questions } = finalQuizForPath(state.path);
      if (quiz.index < questions.length - 1) {
        return { ...state, quiz: { ...quiz, index: quiz.index + 1, pick: null } };
      }
      const next = { ...state, quiz: { ...quiz, done: true } };
      return quiz.score >= THRESHOLDS.quizAceCorrectAnswers ? grantReward(next, REWARDS.badge(BADGE_KEYS.quizAce)) : next;
    }

    case ActionTypes.quizRestarted:
      return { ...state, quiz: createInitialQuiz() };

    // — quick checks —
    case ActionTypes.quickCheckAnswered: {
      const id = `${action.chapter}:${action.question}`;
      if (state.quickChecks[id] != null) return state;
      const next = { ...state, quickChecks: { ...state.quickChecks, [id]: action.option } };
      const question = QUICK_CHECKS[action.chapter][action.question];
      return action.option === question.answer ? grantReward(next, REWARDS.quickCheckCorrect(id)) : next;
    }

    // — glossary, chat, certificate, toast —
    case ActionTypes.glossaryTermShown:
      return updateUi(state, { glossaryTerm: action.key });
    case ActionTypes.glossaryOpened:
      return updateUi(state, { glossaryOpen: true, glossaryTerm: null });
    case ActionTypes.glossaryClosed:
      return updateUi(state, { glossaryOpen: false });
    case ActionTypes.glossaryTermClosed:
      return updateUi(state, { glossaryTerm: null });
    case ActionTypes.escapePressed:
      return state.ui.glossaryOpen || state.ui.glossaryTerm
        ? updateUi(state, { glossaryOpen: false, glossaryTerm: null })
        : state;

    case ActionTypes.certificateNameChanged:
      return updateUi(state, { certificateName: String(action.name).slice(0, 40) });

    case ActionTypes.chatToggled:
      return updateUi(state, { chatOpen: !state.ui.chatOpen });
    case ActionTypes.chatOpened:
      return updateUi(state, { chatOpen: true });
    case ActionTypes.chatClosed:
      return updateUi(state, { chatOpen: false });

    case ActionTypes.toastDismissed:
      return state.ui.toast?.id === action.id ? updateUi(state, { toast: null }) : state;

    default:
      return state;
  }
}
