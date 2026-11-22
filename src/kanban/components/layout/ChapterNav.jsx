import { CHAPTERS } from '../../config/chapters.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';
import { selectCurrentChapter, selectProgress } from '../../state/selectors.js';

export const chapterNumber = (index) => String(index).padStart(2, '0');

/** Tabs for every chapter of the path. Only the first one is open before a path is chosen. */
export function ChapterNav() {
  const { state, actions } = useFlowLab();
  const { keys, index: currentIndex } = selectCurrentChapter(state);
  const progress = selectProgress(state);

  return (
    <nav aria-label="Learning path" className="chapter-nav">
      {keys.map((key, index) => {
        const isCurrent = index === currentIndex;
        const isComplete = progress.isChapterComplete(key);
        const className = ['chapter-nav__step', isComplete && 'is-complete', isCurrent && 'is-current']
          .filter(Boolean)
          .join(' ');
        return (
          <button
            key={key}
            type="button"
            className={className}
            aria-current={isCurrent ? 'step' : undefined}
            onClick={() => {
              if (index === 0 || state.path) actions.goToChapter(index);
            }}
          >
            <span className="chapter-nav__number">{chapterNumber(index)}</span>
            <span>{CHAPTERS[key].shortTitle}</span>
            <span>{isComplete ? '✓' : ''}</span>
          </button>
        );
      })}
    </nav>
  );
}
