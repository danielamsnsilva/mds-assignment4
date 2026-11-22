import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { findGlossaryEntry } from '../../config/glossary.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';

/** Definition of the glossary term the learner just clicked. */
export function GlossaryPopover() {
  const { state, actions } = useFlowLab();
  const entry = findGlossaryEntry(state.ui.glossaryTerm);
  if (!entry || state.ui.glossaryOpen) return null;

  return (
    <Blueprint role="dialog" aria-label={entry.term} className="glossary-popover">
      <div className="overlay-header">
        <span className="glossary-popover__term">{entry.term}</span>
        <button
          type="button"
          onClick={actions.closeGlossaryTerm}
          className="btn btn-ghost btn-square-sm"
          aria-label="Close definition"
        >
          ✕
        </button>
      </div>
      <p className="glossary-popover__definition">{entry.definition}</p>
      <div>
        <button type="button" onClick={actions.openGlossary} className="btn btn-ghost glossary-popover__all">
          See all terms in the glossary →
        </button>
      </div>
    </Blueprint>
  );
}
