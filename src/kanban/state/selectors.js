import { chaptersForPath } from '../config/chapters.js';
import { finalQuizForPath } from '../config/questions.js';
import { KanbanBoard } from '../domain/KanbanBoard.js';
import { LearnerProgress } from '../domain/LearnerProgress.js';
import { FlowSimulation } from '../domain/FlowSimulation.js';
import { StageFlowSimulation } from '../domain/StageFlowSimulation.js';
import { TeamCycleData } from '../domain/TeamCycleData.js';

/** Derived data, computed from the state rather than stored in it. */

export function selectCurrentChapter(state) {
  const keys = chaptersForPath(state.path);
  const index = Math.min(state.chapterIndex, keys.length - 1);
  return { keys, index, key: keys[index], total: keys.length };
}

export const selectProgress = (state) => new LearnerProgress(state.xp);

export const selectBoard = (state) => new KanbanBoard(state.board.cards);

export const selectSimulation = (state) => new FlowSimulation(state.simulation.snapshot);

export const selectStageSimulation = (state) => new StageFlowSimulation(state.stageSimulation.snapshot);

export const selectTeamData = (state) => new TeamCycleData(state.teamData.rows);

export const selectFinalQuiz = (state) => finalQuizForPath(state.path);
