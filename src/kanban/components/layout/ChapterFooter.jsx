import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { useFlowLab } from '../../state/FlowLabContext.jsx';
import { selectCurrentChapter } from '../../state/selectors.js';

/** Back / complete buttons at the bottom of every chapter except the debrief. */
export function ChapterFooter() {
  const { state, actions } = useFlowLab();
  const { index, total } = selectCurrentChapter(state);
  const leadsToDebrief = index === total - 2;

  return (
    <div className="chapter-footer">
      <button type="button" onClick={() => actions.goToChapter(index - 1)} className="btn btn-secondary btn-tall">
        ← Back
      </button>
      <Blueprint as="button" type="button" onClick={actions.completeChapter} className="btn btn-primary btn-tall btn-wide">
        {leadsToDebrief ? 'Finish · +25 XP' : 'Complete chapter · +25 XP'}
      </Blueprint>
    </div>
  );
}
