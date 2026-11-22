import { LEARNING_PATHS, NO_PATH_LABEL } from '../../config/chapters.js';
import { BADGES } from '../../config/rewards.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';
import { selectCurrentChapter, selectProgress } from '../../state/selectors.js';
import { ProgressBar } from '../common/ProgressBar.jsx';
import { ChapterNav } from './ChapterNav.jsx';

function LearnerStatus() {
  const { state, actions } = useFlowLab();
  const progress = selectProgress(state);
  const pathLabel = LEARNING_PATHS[state.path]?.label ?? NO_PATH_LABEL;

  return (
    <div className="app-header__status">
      <span className="tag tag-accent">{pathLabel}</span>
      <span className="app-header__xp">
        <span className="app-header__figure">{progress.xp} XP</span>
        <span className="app-header__caption">
          Lv {progress.level} · {progress.rank}
        </span>
      </span>
      <span className="app-header__figure">
        {progress.earnedBadges.length}/{BADGES.length}{' '}
        <span className="app-header__caption app-header__caption--inline">badges</span>
      </span>
      <button type="button" onClick={actions.openGlossary} className="btn btn-secondary app-header__glossary">
        Glossary
      </button>
    </div>
  );
}

export function AppHeader() {
  const { state } = useFlowLab();
  const { index, total } = selectCurrentChapter(state);

  return (
    <header className="app-header">
      <div className="app-header__bar">
        <div className="app-header__brand">
          <span className="app-header__logo">FLOW/LAB</span>
          <span className="app-header__tagline">Kanban &amp; flow metrics</span>
        </div>
        <LearnerStatus />
      </div>
      <ProgressBar percent={(index / (total - 1)) * 100} animated />
      <ChapterNav />
    </header>
  );
}
