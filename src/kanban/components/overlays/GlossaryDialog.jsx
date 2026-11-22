import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { GLOSSARY } from '../../config/glossary.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';

/** Full glossary. Closes on the backdrop, the ✕ button or Escape. */
export function GlossaryDialog() {
  const { state, actions } = useFlowLab();
  if (!state.ui.glossaryOpen) return null;

  return (
    <div className="dialog-overlay" onClick={actions.closeGlossary}>
      <Blueprint
        role="dialog"
        aria-label="Glossary"
        className="glossary-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="overlay-header">
          <h3>Glossary</h3>
          <button type="button" onClick={actions.closeGlossary} className="btn btn-ghost btn-square-md" aria-label="Close glossary">
            ✕
          </button>
        </div>
        <p className="note glossary-dialog__intro">
          Underlined terms in the chapters open these definitions. Sources: The Kanban Guide (2020), Vacanti (2015),
          Anderson (2010), Little (1961).
        </p>
        <dl className="glossary-dialog__list">
          {GLOSSARY.map((entry) => (
            <div key={entry.key} className="glossary-dialog__entry">
              <dt>{entry.term}</dt>
              <dd>{entry.definition}</dd>
            </div>
          ))}
        </dl>
      </Blueprint>
    </div>
  );
}
