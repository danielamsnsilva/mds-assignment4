import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { GlossaryTerm } from '../../components/common/GlossaryTerm.jsx';
import { SectionHeader } from '../../components/common/SectionHeader.jsx';
import { DEFINITION_OF_WORKFLOW, SCRUM_EVENTS_FLOW, SCRUMBAN_SUMMARY, SOURCES } from '../../config/content.js';
import { SPRINT_SCENARIOS } from '../../config/questions.js';
import { BADGE_KEYS, BADGES, THRESHOLDS } from '../../config/rewards.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';
import { SprintScenarioCard } from './SprintScenarioCard.jsx';

const FLOW_SPRINTER = BADGES.find((badge) => badge.key === BADGE_KEYS.flowSprinter);

function WorkflowElementCard({ number, element }) {
  return (
    <Blueprint className="practice-card">
      <div className="practice-card__number">{String(number).padStart(2, '0')}</div>
      <div className="practice-card__title">{element.title}</div>
      <p className="practice-card__text">{element.text}</p>
    </Blueprint>
  );
}

function ScrumEventsTable() {
  return (
    <div role="region" aria-label="Flow in the Scrum events" tabIndex={0} className="table-scroll">
      <h4 id="scrum-events-heading">Flow through the Scrum events</h4>
      <table className="table scrumban-table" aria-labelledby="scrum-events-heading">
        <thead>
          <tr>
            <th scope="col">Event</th>
            <th scope="col">What a flow-based team looks at</th>
          </tr>
        </thead>
        <tbody>
          {SCRUM_EVENTS_FLOW.map((row) => (
            <tr key={row.event}>
              <th scope="row" className="scrumban-table__event">{row.event}</th>
              <td>{row.focus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** H15: how a Scrum team applies Kanban practices inside a Sprint. */
export function ScrumbanChapter() {
  const { state, actions } = useFlowLab();
  const answered = SPRINT_SCENARIOS.filter((s, i) => state.scrumbanAnswers[i] != null).length;
  const correct = SPRINT_SCENARIOS.filter((s, i) => state.scrumbanAnswers[i] === s.answer).length;

  return (
    <section className="chapter chapter--medium">
      <p className="lead lead--compare">
        You don't have to choose between Scrum and Kanban. {SCRUMBAN_SUMMARY} The Kanban Guide for Scrum Teams adds a{' '}
        <GlossaryTerm term="dow">Definition of Workflow</GlossaryTerm> and the four flow metrics,{' '}
        <GlossaryTerm term="wip">WIP</GlossaryTerm>, <GlossaryTerm term="tp">throughput</GlossaryTerm>,{' '}
        <GlossaryTerm term="age">work item age</GlossaryTerm> and <GlossaryTerm term="cycle">cycle time</GlossaryTerm>,
        so the team can see and improve how work flows during the Sprint.
      </p>

      <div>
        <SectionHeader
          title="The Definition of Workflow"
          note="The Developers own it. The whole Scrum team inspects and adapts it every Sprint."
        />
        <div className="card-grid card-grid--practices">
          {DEFINITION_OF_WORKFLOW.map((element, i) => (
            <WorkflowElementCard key={element.title} number={i + 1} element={element} />
          ))}
        </div>
        <p className="body-note scrumban__sle-note">
          <strong>
            <GlossaryTerm term="sle">Service Level Expectation</GlossaryTerm>.
          </strong>{' '}
          Base the SLE on your own cycle time data, for example the{' '}
          <GlossaryTerm term="p85">85th percentile</GlossaryTerm>. During the Sprint, compare each item's age with the
          SLE: an item close to it needs attention before it becomes late.
        </p>
      </div>

      <ScrumEventsTable />

      <div>
        <SectionHeader
          title="Challenge · Sprint flow"
          note={`What would a flow-based Scrum team do? Get ${THRESHOLDS.scrumbanCorrectAnswers} of ${SPRINT_SCENARIOS.length} right to earn ${FLOW_SPRINTER.name} (+${FLOW_SPRINTER.amount} XP).`}
        />
        <p className="scrumban__score">
          <span role="status" aria-live="polite">
            {correct}/{answered} correct
          </span>
        </p>
        <div className="sort-grid">
          {SPRINT_SCENARIOS.map((scenario, index) => (
            <SprintScenarioCard
              key={scenario.event}
              scenario={scenario}
              pick={state.scrumbanAnswers[index]}
              onAnswer={(option) => actions.answerSprintScenario(index, option)}
            />
          ))}
        </div>
      </div>

      <p className="note">
        Sources:{' '}
        <a href={SOURCES.kanbanGuideScrumTeams} target="_blank" rel="noopener noreferrer">
          The Kanban Guide for Scrum Teams (Scrum.org)
        </a>{' '}
        and{' '}
        <a href={SOURCES.scrumGuide} target="_blank" rel="noopener noreferrer">
          The Scrum Guide (2020)
        </a>
        .
      </p>
    </section>
  );
}
