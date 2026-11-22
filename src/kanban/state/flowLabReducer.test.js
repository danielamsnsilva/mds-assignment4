import { describe, expect, it } from 'vitest';
import { ActionTypes as T, flowLabReducer } from './flowLabReducer.js';
import { createInitialState } from './initialState.js';
import { ProgressStorage } from './ProgressStorage.js';
import { ReviewPlanner } from '../domain/ReviewPlanner.js';
import { chaptersForPath } from '../config/chapters.js';

const reduce = (state, ...actions) => actions.reduce(flowLabReducer, state);
const beginner = () => reduce(createInitialState(), { type: T.pathChosen, path: 'beginner' });

describe('flowLabReducer', () => {
  it('grants chapter XP once and moves to the next chapter', () => {
    const state = reduce(beginner(), { type: T.chapterCompleted }, { type: T.chapterSelected, index: 1 }, { type: T.chapterCompleted });
    expect(state.xp).toEqual({ 'ch:basics': 25 });
    expect(state.chapterIndex).toBe(2);
    expect(state.ui.toast.label).toBe('+25 XP');
  });

  it('keeps the chapter index inside the path', () => {
    expect(reduce(beginner(), { type: T.chapterSelected, index: 99 }).chapterIndex).toBe(7);
    expect(reduce(beginner(), { type: T.chapterSelected, index: -3 }).chapterIndex).toBe(0);
  });

  it('counts WIP limit hits on the board', () => {
    const state = reduce(beginner(), { type: T.cardMoved, cardId: 105, direction: 1 });
    expect(state.board.wipLimitHits).toBe(1);
    expect(state.board.moves).toBe(0);
  });

  it('awards the Sorter badge after 6 correct statements', () => {
    const answers = [1, 0, 1, 0, 2, 0];
    const state = reduce(
      beginner(),
      ...answers.map((option, statement) => ({ type: T.sortAnswered, statement, option })),
    );
    expect(state.xp['b:sort']).toBe(50);
    expect(state.ui.toast.label).toBe('Badge: Sorter · +50 XP');
  });

  it('ignores a second answer to the same question', () => {
    const state = reduce(
      beginner(),
      { type: T.quizAnswered, option: 1 },
      { type: T.quizAnswered, option: 0 },
    );
    expect(state.quiz).toMatchObject({ pick: 1, score: 0 });
  });

  it('awards Quiz Ace when the quiz ends with 5+ correct answers', () => {
    const correct = [0, 1, 2, 1, 0, 1];
    let state = beginner();
    correct.forEach((option) => {
      state = reduce(state, { type: T.quizAnswered, option }, { type: T.quizAdvanced });
    });
    expect(state.quiz).toMatchObject({ done: true, score: 6 });
    expect(state.xp['b:quiz']).toBe(60);
  });

  it('reports a CSV error without losing the current rows', () => {
    const before = beginner();
    const state = reduce(before, { type: T.csvImported, text: 'nonsense', label: 'x.csv' });
    expect(state.teamData.rows).toEqual(before.teamData.rows);
    expect(state.teamData.importStatus.isError).toBe(true);
  });

  it('stops a 30-day run at the target day', () => {
    let state = reduce(beginner(), { type: T.simRunToggled });
    for (let i = 0; i < 31; i++) state = reduce(state, { type: T.simTicked });
    expect(state.simulation.snapshot.day).toBe(30);
    expect(state.simulation.running).toBe(false);
  });

  it('closes the glossary with Escape', () => {
    const state = reduce(beginner(), { type: T.glossaryTermShown, key: 'wip' }, { type: T.escapePressed });
    expect(state.ui.glossaryTerm).toBeNull();
  });
});

describe('ProgressStorage', () => {
  it('round-trips the saved v1 format', () => {
    const state = reduce(beginner(), { type: T.cardMoved, cardId: 101, direction: -1 }, { type: T.lawAnswered, option: 0 });
    const stored = ProgressStorage.toStored(state);
    expect(stored.board[0]).toMatchObject({ id: 101, t: 'Password reset email', col: 0, st: null });
    const restored = ProgressStorage.fromStored(JSON.parse(JSON.stringify(stored)), createInitialState());
    expect(ProgressStorage.toStored(restored)).toEqual(JSON.parse(JSON.stringify(stored)));
  });

  it('falls back to defaults when storage is empty or broken', () => {
    const defaults = createInitialState();
    const broken = { getItem: () => '{not json', setItem: () => {} };
    expect(new ProgressStorage({ storage: broken }).load(defaults)).toBe(defaults);
    expect(new ProgressStorage({ storage: null }).load(defaults)).toBe(defaults);
  });
});

describe('ReviewPlanner', () => {
  it('groups wrong answers by chapter in path order', () => {
    const state = reduce(
      beginner(),
      { type: T.sortAnswered, statement: 0, option: 0 },
      { type: T.quickCheckAnswered, chapter: 'basics', question: 0, option: 0 },
      { type: T.lawAnswered, option: 2 },
    );
    const plan = new ReviewPlanner({
      pathId: state.path,
      quickChecks: state.quickChecks,
      sortAnswers: state.sortAnswers,
      lawAnswer: state.lawAnswer,
      quiz: state.quiz,
      xpLedger: state.xp,
    }).plan(chaptersForPath('beginner'));
    expect(plan.answeredCount).toBe(3);
    expect(plan.groups.map((g) => g.chapter)).toEqual(['basics', 'metrics', 'compare']);
  });
});
