export const STORAGE_KEY = 'flowlab-v1';

/**
 * Saves learner progress in localStorage.
 *
 * The saved format ("flowlab-v1") is the one the earlier version of the app
 * wrote, so learners keep their progress. This class maps it to and from the
 * in-memory state.
 */
export class ProgressStorage {
  constructor({ key = STORAGE_KEY, storage = defaultStorage() } = {}) {
    this.key = key;
    this.storage = storage;
  }

  load(defaults) {
    try {
      const stored = JSON.parse(this.storage?.getItem(this.key) || 'null');
      return stored && typeof stored === 'object' ? ProgressStorage.fromStored(stored, defaults) : defaults;
    } catch {
      return defaults;
    }
  }

  save(state) {
    try {
      this.storage?.setItem(this.key, JSON.stringify(ProgressStorage.toStored(state)));
    } catch {
      // Storage full or blocked (private mode): progress is just not saved.
    }
  }

  static toStored(state) {
    const { board, teamData, littlesLaw, quiz, simConfig } = state;
    return {
      path: state.path,
      ch: state.chapterIndex,
      xp: state.xp,
      board: board.cards.map((card) => ({
        id: card.id,
        t: card.title,
        type: card.type,
        col: card.column,
        blocked: card.blocked,
        st: card.startDay,
      })),
      moves: board.moves,
      hits: board.wipLimitHits,
      revealed: state.revealedMeasures,
      sortAns: state.sortAnswers,
      lawPick: state.lawAnswer,
      rows: teamData.rows.map((row) => ({ id: row.id, s: row.start, f: row.finish })),
      rowsLabel: teamData.sourceLabel,
      law: { wip: littlesLaw.wip, tp: littlesLaw.throughput },
      quiz: { i: quiz.index, pick: quiz.pick, score: quiz.score, done: quiz.done },
      cfg: { arrival: simConfig.arrivalRate, cap: simConfig.capacity, wip: simConfig.wipLimit },
      qc: state.quickChecks,
    };
  }

  /** Values missing from the saved data keep their defaults. */
  static fromStored(stored, defaults) {
    const has = (key) => stored[key] !== undefined;
    return {
      ...defaults,
      path: has('path') ? stored.path : defaults.path,
      chapterIndex: has('ch') ? stored.ch : defaults.chapterIndex,
      xp: has('xp') ? stored.xp : defaults.xp,
      board: {
        ...defaults.board,
        cards: has('board')
          ? stored.board.map((card) => ({
              id: card.id,
              title: card.t,
              type: card.type,
              column: card.col,
              blocked: Boolean(card.blocked),
              startDay: card.st,
            }))
          : defaults.board.cards,
        moves: has('moves') ? stored.moves : defaults.board.moves,
        wipLimitHits: has('hits') ? stored.hits : defaults.board.wipLimitHits,
      },
      revealedMeasures: has('revealed') ? stored.revealed : defaults.revealedMeasures,
      sortAnswers: has('sortAns') ? stored.sortAns : defaults.sortAnswers,
      lawAnswer: has('lawPick') ? stored.lawPick : defaults.lawAnswer,
      teamData: {
        ...defaults.teamData,
        rows: has('rows')
          ? stored.rows.map((row) => ({ id: row.id, start: row.s, finish: row.f }))
          : defaults.teamData.rows,
        sourceLabel: has('rowsLabel') ? stored.rowsLabel : defaults.teamData.sourceLabel,
      },
      littlesLaw: has('law') ? { wip: stored.law.wip, throughput: stored.law.tp } : defaults.littlesLaw,
      quiz: has('quiz')
        ? { index: stored.quiz.i, pick: stored.quiz.pick, score: stored.quiz.score, done: stored.quiz.done }
        : defaults.quiz,
      simConfig: has('cfg')
        ? { arrivalRate: stored.cfg.arrival, capacity: stored.cfg.cap, wipLimit: stored.cfg.wip }
        : defaults.simConfig,
      quickChecks: has('qc') ? stored.qc : defaults.quickChecks,
    };
  }
}

function defaultStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
