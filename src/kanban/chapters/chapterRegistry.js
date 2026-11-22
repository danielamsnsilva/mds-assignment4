import { BasicsChapter } from './basics/BasicsChapter.jsx';
import { BoardChapter } from './board/BoardChapter.jsx';
import { BottleneckChapter } from './bottleneck/BottleneckChapter.jsx';
import { CompareChapter } from './compare/CompareChapter.jsx';
import { DebriefChapter } from './debrief/DebriefChapter.jsx';
import { MetricsChapter } from './metrics/MetricsChapter.jsx';
import { QuizChapter } from './quiz/QuizChapter.jsx';
import { SimulatorChapter } from './simulator/SimulatorChapter.jsx';
import { StartChapter } from './start/StartChapter.jsx';

/** Component that renders each chapter id from config/chapters.js. */
export const CHAPTER_COMPONENTS = {
  start: StartChapter,
  basics: BasicsChapter,
  board: BoardChapter,
  flow: SimulatorChapter,
  bottleneck: BottleneckChapter,
  metrics: MetricsChapter,
  compare: CompareChapter,
  quiz: QuizChapter,
  finish: DebriefChapter,
};
