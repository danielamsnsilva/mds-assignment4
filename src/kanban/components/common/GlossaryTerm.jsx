import { findGlossaryEntry } from '../../config/glossary.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';

/**
 * H8: an inline glossary term. Hovering or focusing shows a tooltip;
 * clicking opens the definition popover.
 */
export function GlossaryTerm({ term, children }) {
  const { actions } = useFlowLab();
  const entry = findGlossaryEntry(term);
  if (!entry) return children;

  return (
    <button
      type="button"
      className="gl"
      data-def={`${entry.term}: ${entry.definition}`}
      onClick={() => actions.showGlossaryTerm(term)}
    >
      {children}
    </button>
  );
}
