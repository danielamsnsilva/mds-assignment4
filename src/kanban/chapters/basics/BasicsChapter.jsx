import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { FLOW_MEASURES, KANBAN_PRACTICES, SOURCES } from '../../config/content.js';
import { GlossaryTerm } from '../../components/common/GlossaryTerm.jsx';
import { SectionHeader } from '../../components/common/SectionHeader.jsx';
import { useFlowLab } from '../../state/FlowLabContext.jsx';

function PracticeCard({ number, practice }) {
  return (
    <Blueprint className="practice-card">
      <div className="practice-card__number">{String(number).padStart(2, '0')}</div>
      <div className="practice-card__title">{practice.title}</div>
      <p className="practice-card__text">{practice.text}</p>
    </Blueprint>
  );
}

/** A flow metric card that hides its definition until selected. */
function MeasureCard({ measure, revealed, onReveal }) {
  return (
    <Blueprint
      as="button"
      type="button"
      onClick={onReveal}
      aria-pressed={revealed}
      className={`measure-card${revealed ? ' is-revealed' : ''}`}
    >
      <span className="measure-card__name">{measure.name}</span>
      <span className="measure-card__text">{revealed ? measure.text : 'Select to reveal the definition.'}</span>
    </Blueprint>
  );
}

export function BasicsChapter() {
  const { state, actions } = useFlowLab();
  const revealedCount = Object.keys(state.revealedMeasures).length;

  return (
    <section className="chapter chapter--spacious">
      <p className="lead lead--intro">
        Kanban is a strategy for optimizing the flow of value. Work is made visible on a board, the amount of{' '}
        <GlossaryTerm term="wip">work in progress</GlossaryTerm> is limited, and new work is{' '}
        <GlossaryTerm term="pull">pulled</GlossaryTerm> only when there is capacity for it.
      </p>

      <div>
        <h4>The three Kanban practices</h4>
        <div className="card-grid card-grid--practices">
          {KANBAN_PRACTICES.map((practice, i) => (
            <PracticeCard key={practice.title} number={i + 1} practice={practice} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader
          title="The four flow metrics"
          note={`Select each card to reveal its definition · ${revealedCount}/${FLOW_MEASURES.length}`}
        />
        <div className="card-grid card-grid--measures">
          {FLOW_MEASURES.map((measure, i) => (
            <MeasureCard
              key={measure.name}
              measure={measure}
              revealed={Boolean(state.revealedMeasures[i])}
              onReveal={() => actions.revealMeasure(i)}
            />
          ))}
        </div>
        <p className="body-note basics__lead-vs-cycle">
          <strong>
            <GlossaryTerm term="lead">Lead time</GlossaryTerm> vs <GlossaryTerm term="cycle">cycle time</GlossaryTerm>.
          </strong>{' '}
          Cycle time starts when the team starts an item. Lead time starts when the item is requested, so it also
          includes the time spent waiting in the backlog.
        </p>
      </div>

      <p className="note">
        Source:{' '}
        <a href={SOURCES.kanbanGuide} target="_blank" rel="noopener noreferrer">
          The Kanban Guide, version 2025.5 (May 2025)
        </a>
        .
      </p>
    </section>
  );
}
